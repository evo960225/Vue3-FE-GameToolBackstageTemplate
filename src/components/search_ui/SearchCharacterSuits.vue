<template>
  <el-container direction="horizontal">

    <!---- item type ---->
    <el-select 
      v-model="character"
      placeholder="選取角色" 
      class="w-48 max-w-xxs mr-1"
      @change="()=>suitId=null"
    >
      <el-option 
        v-for="it in characterList" 
        :key="it.GUID" 
        :label="it.Name" 
        :value="it.GUID"
      >
      </el-option>
    </el-select>


    <el-select 
      v-model="suitId"
      placeholder="選取部件" 
      class="w-48 max-w-xxs mr-1"
    >
      <el-option 
        v-for="it in filteredSuitList" 
        :key="it.GUID" 
        :label="it.Name" 
        :value="it.GUID"
      >
      </el-option>
    </el-select>

  </el-container>
</template>


<script setup>
import { ElMessage } from 'element-plus';
import { defineComponent, ref, reactive, computed } from 'vue'
import axiosApi from '../../js/axiosApi';


const characterList = ref()
const character = ref();
const suitList = ref()
const suitId = ref()
const filteredSuitList = computed(() => {
  if (!character.value) return suitList.value
  return suitList.value.filter((x) => character.value === x.CharacterGUID )
})

axiosApi
  .get('/api/game/character-list')
  .then((res)=>{ 
    const items = res.data.items
    characterList.value = items.filter((x) => x.SuitGUID)
  })
  .catch((e)=>{
    ElMessage('找不到角色資料！')
  })

axiosApi
  .get('/api/game/suit-list')
  .then((res)=>{ 
    const items = res.data.items
    suitList.value = items
  })
  .catch((e)=>{
    ElMessage('找不到道具資料！')
  })




defineExpose({
  suitId
})
</script>

<style>
</style>
