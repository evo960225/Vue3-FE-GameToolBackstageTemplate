<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="my-4 space-y-4" @keyup.enter="searchData">
      <SearchUser ref="uiUser" class="my-4" />
      <SearchDateScope v-model:start="searchDateStart" v-model:end="searchDateEnd" />
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="體力接收" name="p1">
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData" v-loading="isLoading" stripe border>
            <el-table-column prop="friendId" label="好友ID" />
            <el-table-column prop="好友名稱" label="好友名稱" />
            <el-table-column prop="friendPlatform" label="好友平台" sortable/>
            <el-table-column prop="timeStamp" label="獲取時間" sortable>
              <template #default="scope">
                {{ new Date(scope.row.timeStamp).toLocaleString() }}
              </template>
            </el-table-column>
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
import SearchUser from '../search_ui/SearchUser.vue';
import SearchDateScope from '../search_ui/SearchDateScope.vue';
import moment from 'moment'

// search
const uiUser = ref()
const receiveLifeData = ref()
const searchDateStart = ref(new Date())
const searchDateEnd = ref(new Date())

// table
const isLoading = ref(false)
const maxPageItem = 30
const page = ref(1)
const activeTab = ref('p1')

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  if (!receiveLifeData.value) return []
  return receiveLifeData.value
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
    .get('api/game/user-receive-friend-life-logs', {params: param})
    .then((res)=> {
      const data = res.data
      receiveLifeData.value = data.items
    })
    .finally(()=>{
      isLoading.value = false
    })
}

</script>

<style>
</style>
