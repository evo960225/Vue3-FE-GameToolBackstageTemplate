<template>
<el-select v-model="value" 
  @change="updateValue"
  v-loading="isLoading"
  placeholder="選擇伺服器" 
  class="w-64 max-w-xxs mr-1"
>
  <el-option
    v-for="item in uiServerList"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>

</template>

<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import axiosApi from '../../js/axiosApi'
const test = ref()
const props = defineProps(['value', 'allServerOption', 'isLoading'])
const emits = defineEmits(['update:value', 'change'])
const uiServerList = ref()
let optionList = [
  {'label': '開發一', 'value': 101},
  {'label': '開發二', 'value': 102},
  {'label': '測試一', 'value': 201},
  {'label': '測試二', 'value': 202}
]

// 是否顯示全服選項
if (props.allServerOption && props.allServerOption === 'true') {
  optionList.unshift({'label': '@全服', 'value': -1})
}

uiServerList.value = optionList

function updateValue(val) {
  emits('update:value', val)
  emits('change')
}


</script>

<style>
</style>
