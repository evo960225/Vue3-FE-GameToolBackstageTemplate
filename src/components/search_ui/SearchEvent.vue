<template>
  <el-container direction="horizontal" class="space-x-3">
    <label class="my-auto ml-2">活動類型：</label>
    <el-select v-model="selectEvent" has-validation="true" placeholder="選擇活動">
      <el-option
        v-for="item in eventList"
        :key="item"
        :value="item.GUID"
        :label="item.Name"
      ></el-option>
    </el-select>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi'

const selectEvent = ref() 
const eventList = ref([])
axiosApi
  .get('/api/game/event-type')
  .then((res)=>{ 
    eventList.value = res.data.response
  })
  .catch((e)=>{
    ElMessage('找不到活動資料！')
  })

defineExpose({
  selectEvent,
})
</script>

<style>
</style>
