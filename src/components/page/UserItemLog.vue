<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="space-y-3 my-4 justify">
      <SearchUser ref="uiUser" @keyup.enter="searchData"></SearchUser>
      <SearchItemLog v-model:itemId="uiItemId" v-model:logType="uiLogType"/>
      <div class="flex">
        <SearchDate v-model:date="uiDate"/>
        <el-button class="ml-1" @click="searchData">查詢</el-button>
      </div>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="物品日誌" name="account">
        <div class="m-4 shadow-md relative">
          <UiPageTable :data="userData" :isLoading="loading" 
            v-model:page="page" 
            v-model:page-size="pageSize"
            :data-length="dataLength"
            @page-change="searchData"
          >
            <el-table-column prop="ReadingName" label="物品"  width="220" />
            <el-table-column prop="changeNum" label="變化數量" width="100" >
              <template #default="scope">
                  {{ scope.row.changeNum.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="afterChange" label="變動" align="center">
              <template #default="scope">
                <div class="inline-flex">
                  <div class="min-w-[50px]">
                    {{ scope.row.beforeChange.toLocaleString() }} 
                  </div>
                  <div class="w-10">
                  ->
                  </div>
                  <div class="min-w-[50px]">
                    {{ scope.row.afterChange.toLocaleString() }} 
                  </div>
              </div>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="事件" />
            <el-table-column prop="time" label="日期">
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
import axiosApi from '@/js/axiosApi'
import UiPageTable from '../ui/UiPageTable.vue';
import SearchDate from '../search_ui/SearchDate.vue';
import SearchItemLog from '../search_ui/SearchItemLog.vue';
import moment from 'moment';

const activeTab = ref('account')
const page = ref(1)
const pageSize = ref(25)
const dataLength = ref()
const uiUser = ref()
const userData = ref()
const loading = ref(false)
const uiDate = ref()
const uiItemId = ref()
const uiLogType = ref()

// function
async function searchData(){
  loading.value = true

  const param = {
    page: page.value,
    pageSize: pageSize.value,
    date: moment(uiDate.value).format('YYYYMMDD'),
    itemId: uiItemId.value,
    logType: uiLogType.value
  }
  param[uiUser.value.userType] = uiUser.value.typeValue

  axiosApi
    .get
    ('api/game/item-log', { params : param } )
    .then((res)=> {
      const page = res.data 
      userData.value = page.data
      dataLength.value = page.total
    })
    .catch((error)=>{
        userData.value = null
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
