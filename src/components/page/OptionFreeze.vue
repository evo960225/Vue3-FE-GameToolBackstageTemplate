<template>
  <el-container direction="vertical">

    <el-tabs v-model="activeTab">
      
      <el-tab-pane label="封禁玩家" name="player" v-loading="isLoading" >
        <!-- 操作表單 -->
        <el-card class="m-4 p-3 shadow-md relative">
          <div class="flex ">
            <label>伺服器：</label>
            <SearchServer 
              v-model:value="uiServerId"
              @change="pageReload" 
              all-server-option="false"
              class="mr-3"
            />
            <el-input v-model="playerId" type="text" placeholder="玩家ID" class="w-72"/>
          </div>
          <div class="flex ml-1 my-6 ">
            <el-switch
              v-model="isfreeze"
              :size="large"
              active-text="封禁"
              inactive-text="解禁"
              class="my-auto mr-5"
            />
            <div class="my-auto w-72" v-if="isfreeze">
              時間：
              <el-select v-model="freezeTime" class="" placeholder="Select" size="large">
                <el-option
                  v-for="item in freezeTimeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <el-button class="" @click="sendConfig">確認</el-button>
        </el-card>

        <!-- 名單 -->
        <el-card class="m-4 shadow-xs relative">
          <UiPageTable :data="playerData" :isLoading="isLoadingPlayerTable" 
              v-model:page="playerTablePage" 
              v-model:page-size="playerTableSize"
              :data-length="playerTableLength"
              @page-change="searchPlayer"
            >
            <el-table-column prop="name" label="玩家名稱" />
            <el-table-column prop="id" label="玩家ID" width="220" />
            <el-table-column prop="serverId" label="伺服器ID" width="110" />
            <el-table-column prop="freeze_end_time" label="結束時間" align="right">
              <template #default="scope">
                {{ 
                  scope.row.freeze_end_time != -1 ?
                    new Date(scope.row.freeze_end_time).toLocaleString() :
                    '永久'
                }}
              </template>
            </el-table-column>
            
          </UiPageTable>
        </el-card>
      </el-tab-pane>


      <el-tab-pane label="封禁IP" name="ip" v-loading="" >
        <el-card class="m-4 p-3 shadow-md relative">
          <div class="flex">
            <label>伺服器：</label>
            <SearchServer 
              v-model:value="uiServerId"
              @change="pageReload" 
              all-server-option="false"
              class="mr-3"
            />
            <el-input v-model="ip" type="text" placeholder="IP" class="w-72"/>
          </div>
          <div class="flex ml-1 my-6">
            <el-switch
              v-model="isfreeze"
              :size="large"
              active-text="封禁"
              inactive-text="解禁"
              class="my-auto mr-5"
            />
            <div class="my-auto w-72" v-if="isfreeze">
              時間：
              <el-select v-model="freezeTime" class="">
                <el-option
                  v-for="item in freezeTimeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          
          <el-button class="" @click="sendConfig">確認</el-button>
        </el-card>

        <!-- 名單 -->
        <el-card class="m-4 shadow-xs relative">
          <UiPageTable :data="ipData" :isLoading="isLoadingIpTable" 
              v-model:page="ipTablePage" 
              v-model:page-size="ipTableSize"
              :data-length="ipTableLength"
              @page-change="searchIpList"
            >
            <el-table-column prop="ip" label="IP" />
            <el-table-column prop="serverId" label="伺服器ID" width="110" />
            <el-table-column prop="freeze_end_time" label="結束時間" align="right">
              <template #default="scope">
                {{ 
                  scope.row.freeze_end_time != -1 ?
                    new Date(scope.row.freeze_end_time).toLocaleString() :
                    '永久'
                }}
              </template>
            </el-table-column>
            
          </UiPageTable>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import UiPageTable from '../ui/UiPageTable.vue';
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import axiosApi from '../../js/axiosApi'
import SearchServer from '../search_ui/SearchServer.vue';
const freezeTime = ref(30*24*60*60000)
const freezeTimeList = ref([
  { label:'5分鐘', value: 5*60000 },
  { label:'10分鐘', value: 10*60000 },
  { label:'15分鐘', value: 15*60000 },
  { label:'30分鐘', value: 30*60000 },
  { label:'1小時', value: 60*60000 },
  { label:'2小時', value: 2*60*60000 },
  { label:'3小時', value: 3*60*60000 },
  { label:'6小時', value: 6*60*60000 },
  { label:'12小時', value: 12*60*60000 },
  { label:'1天', value: 1*24*60*60000 },
  { label:'2天', value: 2*24*60*60000 },
  { label:'3天', value: 3*24*60*60000 },
  { label:'7天', value: 7*24*60*60000 },
  { label:'14天', value: 14*24*60*60000 },
  { label:'30天', value: 30*24*60*60000 },
  { label:'60天', value: 60*24*60*60000 },
  { label:'90天', value: 90*24*60*60000 },
  { label:'不限', value: -1 },
])
const activeTab = ref('player')
const isLoading = ref(false)
const inputContent = ref('')
const uiServerId = ref('')
const ip = ref()
const playerId = ref()
const isfreeze = ref()
const timeEnd = ref()
const announcementConfig = ref()



const sendConfig = async() => {
  isLoading.value = true

  const param = {
    serverId: uiServerId.value,
    ip: activeTab.value==='ip' ? ip.value : null,
    playerId: activeTab.value==='player' ? playerId.value: null,
    isFreeze: isfreeze.value ? 1 : 0,
    freezeTime: freezeTime.value
  }
  axiosApi
  .post('api/game/freeze-player', param )
  .then((res)=> {
    ElMessage.info('目前功能未完全~')
  })
  .catch((error)=>{
      ElMessage.error(error.toLocaleString())
  })
  .finally(()=> {
    pageReload()
  })

}
const pageReload = () => {
  ip.value = ''
  playerId.value = ''
  isfreeze.value = 0
  freezeTime.value = 30*24*60*60000
  isLoading.value = false
  searchPlayer()
  searchIpList()
}

// table player
const playerData = ref()
const playerTableLength = ref()
const playerTablePage = ref(1)
const playerTableSize = ref(25)
const isLoadingPlayerTable = ref(false)
const searchPlayer = async() => {
  isLoadingPlayerTable.value = true
  const param = {
    serverId: uiServerId.value,
    page: playerTablePage.value,
    pageSize: playerTableSize.value
  }
  axiosApi
  .get('api/game/freezed-player', { params: param })
  .then((res)=> {
    const page = res.data
    playerTableLength.value = page.total
    playerData.value = page.items
  })
  .catch((error)=>{
      ElMessage.error(error.toLocaleString())
  })
  .finally(()=> {
    isLoadingPlayerTable.value = false

  })
}

// table ip
const ipData = ref()
const ipTableLength = ref()
const ipTablePage = ref(1)
const ipTableSize = ref(25)
const isLoadingIpTable = ref(false)
const searchIpList = async() => {
  isLoadingIpTable.value = true
  const param = {
    serverId: uiServerId.value,
    page: ipTablePage.value,
    pageSize: ipTableSize.value
  }
  axiosApi
  .get('api/game/freezed-ip', { params: param })
  .then((res)=> {
    const page = res.data
    ipTableLength.value = page.total
    ipData.value = page.items
  })
  .catch((error)=>{
      ElMessage.error(error.toLocaleString())
  })
  .finally(()=> {
    isLoadingIpTable.value = false
  })
}

onMounted(() => {
  searchPlayer()
  searchIpList()
})
</script>

<style>
</style>
