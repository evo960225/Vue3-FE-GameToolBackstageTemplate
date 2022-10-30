<template>
  <div class="w-full">

    <!---- search panel ---->
    <el-card class="m-3 w-1/2">
      <div class="flex">
        <SearchLockInfo></SearchLockInfo>
        <div class="ml-3"> 
          <el-button>搜尋</el-button> 
        </div>
      </div>
    </el-card>

    <!---- data table ---->
    <el-card class="m-3 mt-6 p-1">
      <el-table :data="lockUserlist" stripe border>
        <el-table-column prop="玩家ID" label="玩家ID"  />
        <el-table-column prop="鎖定開始時間" label="鎖定開始時間" sortable />
        <el-table-column prop="解鎖時間" label="解鎖時間" sortable />
        <el-table-column prop="封鎖訊息標題" label="封鎖訊息標題" />
        <el-table-column prop="封鎖訊息內文" label="封鎖訊息內文" />
        <el-table-column prop="執行鎖定人" label="執行鎖定人" />
        <el-table-column prop="備註" label="備註" />
      </el-table>
    </el-card>

    
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import SearchUser from '../search_ui/SearchUser.vue';
import SearchDateScope from '../search_ui/SearchDateScope.vue';
import SearchLockInfo from '../search_ui/SearchLockInfo.vue';
import lockUserlist from '../fill_data/lockOutUser'
const isScheduling = ref('false')
const memo = ref()
const password = ref()
const textarea = ref()
const searchType = ref([
  '玩家ID',
  '鎖定時間',
  '解鎖時間',
  '執行人'
])


const filter_table_data = () => {
  return [];
}
</script>

<style>
</style>
