<template>
  <el-container direction="vertical">
    <div v-if="activeTab !== 'gameStart'" class="flex mx-3 mt-3 mb-6">
      <label>伺服器：</label>
      <SearchServer 
        v-model:value="uiServerId"
        @change="getConfig" 
        all-server-option="true"
        class="mx-4"
      />
    </div>
    <el-tabs v-model="activeTab">
      
      <el-tab-pane label="常態公告" name="everyTime" v-loading="isLoading" >
        <el-card header="當前內容" class="m-4">
          <pre>{{ serverEveryTimeAnnouncement && serverEveryTimeAnnouncement.content }}</pre>
        </el-card>
        <el-card class="m-4 p-2 shadow-md relative">
          <div class="mb-2 text-orange-500/60">注意：字數長度需大於10個字</div>
          <el-input v-model="inputContent" type="textarea" placeholder="內容" 
                    :rows="4" minlength="10" maxlength="200" show-word-limit
                    class="my-1">
          </el-input>
          <el-button class="my-1" @click="pushMessage">推送</el-button>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="一次性公告" name="once" v-loading="isLoading" >
        <el-card header="當前內容" class="m-4">
          <pre>{{ serverOnceAnnouncement && serverOnceAnnouncement.content }}</pre>
        </el-card>
        <el-card class="m-4 p-2 shadow-md relative">
          <div class="mb-2 text-orange-500/60">注意：字數長度需大於10個字</div>
          <el-input v-model="inputContent" type="textarea" placeholder="內容" 
                    :rows="4" minlength="10" maxlength="200" show-word-limit
                    class="my-1">
          </el-input>
          <el-button class="my-1" @click="pushMessage">推送</el-button>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="期間公告" name="period" v-loading="isLoading" >
        <el-card header="當前內容" class="m-4">
          <div v-if="announcementConfig">
            <pre>{{ serverPeriodAnnouncement && serverPeriodAnnouncement.content }}</pre>
            <div class="mt-8 text-sm"> 
              設定時間：
              {{ serverPeriodAnnouncement && new Date (serverPeriodAnnouncement.startTime).toLocaleString() }}
              -
              {{ serverPeriodAnnouncement && new Date (serverPeriodAnnouncement.endTime).toLocaleString() }}
            </div>
          </div>
        </el-card>
        <el-card class="m-4 p-2 shadow-md relative">
          <SearchDateTimeScope v-model:start="timeStart" v-model:end="timeEnd" />
          <div class="mt-6 text-orange-500/60">注意：字數長度需大於10個字</div>
          <el-input v-model="inputContent" type="textarea" placeholder="內容" 
                    :rows="4" minlength="10" maxlength="200" show-word-limit
                    class="my-1">
          </el-input>
          <el-button class="my-1" @click="pushMessage">推送</el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import axiosApi from '../../js/axiosApi'
import showMessage from '../../js/poolMessage';
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import SearchServer from '../search_ui/SearchServer.vue';
import SearchPlatform from '../search_ui/SearchPlatform.vue';

const activeTab = ref('everyTime')
const isLoading = ref(false)
const uiServerId = ref()
const inputContent = ref('')
const timeStart = ref()
const timeEnd = ref()
const announcementConfig = ref()
const isLive = ref(localStorage.app_version === 'live')

const pushMessage = () => {
  
  const param = {
    serverId : uiServerId.value,
    announcementType: activeTab.value,
    timeStart: activeTab.value==='period' ? timeStart.value.getTime() : '',
    timeEnd: activeTab.value==='period' ? timeEnd.value.getTime() : '',
    content: inputContent.value
  }
  if (inputContent.value.length < 10) {
    ElMessage.error('公告內容長度需大於10')
    return 
  }

  isLoading.value = true
  axiosApi
    .post('api/game/update-login-announcement', param )
    .then((res)=> {
      showMessage(res)
    })
    .catch((error)=>{
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      inputContent.value = ''
      isLoading.value = false
      getConfig()
    })

}

const gameStartAnnouncement = ref()
const serverEveryTimeAnnouncement = ref()
const serverOnceAnnouncement = ref()
const serverPeriodAnnouncement = ref()
const getConfig = async() => {

  // 全服設定不顯示
  if (uiServerId.value === -1) {
    announcementConfig.value = null
    serverEveryTimeAnnouncement.value = { content: '-' }
    serverOnceAnnouncement.value = { content: '-' }
    serverPeriodAnnouncement.value = { content: '-' }
    return
  }

  isLoading.value = true
  const param = {
    serverId : uiServerId.value,
  }
  axiosApi
    .get('api/game/announcement', { params: param })
    .then((res)=> {
      announcementConfig.value = res.data
      serverEveryTimeAnnouncement.value = res.data.everyTime
      serverOnceAnnouncement.value = res.data.once
      serverPeriodAnnouncement.value = res.data.period
    })
    .catch((error)=>{

    })
    .finally(()=> {
      isLoading.value = false
    })

}

// 登入前
const startPlatform = ref('G18')
const pushGameStartMessage = async() => {
  const param = {
    platform: startPlatform.value,
    content: inputContent.value
  }

  isLoading.value = true
  axiosApi
    .post('api/game/update-start-announcement', param)
    .then((res)=> {
      ElMessage.success('設定成功！CDN更新需等數分鐘~')
    })
    .catch((error)=>{
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      inputContent.value = ''
      isLoading.value = false
      getGameStartConfig()
    })

}


onMounted(() => {
  getConfig()
})
</script>

<style>
</style>
