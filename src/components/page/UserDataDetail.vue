<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4 justify">
      <SearchUser ref="uiUser" @keyup.enter="searchData" ></SearchUser>
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="帳號資訊" name="account">
        <div class="m-4 shadow-md relative">
          <UiPageTable :data="userData" :isLoading="loading" 
            v-model:page="page" 
            v-model:page-size="pageSize"
            :data-length="dataLength"
            @page-change="searchData"
          >
            <el-table-column prop="column" label="欄位" />
            <el-table-column prop="value" label="內容" />

          </UiPageTable>
        </div>
      </el-tab-pane>
    <el-tab-pane label="Json詳細資料" name="json">
        <div class="m-4 shadow-md relative whitespace-pre text-sm">
          <!-- 修正index為數字問題 -->
          {{ blob && JSON.stringify(JSON.parse(blob.replace(/([^:])(\d+):/g,'$1"$2":')), null, 4) }}
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

const activeTab = ref('account')
const page = ref(1)
const pageSize = ref(25)
const dataLength = ref()
const uiUser = ref()
const userData = ref()
const loading = ref(false)
const blob = ref()

// function
async function searchData(){
  loading.value = true

  const param = {
    page: page.value,
    pageSize: pageSize.value
  }
  param[uiUser.value.userType] = uiUser.value.typeValue

  axiosApi
    .get
    ('api/game/user-data', { params : param } )
    .then((res)=> {
      const data = res.data 
      blob.value = data.Blob
      userData.value = Object.entries(data).filter((x)=>x[0]!='Blob').map(([key, value])=> {
        return {
          'column': key,
          // 格式轉換
          'value': key.search('時間') > 0 ? new Date(value).toLocaleString() : value.toLocaleString()
        }
      })
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
