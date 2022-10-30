<template>
    <el-select v-model="props.value" 
               @change="updateValue"
               placeholder="選擇伺服器" 
               class="w-64 max-w-xxs mr-1">

        <el-option
          v-for="item in uiPlatformList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
        </el-option>

    </el-select>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus';
import axiosApi from '../../js/axiosApi';
const props = defineProps(['value'])
const emits = defineEmits(['update:value', 'change'])

const uiPlatformList = ref()
axiosApi
  .get('/api/game/start-announcement-platform-list')
  .then((res)=>{
    uiPlatformList.value = 
      Object.keys(res.data).map((x) => {
        return {'label': x, 'value': x}
      })

  })
  .catch((e)=>{
    ElMessage('找不到渠道平台資料！')
  })


function updateValue(val) {
  emits('update:value', val)
  emits('change')
}
 
</script>

<style>
</style>
