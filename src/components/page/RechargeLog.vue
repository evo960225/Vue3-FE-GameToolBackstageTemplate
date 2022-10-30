<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="my-4">
      <div class="flex">
        <div>
          <SearchServer 
            v-model:value="uiServerId" 
            all-server-option="true"
          />
          <SearchChannel
            v-model:value="uiChannel" 
          />
          <div class="flex justify-self-center mt-4 xl:block xl:space-y-2">
            <div class="">
              <SearchDate v-model:date="uiDate"></SearchDate>
            </div>
            <div class="ml-2">
              <el-time-select
                v-model="uiStartTime"
                :max-time="uiEndTime"
                class=""
                placeholder="開始時段"
                start="00:00"
                step="00:15"
                end="23:59"
              />
              <span class="text-gray-500 mx-2">-</span>
              <el-time-select
                v-model="uiEndTime"
                :min-time="uiStartTime"
                placeholder="結束時段"
                start="00:00"
                step="00:15"
                end="23:59"
              />
            </div>
            <el-button class="ml-2" @click="searchData(true)" :disabled="!uiServerId||!uiChannel">查詢</el-button>
          </div>
        </div>

        <div class="m-auto mb-0 mr-6 text-red-400 text-lg">
          * 總計金額： {{ totalMoney? totalMoney.toLocaleString() : 0 }}
        </div>
      
      </div>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="充值日誌" name="account">
        <div class="m-4 shadow-md relative">
          <UiPageTable :data="userData" :isLoading="loading" 
            v-model:page="page" 
            v-model:page-size="pageSize"
            :data-length="dataLength"
            @page-change="searchData"
          >
            <el-table-column prop="PlayerName" label="玩家名稱" />
            <el-table-column prop="ServerID" label="伺服器ID" width="250"/>
            <el-table-column prop="ReadingName" label="商品"/>
            <el-table-column prop="money" label="金額"  align="right">
              <template #default="scope">
                {{ ( scope.row.money ).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="time" label="時間"  align="right"  width="230">
              <template #default="scope">
                {{ new Date(scope.row.time).toLocaleString() }}
              </template>
            </el-table-column>
 
          </UiPageTable>
        </div>
      </el-tab-pane>

    </el-tabs>
  </el-container>
</template>


<script setup>
import SearchUser from '../search_ui/SearchUser.vue'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import UiPageTable from '../ui/UiPageTable.vue';
import SearchDate from '../search_ui/SearchDate.vue';
import axiosApi from '@/js/axiosApi'
import moment from 'moment';
import SearchServer from '../search_ui/SearchServer.vue';
import SearchChannel from '../search_ui/SearchChannel.vue';

const activeTab = ref('account')
const uiDate = ref(new Date())
const uiStartTime = ref('00:00')
const uiEndTime = ref('23:59')
const page = ref(1)
const pageSize = ref(25)
const dataLength = ref()
const uiServerId = ref()
const uiChannel = ref()
const uiUser = ref()
const userData = ref()
const loading = ref(false)
const totalMoney = ref()

// function
async function searchData(isbtnEvent) {
  loading.value = true
  if (isbtnEvent) {
    page.value = 1
  }

  const param = {
    serverId: uiServerId.value,
    channel: uiChannel.value,
    page: page.value,
    pageSize: pageSize.value,
    timeStart: new Date(uiDate.value.toLocaleDateString() + ' ' + uiStartTime.value).getTime(),
    timeEnd: new Date(uiDate.value.toLocaleDateString() + ' ' + uiEndTime.value).getTime()
  }

  axiosApi
    .get('api/game/recharge-log', { params : param } )
    .then((res)=> {
      const data = res.data
      userData.value = data.data
      dataLength.value = data.total
      totalMoney.value = data.totalMoney | (page.value===1 ? 0 : totalMoney.value) // 後端只有第一頁有totalmoney
    })
    .catch((error)=>{
      userData.value = null
      totalMoney.value = 0
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      loading.value = false
    })
}
onMounted((x) => {

})
</script>

<style>
</style>
