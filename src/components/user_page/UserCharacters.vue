<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4" @keyup.enter="searchData">
      <SearchUser ref="uiUser"></SearchUser>
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <!-- Table -->
    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="角色紀錄" name="account">

        <el-input v-model="search" size="mini" placeholder="搜尋角色" class="m-4 w-36 my-2"/>
        <div class="m-4 shadow-md relative">
          <el-table 
            :data="filter_table_data()" 
            v-loading="loading" stripe border>
            <el-table-column prop="guid" label="GUID" sortable />
            <el-table-column prop="Name" label="角色名稱" />
            <el-table-column prop="reason" label="取得方式" />
            <el-table-column prop="getTime" label="初次獲得時間" sortable />
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
const uiUser = ref()
const charactersData = ref([])
const userItems = ref([])
const loading = ref(false)
const search = ref();


// Event
function searchData() {
  loading.value = true

  const param = {}
  const selectUserType = uiUser.value.userType
  const selectUserValue = uiUser.value.userValue
  param[selectUserType] = selectUserValue

  axiosApi
    .get('api/game/user-characters', { params: param })
    .then((res)=> {
        const data = res.data
        charactersData.value = data.items
        charactersData.value.forEach((x) => {
          x.getTime = new Date(x.getTime).toLocaleString('def', { hourCycle: "h23" })
        })
      })
    .catch((error)=> {
        charactersData.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        loading.value = false
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
