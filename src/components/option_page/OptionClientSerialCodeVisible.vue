<template>
<div class="m-2">
  <el-card header="兌換序號欄位顯示">
    <div class="mx-10 my-3 space-y-5 text-right">
      <div class="space-x-4">
        <label>Android</label>
        <el-switch 
          v-model="androidVisible"
          size="large"
          active-text="on"
          inactive-text="off">
        </el-switch>
      </div>
      <div class="space-x-4">
        <label>iOS</label>
        <el-switch 
          v-model="iosVisible"
          size="large"
          active-text="on"
          inactive-text="off">
        </el-switch>
      </div>
    </div>
    <div class="text-center mt-8">
      <el-button>儲存</el-button>
    </div>
  </el-card>
</div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
const androidVisible = ref(false)
const iosVisible = ref(false)
</script>

<style>
</style>
