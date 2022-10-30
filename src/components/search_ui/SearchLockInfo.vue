<template>
  <div class="flex space-x-3">
    <el-select v-model="searchType" has-validation="true" placeholder="選擇">
      <el-option
          v-for="item in searchTypeList"
          :key="item"
          :label="item"
          :value="item"
        > 
        {{ item }}
      </el-option>
    </el-select>
    <div v-if="searchType==='玩家ID'">
      <el-input></el-input>
    </div>
    <div v-if="searchType==='鎖定時間'">
      <el-date-picker
          v-model="lockDateRange"
          type="daterange"
          placeholder=""
        >
        </el-date-picker>
    </div>
    <div v-if="searchType==='解鎖時間'">
      <el-date-picker
          v-model="unlockDateRange"
          type="daterange"
          placeholder=""
        >
        </el-date-picker>
    </div>
    <div v-if="searchType==='執行人'">
      <el-input type="email"></el-input>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'

const searchType= ref() 
const searchTypeList = ref([
  '玩家ID',
  '鎖定時間',
  '解鎖時間',
  '執行人'
])
const lockDateRange= ref() 
const unlockDateRange= ref() 

</script>

<style>
</style>
