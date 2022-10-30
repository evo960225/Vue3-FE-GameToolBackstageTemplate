<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="mb-3" @keyup.enter="searchData">
      <SearchUser ref="uiUser" class="my-4"></SearchUser>
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab" v-loading="isLoading">
      <!-- #region user -->
      <el-tab-pane label="裝置資訊" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="deviceData"
            stripe border>
            <el-table-column fixed prop="label" label="標題" width="180" />
            <el-table-column prop="value" label="內容" />
          </el-table>
        </div>
      </el-tab-pane>

      <!-- #region user -->
      <el-tab-pane label="登入資訊" name="user">
        <div class="m-4 shadow-md relative">
          <el-table :data="loginData" 
            stripe border>
            <el-table-column prop="label" label="標題" width="180" />
            <el-table-column prop="value" label="內容" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi';
import SearchUser from '../search_ui/SearchUser.vue';
const isLoading = ref()
const uiUser = ref()

const deviceData = ref()
const loginData = ref([
  { "label": "上次登入", "value": "December 1, 2021 3:20:19 PM GMT+0800" },
  { "label": "上次登出", "value": "December 1, 2021 10:48:56 AM GMT+0800" },
  { "label": "上次登入時長", "value": "19hr28m36s" },
  { "label": "最近連續登入次數", "value": "1" },
  { "label": "最大連續登入次數", "value": "6" },
  { "label": "總登入次數", "value": "4172" },
  { "label": "IP地址", "value": "192.168.1.157" },
  { "label": "IPv6地址", "value": "fe80::b844:d983:61da:366d" },
  { "label": "帳號創立時間", "value": "February 17, 2020 9:27:30 AM GMT+0800" } 
])


const activeTab = ref('account')
function searchData() {
  isLoading.value = true

  const param = {
    [uiUser.value.userType]: uiUser.value.userValue
  }

  axiosApi
    .get('api/game/user-device', { params: param })
    .then((res)=> {
      const data = res.data
      deviceData.value = [
        { label: '裝置名稱', value: data.deviceModel },
        { label: '裝置型號', value: data.deviceName },
        { label: '裝置版本', value: data.deviceOs.split('=>')[1] },
      ]
      loginData.value = [
        { label: '上次登入', value: new Date(data.lastLogin).toLocaleString() },
        { label: '上次登出', value: new Date(data.updatedAt).toLocaleString() },
        { label: '上次登入時長', value: '-' },
        { label: '最近連續登入次數', value: data.currentKeepDailyLoginCount },
        { label: '最大連續登入次數', value: data.maxKeepDailyLoginCount },
        { label: '總登入次數', value: data.loginCount },
        { label: 'IP地址', value: data.ip },
        { label: 'IPv6地址', value: data.ipv6 },
        { label: '帳號創立時間', value: new Date(data.createdAt).toLocaleString() },
      ]
    })
    .catch((error)=>{
      deviceData.value = null
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      isLoading.value = false
    })
}
</script>

<style>
</style>
