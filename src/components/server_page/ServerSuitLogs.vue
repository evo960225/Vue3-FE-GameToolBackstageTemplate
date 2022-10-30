<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="space-y-3 mb-4" >
      <SearchCharacterSuits ref="uiSuitLogs" class="my-4"></SearchCharacterSuits>
      <SearchDateScope v-model:start="uiTimeStart" v-model:end="uiTimeEnd" class="my-4"></SearchDateScope>
      <el-button
        @click="searchData" 
        class="self-flex w-18">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="資源紀錄" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="logData" v-loading="loading"
            stripe border>
            <el-table-column prop="tk_datetimeIso" label="日期" width="250">
              <template #default="scope">
                {{ new Date(scope.row.tk_datetimeIso.slice(0,19)).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="playerId" label="BC_ID" width="420"/>
          </el-table>
        </div>
      </el-tab-pane>

    </el-tabs>
  </el-container>
</template>

<!-- ======================================================================== -->

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchCharacterSuits from '../search_ui/SearchCharacterSuits.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'

import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'
const activeTab = ref('t1')
const loading = ref(false)
const uiSuitLogs = ref()
const uiTimeStart = ref()
const uiTimeEnd = ref()


const logData = ref()

function searchData() {
  loading.value = true

  const param = {}
  param['suitId'] = uiSuitLogs.value.suitId
  param['datetimeStart'] = uiTimeStart.value.getTime()
  param['datetimeEnd'] = uiTimeEnd.value.getTime()

  axiosApi
    .get('api/game/server-suit-logs', { params: param })
    .then((res)=> {
      logData.value = res.data.items
      if (res.data.count === 0) throw Error("找不到紀錄！")
    })
    .catch((error)=>{
        logData.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        loading.value = false
    })
}

</script>

<style>
</style>
