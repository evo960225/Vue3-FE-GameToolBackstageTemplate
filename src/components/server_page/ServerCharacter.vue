<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="flex my-4" @keyup.enter="searchData">
      <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="全角色" name="t1">
        <el-table :data="characterData" v-loading="isLoading"
            stripe border>
          <el-table-column prop="GUID" label="GUID" />
          <el-table-column prop="name" label="名稱" sortable/>
          <el-table-column prop="count" label="持有人數" sortable/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="部件" name="t2">
        <el-table :data="suitData" v-loading="isLoading"
            stripe border>
          <el-table-column prop="GUID" label="GUID" />
          <el-table-column prop="name" label="名稱" sortable/>
          <el-table-column prop="count" label="持有人數" sortable/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchCharacterList from '../search_ui/SearchCharacterList.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import axiosApi from '../../js/axiosApi'

const activeTab = ref('t1')
const isLoading = ref(false)
const statisticData = ref()
const characterData = ref()
const suitData = ref()

function searchData() {
  isLoading.value = true
  axiosApi
    .get('api/game/server-charactersuit-statistic', {})
    .then((res)=> {
      statisticData.value = res.data
      characterData.value = Object.values(res.data.characters)
      suitData.value = Object.values(res.data.suits)
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoading.value = false
    })
}
</script>

<style>
</style>
