
import { createRouter, createWebHistory } from 'vue-router'
import axiosApi from './js/axiosApi'
import menuList from '@/js/mainMenuList'

const DEFAULT_TITLE = '後台';

// =================================================================================
const menuData = menuList
  .map((x)=> 
      x.children.map((x)=> 
          x.children
              .filter(item=>item.component)
              .map((item) => {
                  item.meta = { title: item.label } 
                  item.path = item.index
                  //item.component = item.component
                  return item
          })
      )
  ).flat(2)

const router =  createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: ()=>import("./components/auth/AuthLogin.vue"),
      meta: { title: '登入' } 
    }, {
      path: '/',
      component: ()=>import("./components/MainPage.vue"),
      children: [
        {
            name: 'Home',
            path: '/',
            component: ()=>import("./components/Home.vue"),
            meta: { title: '' } 
        },
        {
          path: '/accounts/user-profile',
          component: ()=>import("./components/accounts_manage_page/AccountUserProfile.vue"),
          meta: { title: '個人資料' }
        },
        ...menuData
      ]},
    /* 404 */ 
    {
      path: '/:pathMatch(.*)*',
      component: ()=>import("./components/auth/PageNotFound.vue"),
    }
  ]
})

// =================================================================================


if (!localStorage.app_version) {
    localStorage.app_version = 'dev'
}
const token = localStorage.getItem('token') || null
axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}` 

// 路由發生前事件
router.beforeEach(async(to, from, next) => {
  // load page init
  document.title = (to.meta.title ? to.meta.title  + ' / ' +  DEFAULT_TITLE : DEFAULT_TITLE)  
   
  // able access?
  let canAccess = true
  await storageUserData().catch(() => canAccess=false)
  if (!localStorage.getItem('role')) canAccess = false
  
  if(canAccess) {
    // 取得認證後，如果在登入頁面則跳轉主頁
    to.name === 'Login' ? next({ name: 'Home' }) : next()
  } else {
    // 認證無效、錯誤、沒有認證等，如果不在登入頁面則跳轉登入頁面
    to.name !== 'Login' ? next({ name: 'Login' }) : next()
  }
})

async function storageUserData() {
  await axiosApi
    .get('/api/check-state')
    .then((res) => {
        const data = res.data;
        localStorage.setItem('role', data.roles[0] || '')
        localStorage.setItem('username', data.username || '')
        localStorage.setItem('email', data.email || '')
        if (data.permissions) {
          localStorage.setItem('permissions', JSON.stringify(data.permissions))
        } 
    })
}

// 自動檢測登入狀態，當登入token失效則重新整理頁面
setInterval(() => { 
  axiosApi.get('/api/check-state').then((res) => {
    const data = res.data;
    if(!data.roles) router.go(0)
  })
}, 10 * 60 * 1000); // 10 min

export default router;