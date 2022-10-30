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
      <el-tab-pane label="信件" name="p1">
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData" v-loading="isLoading" stripe border>
            <el-table-column prop="mailTitle" label="信件標題" />
            <el-table-column prop="mailContent" label="信件內文" />
            <el-table-column prop="giftboxId" label="禮盒編號" sortable />
            <el-table-column prop="timeStamp" label="信件寄送時間" sortable>
              <template #default="scope">
                {{ new Date(scope.row.timeStamp).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="mailTtl" label="信件到期時間" sortable>
              <template #default="scope">
                {{ scope.row.mailTtl === -1 ? '-' : new Date(scope.row.mailTtl).toLocaleString()}}
              </template>
            </el-table-column>
            <el-table-column prop="是否已經閱讀信件" label="是否已經閱讀信件" sortable />
            <el-table-column prop="閱讀信件時間" label="閱讀信件時間" sortable />
  
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
import axiosApi from '@/js/axiosApi'
import SearchUser from '../search_ui/SearchUser.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import moment from 'moment'

// search
const uiUser = ref()
const mailData = ref()
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
  if (!mailData.value) return []
  return mailData.value
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
    .get('api/game/user-mail-data', {params: param})
    .then((res)=> {
      const data = res.data
      mailData.value = data.items
    })
    .finally(()=>{
      isLoading.value = false
    })
}

</script>

<style>
</style>
