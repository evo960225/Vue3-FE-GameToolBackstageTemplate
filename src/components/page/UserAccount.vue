<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4 justify">
      <SearchServer 
            v-model:value="uiServerId" 
            @change="searchData" 
            all-server-option="true"
            class="mr-3"
          />
      <SearchUser ref="uiUser" playerNameOption="true" @keyup.enter="searchData" ></SearchUser>
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
            <el-table-column prop="玩家ID" label="玩家ID" width="220" />
            <el-table-column prop="玩家名稱" label="玩家名稱" />
            <el-table-column prop="等級" label="等級"  width="80" />
            <el-table-column prop="金幣" label="金幣"  width="80" />
            <el-table-column prop="伺服器" label="伺服器"  width="80">
              <template #default="scope">
                  {{ scope.row.伺服器 }}
              </template>
            </el-table-column>
            <el-table-column prop="創建時間" label="創建時間" width="220">
              <template #default="scope">
                  {{ new Date(scope.row.創建時間).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="登出時間" label="登出時間" width="220">
              <template #default="scope">
                  {{ new Date(scope.row.登出時間).toLocaleString() }}
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
import SearchServer from '../search_ui/SearchServer.vue';

const activeTab = ref('account')
const page = ref(1)
const pageSize = ref(25)
const dataLength = ref()
const uiUser = ref()
const userData = ref()
const uiServerId = ref()
const loading = ref(false)


// function
async function searchData(){
  loading.value = true
  const param = {
    page: page.value,
    pageSize: pageSize.value,
    serverId: uiServerId.value,
    [uiUser.value.userType]: uiUser.value.typeValue
  }
  axiosApi
    .get('api/game/accounts', {params: param})
    .then((res)=> {
      const data = res.data
      userData.value = data
      dataLength.value = data.length
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
  searchData()
})
</script>

<style>
</style>
