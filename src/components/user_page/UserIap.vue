<template>
  <div class="w-full">
    <!-- #region input -->
    <div class="mb-3 space-y-4" @keyup.enter="searchData">
      <SearchUser ref="uiUser"></SearchUser>
      <SearchStoreType></SearchStoreType> 
      <SearchDateScope v-model:start="searchDateStart" v-model:end="searchDateEnd" />
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="IAP" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="iapData" v-loading="isLoading"
            stripe border>
            <el-table-column prop="timeStamp" label="時間">
              <template #default="scope">
                {{ new Date(scope.row.timeStamp).toLocaleString() }}
              </template>
            </el-table-column>/>
            <el-table-column prop="iapId" label="商品" />
            <el-table-column prop="cost" label="花費" sortable />
            <el-table-column prop="currencyName" label="幣別" sortable />

          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import SearchUser from '../search_ui/SearchUser.vue';
import { defineComponent, ref, reactive } from 'vue'
//import iapData from '../fill_data/IapData';
import SearchStoreType from '../search_ui/SearchStoreType.vue';
import SearchDateScope from '../search_ui/SearchDateScope.vue';
import axiosApi from '../../js/axiosApi';
import moment from 'moment';

const uiUser = ref()
const iapData = ref()
const activeTab = ref('account')
const searchDateStart = ref(new Date())
const searchDateEnd = ref(new Date())
const isLoading = ref(false)


async function searchData() {
  const param = {
    [uiUser.value.userType]: uiUser.value.userValue,
    timeStart: moment(searchDateStart.value).format('YYYY-MM-DD'),
    timeEnd: moment(searchDateEnd.value).format('YYYY-MM-DD')
  }

  isLoading.value = true
  await axiosApi
    .get('api/game/user-iap-logs', {params: param})
    .then((res)=> {
      const data = res.data
      iapData.value = data.items
    })
    .finally(()=>{
      isLoading.value = false
    })
}

</script>

<style>
</style>
