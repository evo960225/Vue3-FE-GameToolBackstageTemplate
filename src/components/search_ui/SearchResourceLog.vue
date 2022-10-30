<template>
  <el-container direction="horizontal">

    <!---- item type ---->
    <el-select v-model="itemType"
               placeholder="選取" 
               class="w-48 max-w-xxs mr-1">
      <el-option 
        v-for="it in itemTypeList" 
        :key="it.GUID" 
        :label="it.Name" 
        :value="it.GUID"
      ></el-option>

    </el-select>

    <!---- log type ---->
    <el-select v-model="logType" placeholder="Select">
      <el-option 
        v-for="it in logTypeList" 
        :key="it.value" 
        :label="it.label" 
        :value="it.value"
        :disabled="it.disabled"
      >
      </el-option>
    </el-select>

  </el-container>
</template>


<script setup>
import { ElMessage } from 'element-plus';
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi';

// selected
const itemType = ref();
const logType = ref('add');

// selectable list
const itemTypeList = ref([])
const logTypeList = reactive([
  { 'label': '獲取', 'value': 'add', disabled: false},
  { 'label': '花費', 'value': 'use', disabled: false},
  { 'label': '獲取&花費', 'value': 'all', disabled: true },
])

axiosApi
  .get('/api/game/itemList')
  .then((res)=>{ 
    const resData = res.data.items
    const filterData = resData.filter(
      // 排除限時無限體力 600 ~ 604
      (x) => !(600 <= x.GUID && x.GUID <=699) 
    ) 
    itemTypeList.value = filterData
    itemType.value = 0
  })
  .catch((e)=>{
    ElMessage('找不到道具資料！')
  })




defineExpose({
  itemType,
  logType,
})
</script>

<style>
</style>
