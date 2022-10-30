<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4 justify">
      <SearchUser ref="uiUser" @keyup.enter="searchData" ></SearchUser>
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">

      <el-tab-pane label="帳號資訊" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="userAccount" v-loading="loading"
            stripe border>
            <el-table-column prop="title" label="標題" width="180" />
            <el-table-column prop="value" label="內容" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="持有物品" name="item">
        <el-input v-model="searchItems" size="mini" placeholder="搜尋物品" class="m-4 w-36 my-2"/>
        <div class="m-4 shadow-md relative">
          <el-table :data="filter_items_data()" v-loading="loading"
            stripe border>
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="名稱" width="180" />
            <el-table-column prop="count" label="數量" width="150" align="right">
              <template #default="scope">
                  {{ scope.row.count && scope.row.count.toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="持有角色" name="character">
        <el-input v-model="searchCharacters" size="mini" placeholder="搜尋角色" class="m-4 w-36 my-2"/>
        <div class="m-4 shadow-md relative">
          <el-table :data="filter_characters_data()" v-loading="loading"
            stripe border>
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="名稱" width="180" />
          </el-table>
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

const activeTab = ref('account')
const uiUser = ref()
const userAccount = ref()
const userItems = ref()
const userCharacters = ref()
const searchItems = ref()
const searchCharacters = ref()
const loading = ref(false)


// function
function searchData() {
  loading.value = true

  const param = {
    [uiUser.value.userType]: uiUser.value.typeValue
  }

  axiosApi
    .get('api/game/user-data', { params : param } )
    .then((res)=> {
      const data = res.data
      userAccount.value = Object.entries(data.account).map(([k, v]) => {
        if (k.search('時間') >= 0 && v > 1000000000000) {
          return {'title': k, 'value': new Date(v).toLocaleString() }
        }
        return {'title': k, 'value': v }
      })
      userItems.value = data.data.物品
      userCharacters.value = data.data.角色
    })
    .catch((error)=>{
        userAccount.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        loading.value = false
    })
}


function filter_items_data() {
  if (!userItems.value) return
  return userItems.value.filter(
    (data) =>
      !searchItems.value || data.name.toLowerCase().includes(searchItems.value.toLowerCase())
  )
}
function filter_characters_data() {
  if (!userCharacters.value) return
  return userCharacters.value.filter(
    (data) =>
      !searchCharacters.value || data.name.includes(searchCharacters.value)
  )
}
</script>

<style>
</style>
