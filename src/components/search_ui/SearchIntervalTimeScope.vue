<template>
  <el-container direction="horizontal" class="space-x-2">
    <el-select v-model="timeIntervalType" placeholder="Select" class="w-32">
      <el-option
        v-for="item in timeIntervalList"
        :key="item.name+item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  <el-date-picker
    v-model="selectTimeScope"
    :type="timeIntervalType"
    range-separator="To"
    start-placeholder="起始"
    end-placeholder="結束"
  >
  </el-date-picker>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
const timeIntervalType = ref('daterange')
const timeIntervalList = [
  {'name':'每日', 'value':'daterange'},
  {'name':'每周', 'value':'week'},
  {'name':'每月', 'value':'monthrange'},
]


let selectTimeScope = ref() 
defineExpose({
  selectTimeScope,
})
</script>

<style>
</style>
