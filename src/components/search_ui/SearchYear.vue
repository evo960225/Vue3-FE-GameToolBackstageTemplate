<template>
  <el-container direction="horizontal">
    <label class="my-auto ml-2 mr-3">選擇年份：</label>
    <el-date-picker v-model="selectYear" type="year" placeholder="Pick a year">
        </el-date-picker>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
let selectYear = ref()

defineExpose({ selectYear, })
</script>

<style>
</style>
