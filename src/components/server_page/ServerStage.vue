<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4" @keyup.enter="searchData">
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <!-- Table -->
    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="舞台紀錄" name="account">

        <div class="m-4 shadow-md relative">
          <el-table 
            :data="stageData" :tree-props="{ children: 'elements', hasChildren: true }"
            row-key="GUID" v-loading="isLoading" border>
            <el-table-column prop="GUID" label="編號" width="150" />
            <el-table-column prop="count" label="總完成人數" width="150" align="right">
              <template #default="scope">
                {{ scope.row.count }}
              </template>
            </el-table-column>
            <el-table-column prop="spendTime" label="花費時間(秒)" align="right" width="150" >
              <template #default="scope">
                {{ scope.row.spendTime && (scope.row.spendTime / scope.row.count).toFixed(0) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive } from 'vue'
import { getUserCharactersBySupportCode, getUserCharactersByName } from '../baas/run'
import SearchUser from '../search_ui/SearchUser.vue'
import axiosApi from '@/js/axiosApi'

const activeTab = ref('account')
const charactersData = ref([])
const isLoading = ref(false)
const stageData = ref()


// Event
function searchData() {
  isLoading.value = true
  axiosApi
    .get('api/game/server-stage-statistic')
    .then((res)=> {
      stageData.value = Object.values(res.data).map((item) => {
        item.elements = Object.values(item.elements)
        return item
      })
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoading.value = false
    })
}

function filter_table_data() {
  if (!charactersData.value) return
  return charactersData.value.filter(
    (data) =>
      !search.value || data.Name.toLowerCase().includes(search.value.toLowerCase())
  )
}
</script>

<style>
</style>
