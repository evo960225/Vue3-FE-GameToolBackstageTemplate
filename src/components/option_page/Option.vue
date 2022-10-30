<template>
  <el-container direction="vertical">

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="全域推播" name="t1">
        
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
const activeTab = ref('t1')

</script>

<style>
</style>
