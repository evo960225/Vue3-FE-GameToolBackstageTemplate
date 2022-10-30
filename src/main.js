// vue, vue-router, vuex
import { createApp } from 'vue'
import store from './store'
import router from './router'
// element-plus
import ElementPlus from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import 'element-plus/dist/index.css'
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'


// others

// enter
import App from './App.vue'
import './main.scss'

library.add(fab, far, fas)



const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhTw, })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')


