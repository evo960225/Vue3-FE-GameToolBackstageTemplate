<template>
  <el-container direction="horizontal">
    <label class="my-auto ml-2 mr-3">來源：</label>
    <el-select v-model="selectReason" has-validation="true" placeholder="選擇" disabled >
      <el-option
        v-for="item in reasonList"
        :key="item"
        :label="item"
        :value="item"
      > {{ item }}
      </el-option>
    </el-select>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi'
const selectReason= ref() 
const reasonList = ref([
  '通關',
  'GM',
  '好友寄送',
  '商業獎勵',
  '其他'
])


</script>

<style>
</style>
