<template>
  <el-container direction="horizontal">
    <el-select 
      v-model="value" 
      @change="updateValue"
      :size="size"
      filterable
      has-validation="true" 
      placeholder="選擇角色"
    >
      <el-option
        v-for="item in characterList"
        :key="item.GUID"
        :label="item.GroupName"
        :value="item.GUID"
      > 
      </el-option>
    </el-select>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import axiosApi from '../../js/axiosApi'

const props = defineProps({
  size: String,
  value: String,
  label:String
})
const emits = defineEmits([ 'update:value', 'update:label' ])

const characterList = ref([])
axiosApi
  .get('/api/game/character-list')
  .then((res)=>{
    characterList.value = res.data.response
  })
  .catch((e)=>{
    ElMessage('找不到角色資料！')
  })




// event 
function updateValue(val) {
  emits('update:value', val)
  const name = characterList.value.find((x)=>val === x.GUID).GroupName
  emits('update:label', name)
}
</script>

<style>
</style>
