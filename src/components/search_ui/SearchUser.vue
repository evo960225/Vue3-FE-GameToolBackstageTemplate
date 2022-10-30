<template>
  <div class="flex">
    <el-select v-model="userType" 
               placeholder="ID或名稱" 
               class="w-64 max-w-xxs mr-1">


        <el-option-group
          v-for="group in userTypeList"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-option-group>

    </el-select>
    <el-input v-model="typeValue" placeholder clearable class="mr-1 w-72" />
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
const userType = ref('id')
const typeValue = ref()
const userTypeList = reactive([
  { 
    label: '',
    options: [
      { 'label': '玩家ID', 'value': 'id' },
      { 'label': '玩家名稱', 'value': 'name' },
    ]
  },
])
defineExpose({
  userType,
  typeValue
})
</script>

<style>
</style>
