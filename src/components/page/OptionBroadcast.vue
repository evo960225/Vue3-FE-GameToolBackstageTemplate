<template>
  <el-container direction="vertical">

    <el-tabs v-model="activeTab">
      <el-tab-pane label="推播" name="t1" v-loading="isLoading">
        <div class="m-4 p-4 shadow-lg rounded-lg min-w-[300px] w-1/2 md:w-auto ">
          
          <div class="ml-4 space-y-4">

            <div class="flex">
              <div class="w-20 my-auto"><label>伺服器：</label></div>
               <SearchServer 
                v-model:value="uiServerId" 
                all-server-option="true"
              />
              <div class="ml-6 w-16 my-auto"><label>排程：</label></div>
              <el-switch 
                v-model="isSchduling"
                class="my-auto"
              />
            </div>
            <!-- Schduling -->
            <div v-if="isSchduling" class="space-y-4">
              <div class="flex">
                <div class="w-20 my-auto"><label>期間：</label></div>
                <SearchDateTimeScope title="" v-model:start="startTime"  v-model:end="endTime" />
              </div>

              <div class="flex">
                <div class="w-20 my-auto"><label>頻率：</label></div>
                <el-select v-model="frequencyOption" class="" placeholder="Select">
                <el-option
                  v-for="item in frequencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                />
                </el-select>
              </div>
            </div>
          </div>

          <div class="mx-2 p-4 relative">
            <el-input v-model="inputContent" type="textarea" placeholder="內容" 
                      :rows="4" maxlength="200" show-word-limit
                      class="my-1">
            </el-input>
            <el-button v-if="!isSchduling" class="my-1" @click="pushMessage">推送</el-button>
            <el-button v-if="isSchduling" class="my-1" @click="scheduleMessage">設定排程</el-button>
          </div>
        </div>

        <!-- 清單 -->
        <el-card class="my-8 mx-4 shadow-xs relative">
          <UiPageTable :data="scheduleData" :isLoading="isLoadingTable" 
              v-model:page="tablePage" 
              v-model:page-size="tableSize"
              :data-length="tableLength"
              @page-change="searchScheduleList"
            >
            <el-table-column prop="serverId" label="Server ID"  width="120">
              <template #default="scope">
                {{ scope.row.serverId === -1 ? '全服' : scope.row.serverId }}
              </template>
            </el-table-column>
            <el-table-column prop="startTimeString" label="開始時間"  width="250"/>
            <el-table-column prop="endTimeString" label="結束時間"  width="250"/>
            <el-table-column prop="description" label="頻率" width="110" />
            <el-table-column prop="announceContent" label="內容" />
            <el-table-column label="刪除" width="70" align="center">
              <template #default="scope">
                <el-link type="danger" @click="removeSchedule(scope.row.id)">
                  <font-awesome-icon :icon="['fas', 'times']" class="m-auto" />
                </el-link>
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
import axiosApi from '../../js/axiosApi'
import moment from 'moment';
import SearchServer from '../search_ui/SearchServer.vue';
import UiPageTable from '../ui/UiPageTable.vue';
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import showMessage from '../../js/poolMessage';


const activeTab = ref('t1')
const isLoading = ref(false)
const uiServerId = ref()
const inputContent = ref('')
// 排程
const isSchduling = ref()
const startTime = ref()
const endTime = ref()
const frequencyOption = ref()
const frequencyList = ref([
  { label:'1分鐘', value: [1,,,,] },
  { label:'2分鐘', value: [2,,,,] },
  { label:'3分鐘', value: [3,,,,] },
  { label:'5分鐘', value: [5,,,,] },
  { label:'10分鐘', value: [10,,,,] },
  { label:'15分鐘', value: [15,,,,] },
  { label:'30分鐘', value: [30,,,,] },
  { label:'1小時', value: [0,1,,,] },
  { label:'2小時', value: [0,2,,,]},
  { label:'3小時', value: [0,3,,,] },
  { label:'4小時', value: [0,4,,,] },
  { label:'6小時', value: [0,6,,,] },
  { label:'12小時', value: [0,12,,,] },
  { label:'1天', value: [0,0,1,,] },
])




const pushMessage = () => {
  const param = {
    serverId: uiServerId.value,
    content: inputContent.value
  }

  isLoading.value = true

  axiosApi
  .post('api/game/send-announcement', param )
    .then((res)=> {
      showMessage(res)
    })
    .catch((error)=>{
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      inputContent.value = ''
      isLoading.value = false
    })

}

const scheduleMessage = () => {
  const param = {
    serverId: uiServerId.value,
    startTime: moment(startTime.value).format('YYYY-MM-DD HH:mm:ss') ,
    endTime:  moment(endTime.value).format('YYYY-MM-DD HH:mm:ss'),
    content: inputContent.value,
    description: frequencyOption.value.label
  }
  const monentStart = moment(startTime.value)
  const frequency = frequencyOption.value.value
  param['frequency'] = 
    (frequency[0] ? 
      (monentStart.minute() % frequency[0] + '-59/' + frequency[0])
    : (frequency[0] === 0 ? monentStart.minute() : '*'))
    + ' ' + 
    (frequency[1] ? 
      (monentStart.hour() % frequency[1] + '-23/' + frequency[1])
    : (frequency[1] === 0 ? monentStart.hour() : '*'))
    + ' ' + 
    (frequency[2] ? 
      (monentStart.day() % frequency[2]+ '-31/' + frequency[2])
    : (frequency[2] === 0 ? monentStart.day() : '*'))
    + ' ' + 
    (frequency[3] ? 
      (monentStart.month() % frequency[3] + '-12/' + frequency[3])
    : (frequency[3] === 0 ? monentStart.month() : '*')) 
    + ' ' + 
    (frequency[4] ? 
      (monentStart.year() % frequency[4] + '-2099/' + frequency[4])
    : (frequency[4] === 0 ? monentStart.year() : '*'))

  isLoading.value = true

  axiosApi
  .post('api/game/schedule-announcement', param )
    .then((res)=> {
      if (res.data.message==='OK') {
        ElMessage.success('排程設定成功！')
      } else {
        throw new expect('排程設定失敗！')
      }
    })
    .catch((error)=>{
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      inputContent.value = ''
      isLoading.value = false
      searchScheduleList()
    })

  }


  // 清單
  const scheduleData = ref()
  const isLoadingTable = ref(false)
  const tablePage = ref(1)
  const tableSize = ref(25)
  const tableLength = ref()
  
  const searchScheduleList = async() => {
    isLoadingTable.value = true
    const param = {
      page: tablePage.value,
      pageSize: tableSize.value
    }
    axiosApi
    .get('api/game/schedule-announcement', { params: param })
    .then((res)=> {
      const page = res.data
      tableLength.value = page.total
      scheduleData.value = page.data
    })
    .catch((error)=>{
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      isLoadingTable.value = false

    })
  }
  const removeSchedule = async(id) => {
    isLoadingTable.value = true
    const param = {
      id: id
    }
    axiosApi
    .delete('api/game/schedule-announcement', { params: param })
    .then((res)=> {
       if (res.data.message==='OK') {
        ElMessage.success('刪除成功！')
      } else {
        throw new expect('刪除失敗！')
      }
    })
    .catch((error)=>{
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      searchScheduleList()
      isLoadingTable.value = false
    })
  }
  
  onMounted(()=> searchScheduleList())
</script>

<style>
</style>
