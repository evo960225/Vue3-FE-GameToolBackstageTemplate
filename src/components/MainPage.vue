<!--
    +------------------------------+
    |  header                      |
    |------------------------------|
    |  menu  |       content       |
    |        |                     |
    |        |                     |
    |        |                     |
    |        |                     |
    +------------------------------+

-->
<template>
  <el-container class="h-screen" :class="appVersion">

    <!------ header ------>
    <el-header class="h-auto shadow-sm relative z-40 px-4 xs:leading-none">
      <div class="flex justify-between">
        <!-- title -->
        <div class="title flex ml-3 my-2.5 xs:ml-0">
          <span class="
            m-auto text-1.5xl font-bold tracking-010
            duration-300 hover:opacity-50
            xs:text-xl 
          ">
            <a href='/'>
              <span>遊戲後台</span>
              <span class="xs:hidden">範例</span>
            </a>
          </span>
        </div>
        
        <div class="flex my-auto sm:space-x-1 mr-1">

          <!-- version select -->
          <div class="mr-4">
            <el-select v-model="appVersion" class="version w-20" placeholder="Select" size="small">
              <el-option
                v-for="item in versionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>

          <!-- user profile -->
          <div class="user-profile my-auto flex">
            <el-dropdown class="text-md">
              <el-icon class="ml-3 mr-1 my-auto">
                <font-awesome-icon :icon="['fas', 'cog']" class="m-auto duration-700 hover:rotate-180 mr-3" />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goUserProfile">個人資料</el-dropdown-item>
                  <el-dropdown-item @click="logout">登出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span class="text-sm xs:hidden">{{ username }}</span>
          </div>
          <!-- xs menu  -->
          <div class="pl-1
            text-md
            hidden sm:block
            my-auto duration-300" 
            @click="sidebarDisplay = !sidebarDisplay">
            <el-icon>
              <div v-if="!sidebarDisplay">
                <font-awesome-icon :icon="['fas', 'bars']" class="m-auto" />
              </div>
              <div v-if="sidebarDisplay">
                <font-awesome-icon :icon="['fas', 'times']" class="m-auto" />
              </div>
            </el-icon>
          </div>
        </div>
      </div>
    </el-header>

    <el-container class="h-4/5">

      <!------ menu ------->
      <el-aside
        class="
        w-1/7 min-w-[240px] max-w-[300px] overflow-y-scroll h-full duration-400
        sm:max-w-none sm:w-full"
        :class="{ 'sm-hidden':!sidebarDisplay }">
        <el-menu  
          :default-openeds="['1']" 
          :unique-opened="true"
          :router="true"
          active-text-color="#FF9"
          class="mt-2"
        >
          <!-- # main menu -->
          <div v-for="mainBlock in filter_permissions" :key="mainBlock.id" >
            <el-sub-menu v-if="mainBlock.display" :index="mainBlock.id.toString()">
              <template #title>
                <font-awesome-icon :icon="menuMapIcon[mainBlock.id]" class="mr-3" />
                {{ mainBlock.label }}
              </template>

              <!--## group -->
              <div v-for="itemGroup in mainBlock.children" :key="itemGroup.id">
                <el-menu-item-group v-if="itemGroup.display">
                  <template #title>{{ itemGroup.label }}</template>

                  <!--### menu-item -->
                  <div v-for="item in itemGroup.children" :key="item.id" :id="item.id">
                    <el-menu-item @click="sidebarDisplay=false"  v-if="item.display" :index="item.index" :disabled="item.disable">
                      {{ item.label }}
                    </el-menu-item>
                  </div>
                </el-menu-item-group>
              </div>

            </el-sub-menu>
          </div>
        </el-menu>
      </el-aside>

      <!------ page content ------>
      <el-main class="
        overflow-y-scroll h-full 
        transition-all duration-100
        sm:pl-2 sm:pr-3
      ">
        <el-container class="overflow-y-auto">
          <transition name="slide-fade">
            <router-view>
            </router-view>
           </transition>
        </el-container>
      </el-main>

    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watchEffect, defineExpose, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import menuList from '../js/mainMenuList'
import axiosApi from '../js/axiosApi'


const sidebarDisplay = ref(false)
//  Loading --------
const router = useRouter()
const username = ref(localStorage.getItem('username'))
const userRole = ref(localStorage.getItem('role'))
const filter_permissions = ref()
const versionOptions = ref([
  { 'label': 'Dev', 'value': 'dev', disabled: false },
  { 'label': 'Test', 'value': 'test', disabled: false },
])

if(!localStorage.app_version) {
  localStorage.app_version = 'dev'
}
axiosApi.defaults.headers.common['App-Version'] = localStorage.app_version
const appVersion = computed({
  get:() => localStorage.app_version ,
  set: (val) => { 
    localStorage.app_version = val
    router.go(0)
  }
})


// 權限過濾
permissionFilterMenu()

  // 設定表單icon
const menuMapIcon = {
  1: ['fas', 'user'],
  2: ['fas', 'chart-pie'],
  3: ['fas', 'server'],
  4: ['fas', 'address-card'],
}


// Event --------
const logout = () => {
  axiosApi.post('/logout')
  .then((res) => {
    ElMessage({ message: res.data.msg , type: 'success',})
    router.go(0)
  })
}



// Method
const goUserProfile = () => {
  router.push({'path': "/accounts/user-profile"})
}


// 表單依照權限顯示項目
function permissionFilterMenu() {

  const strPermissions = localStorage.getItem('permissions')  ||  "[]"
  const jsonPermissions = JSON.parse(strPermissions)
  const permissions = jsonPermissions.map((e) => e.permission_id)

  const isAdmin = () => localStorage.getItem('role')==='admin'
  const filter = (node) => {
    let is_parent_show = false

    node.forEach((e,i,a) => {
      if(e.children) {
        a[i].display = filter(e.children)
      } else {
        a[i].display = permissions.includes(e.id) || isAdmin()
      }
      is_parent_show = a[i].display || is_parent_show
    })
    return is_parent_show
  }
  filter(menuList)
  filter_permissions.value = menuList
  
}


</script>
<!------------------------------------------------------------------------->
<style lang="scss">

.el-aside .el-sub-menu .el-menu-item {
    height: 46px;
    line-height: 46px;
    font-size: 12.5px;
}
.el-aside .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
    font-size: 12.5px;
}
.el-menu-item-group .el-menu-item-group__title {
    letter-spacing: 5px;
    font-size: 11px;
}
.dev {
  & .el-header {
    background-color: rgb(244, 121, 131);
    color: rgb(255, 255, 255);
    box-shadow: 1px 1px 6px rgb(155, 155, 155);

    & .title {
      
    }
    & .user-profile .el-dropdown {
      color: #FFF
    }
    & .el-input__inner {
      color: #FFF
    }
  }

  & .el-aside {
    background-color: rgb(255, 250, 250);
    
    & .el-sub-menu {
      border: 1px solid rgb(255, 255, 255);

      & .el-sub-menu__title {
        background-color: rgb(255, 255, 255);
        color: rgb(95, 105, 119);
        box-shadow: 1px 1px 6px rgb(216, 216, 216);
        z-index: 20;
        border-radius: 10px;
        margin: 3px 7px;
        font-weight: 500;
        letter-spacing: 3px;
        
      }
      & .el-menu-item-group {
        
        padding: 5px;
        border-radius: 10px;
        box-shadow: 0px 2px 6px rgb(216, 216, 216);
        margin: 3px 7px;

        & .el-menu-item-group__title {
          background-color: #FFB3A7;
          color: rgb(255, 255, 255);
          @apply  mx-auto my-auto text-xs text-left relative z-10;
          padding: 8px 40px !important;
          box-shadow: 1px 1px 6px rgb(216, 216, 216);
          border-radius: 5px;
          
        }
      }
      & .el-menu-item {
        background-color: rgb(255, 255, 255);
        color: rgb(108, 125, 146);
        letter-spacing: 2px;
        @apply hover:bg-[#f4fcf3];
        &.is-active {
          background: linear-gradient(
            45deg, 
            #ebffe3 0, #ebffe3 35%, #ffffff 35%, #ffffff 50%, 
            #ebffe3 50%, #ebffe3 85%, #ffffff 85%, #ffffff
          )!important;
          background-size: 16px 16px !important;
          border-radius: 5px;
          box-shadow: 1px 1px 1px #FED;
          z-index: 9;
        }
      }
    }

  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
    
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(233, 220, 220); 
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(197, 185, 185); 
  }

}

.test {
  & .el-header {
    background-color: rgb(244, 121, 131);
    color: rgb(255, 255, 255);
    box-shadow: 1px 1px 6px rgb(155, 155, 155);

    & .title {
      
    }
    & .user-profile .el-dropdown {
      color: #FFF
    }
    & .el-input__inner {
      color: #FFF
    }
  }

  & .el-aside {
    background-color: rgb(255, 250, 250);
    
    & .el-sub-menu {
      border: 1px solid rgb(255, 255, 255);

      & .el-sub-menu__title {
        background-color: rgb(255, 255, 255);
        color: rgb(95, 105, 119);
        box-shadow: 1px 1px 6px rgb(216, 216, 216);
        z-index: 20;
        border-radius: 10px;
        margin: 3px 7px;
        font-weight: 500;
        letter-spacing: 3px;
        
      }
      & .el-menu-item-group {
        
        padding: 5px;
        border-radius: 10px;
        box-shadow: 0px 2px 6px rgb(216, 216, 216);
        margin: 3px 7px;

        & .el-menu-item-group__title {
          background-color: #FFB3A7;
          color: rgb(255, 255, 255);
          @apply  mx-auto my-auto text-xs text-left relative z-10;
          padding: 8px 40px !important;
          box-shadow: 1px 1px 6px rgb(216, 216, 216);
          border-radius: 5px;
        }
      }
      & .el-menu-item {
        background-color: rgb(255, 255, 255);
        color: rgb(108, 125, 146);
        
        letter-spacing: 2px;
        @apply hover:bg-[#f4fcf3];

        &.is-active {
          background-color: #f4fcf3 !important;
        }
      }
    }

  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
    
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(233, 220, 220); 
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(197, 185, 185); 
  }

}
//-----------------------------------

.slide-fade-enter-active {
  transition: all 0.5s;
}

.slide-fade-leave-active {
  transition: all 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
}

.version .el-input__inner {
  padding: 3px;
  height: auto;
}
.version .el-input__wrapper {
  background: transparent;
}
.version .el-input__wrapper .el-select__icon {
  color: #f1f1f1;
  margin-top: 1px;
}
.el-aside.sm-hidden {
  @apply sm:-ml-[100%];
}
</style>
