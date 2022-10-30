<template>
  <div class="w-full">
    <!-- #region input -->
    <div class="mb-3" @keyup.enter="searchData">
      <SearchUser ref="uiUser" class="my-4"></SearchUser>
      <SearchResourceLog ref="uiResourceLog" class="my-4"></SearchResourceLog>
      <SearchResourceReason class="my-4"></SearchResourceReason>
      <SearchDateScope v-model:start="uiTimeStart" v-model:end="uiTimeEnd" class="my-4"></SearchDateScope>
      <el-button :disabled="!(uiUser&&uiUser.userValue&&uiTimeStart&&uiTimeEnd)" @click="searchData()">查詢</el-button>
    </div>
    
    <!-- #endregion input -->
    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="資源" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="logData" v-loading="loading"
            stripe border>
            <el-table-column fixed prop="localDatetime" label="時間" width="250" />
            <el-table-column prop="logType" label="操作方式" width="120"/>
            <el-table-column prop="count" label="數量" width="150" />
            <el-table-column prop="reason" label="來源" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import SearchUser from '../search_ui/SearchUser.vue'
import SearchResourceLog from '../search_ui/SearchResourceLog.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import SearchResourceReason from '../search_ui/SearchResourceReason.vue'
import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'

const activeTab = ref('account')
const loading = ref(false)
const uiUser = ref()
const uiResourceLog = ref()
const uiTimeStart = ref()
const uiTimeEnd = ref()
const logData = ref()

function searchData() {
  loading.value = true

  const param = {}
  const selectUserType = uiUser.value.userType
  const selectUserValue = uiUser.value.userValue
  param[selectUserType] = selectUserValue
  param['itemId'] = uiResourceLog.value.itemType
  param['logType'] = uiResourceLog.value.logType
  param['datetimeStart'] = uiTimeStart.value
  param['datetimeEnd'] = uiTimeEnd.value

  axiosApi
    .get('api/game/user-item-logs', { params: param })
    .then((res)=> {
        const data = res.data
        if (!data.success) throw Error("找不到該玩家！")
        logData.value = data.response.items
        const localDatetime = logData.value.forEach((x, i, a) => { 
          a[i].localDatetime = new Date(x.timeStamp).toLocaleString()
        })
      })
    .catch((error)=>{
        logData.value = null
        ElMessage.error(error.toLocaleString())
        loading.value = false
    })
    .finally(()=> {
        loading.value = false
    })
}
</script>

<style>
</style>
