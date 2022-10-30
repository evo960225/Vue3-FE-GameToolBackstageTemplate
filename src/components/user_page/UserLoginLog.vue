<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="mb-3" @keyup.enter="searchData">
      <SearchUser ref="uiUser" class="my-4"></SearchUser>
      <SearchDateScope v-model:start="searchDateStart" v-model:end="searchDateEnd" class="my-4"></SearchDateScope>
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="登入資料" name="p1">
        <el-input v-model="searchIp" placeholder="搜尋IP" class="mx-4 w-48 my-1"/>
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData" v-loading="isLoading" stripe border>
            <el-table-column prop="ip" label="IP" sortable />
            <el-table-column prop="ipv6" label="IPv6" sortable />
            <el-table-column prop="timeStamp" label="登入時間" sortable>
              <template #default="scope">
                {{ new Date(scope.row.timeStamp).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="離開遊戲時間" label="離開遊戲時間" sortable />
            <el-table-column prop="遊玩時長" label="遊玩時長" sortable />
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

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'
import SearchUser from '../search_ui/SearchUser.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import moment from 'moment'

// search
const searchIp = ref()
const uiUser = ref()
const loginData = ref()
const searchDateStart = ref(new Date())
const searchDateEnd = ref(new Date())

// table
const isLoading = ref(false)
const maxPageItem = 30
const activeTab = ref('p1')
const page = ref(1)

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  if (!loginData.value) return []
  return loginData.value.filter(
    (data) =>
      !searchIp.value 
        || data.ip.toLowerCase().includes(searchIp.value.toLowerCase()) 
        || data.ipv6.toLowerCase().includes(searchIp.value.toLowerCase())
  )
})
const pageData = computed(() => {
  const fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})


async function searchData() {
  const param = {
    [uiUser.value.userType]: uiUser.value.userValue,
    timeStart: moment(searchDateStart.value).format('YYYY-MM-DD'),
    timeEnd: moment(searchDateEnd.value).format('YYYY-MM-DD')
  }

  isLoading.value = true
  await axiosApi
    .get('api/game/user-login-logs', {params: param})
    .then((res)=> {
      const data = res.data
      loginData.value = data.items
    })
    .finally(()=>{
      isLoading.value = false
    })
}

</script>

<style>
</style>
