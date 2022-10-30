<template>
  <el-container direction="horizontal">
    <el-select 
      v-model="value" 
      @change="updateValue"
      :size="size"
      has-validation="true" 
      placeholder="選取" 
      filterable
      class="w-48 max-w-xxs mr-1"
    >
      <el-option v-for="it in resources_list" 
        :key="it.id" :label="it.name" :value="it.id">
      </el-option>
    </el-select>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi';

const props = defineProps({
  size: String,
  value: String,
  label: String
})
const emits = defineEmits([ 'update:value', 'update:label' ])

let selectResources = ref(props.defaultItem);
const resources_list = ref([])

axiosApi
  .get('/api/game/item-list')
  .then((res)=>{ 
    const resData = res.data
    resources_list.value = resData
  })
  .catch((e)=>{
    ElMessage('找不到道具資料！')
  })


// event 
function updateValue(val) {
  emits('update:value', val)
  const name = resources_list.value.find((x)=>val === x.id).name
  emits('update:label', name)
}
</script>

<style>
</style>
