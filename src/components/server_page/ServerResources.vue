<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="space-x-4 space-y-3 mb-4" >
      <SearchDate ref="uiDate" class="ml-4"></SearchDate>
      <SearchResourceLog ref="uiResourceLog"></SearchResourceLog>
      <SearchResourceReason ref=""></SearchResourceReason>
      <el-button
        @click="searchData" 
        class="self-flex w-18">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="資源紀錄" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData" v-loading="loading"
            stripe border>
            <el-table-column prop="localDatetime" label="日期" width="250" />
            <el-table-column prop="playerId" label="BC_ID" width="420"/>
            <el-table-column prop="logType" label="獲取/消費" width="100"/>
            <el-table-column prop="count" label="數量" width="120" align="right"/>
            <el-table-column prop="reason" label="來源" />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="filterTableData.length" 
            @current-change="set_page"></el-pagination>
        </div>
      </el-tab-pane>

    </el-tabs>
  </el-container>
</template>

<!-- ======================================================================== -->

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchDate from '../search_ui/SearchDate.vue';
import resourcesTotal from '../fill_data/resourcesTotal'
import SearchResourceLog from '../search_ui/SearchResourceLog.vue'
import SearchResourceReason from '../search_ui/SearchResourceReason.vue'

import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'
const activeTab = ref('t1')
const loading = ref(false)
const uiDate = ref()
const uiResourceLog = ref()

const logData = ref([])

function searchData() {
  loading.value = true

  const param = {}
  param['itemId'] = uiResourceLog.value.itemType
  param['logType'] = uiResourceLog.value.logType
  const dateStart = new Date(uiDate.value.date)
  const dateEnd = new Date(uiDate.value.date)
  dateEnd.setDate(dateStart.getDate() + 1);
  param['datetimeStart'] = new Date(dateStart.toGMTString())
  param['datetimeEnd'] = dateEnd;

  axiosApi
    .get('api/game/server-item-logs', { params: param })
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

// table
const maxPageItem = 30
const page = ref(1)

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return logData.value
})
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})
</script>

<style>
</style>
