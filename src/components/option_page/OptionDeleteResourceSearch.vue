<template>
  <el-container direction="vertical">
      <div class="">
        <div class="m-3">
          <el-button>搜尋</el-button>
        </div>
        <!---- data table ---->
        <el-card class="m-3 mt-6 p-1">
          <el-table :data="deleteResourceList" stripe border>
            <el-table-column prop="刪除時間" label="刪除時間"  />
            <el-table-column prop="玩家ID" label="玩家ID" />
            <el-table-column prop="刪除道具編號" label="刪除道具" sortable />
            <el-table-column prop="刪除數量" label="刪除數量" sortable />
            <el-table-column prop="memo" label="memo" />
            <el-table-column prop="執行鎖定人" label="執行人(Email)" />
            <el-table-column prop="memo" label="備註" />
          </el-table>
        </el-card>

      </div>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import deleteResourceList from '../fill_data/deleteResourceList'

const isScheduling = ref('false')
const selectScope = ref()
const deleteCount = ref(1)
</script>

<style>
</style>
