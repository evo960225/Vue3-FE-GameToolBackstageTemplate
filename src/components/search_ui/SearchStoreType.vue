<template>
  <el-container direction="horizontal">
    <el-select v-model="select_store_type" 
               placeholder="選擇商店" 
               class="w-48 max-w-xxs mr-1">
      <el-option v-for="it in store_type" 
        :key="it.value" :label="it.label" :value="it.value">
      </el-option>
    </el-select>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
let select_store_type = ref()
const store_type = reactive([
  { 'label': 'Apple', 'value': 'apple' },
  { 'label': 'google', 'value': 'google' },
])
defineExpose({
  select_store_type
})
</script>

<style>
</style>
