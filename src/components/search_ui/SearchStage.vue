<template>
  <div class="flex md:block md:space-y-2">
    <!--
    <el-select v-model="select_stage_type" placeholder="Select">
      <el-option 
        v-for="it in stage_type" 
        :key="it.value" 
        :label="it.label" 
        :value="it.value"
        :disabled="it.disabled">
      </el-option>
    </el-select>
    -->
    
    <!--活動關卡特殊條件搜尋
    <div>
      <label v-if="select_stage_type==='活動關卡'" class="mx-3 my-auto">
        活動編號：
      </label>
      <el-input v-if="select_stage_type==='活動關卡'" v-model="event_id_value" placeholder class="max-w-xxs" />
    </div>
    -->


    <div >
      <label class="my-auto">通關類型：</label>
      <el-select v-model="select_mission_type" placeholder="Select" class="w-24">
        <el-option v-for="it in mission_type" 
          :key="it.value" :label="it.label" :value="it.value">
        </el-option>
      </el-select>
    </div>

  </div>
</template>



<script setup>
import { defineComponent, ref, reactive } from 'vue'


let select_stage_type = ref('一般關卡')
const stage_type = reactive([
  { 'label': '一般關卡', 'value': '一般關卡' },
  { 'label': '菁英關卡', 'value': '菁英關卡', disabled: true },
  { 'label': '活動關卡', 'value': '活動關卡', disabled: true },
])
let event_id_value = ref()
let stage_id_value = ref()
let select_mission_type = ref('全部')
const mission_type = reactive([
  { 'label': '全部', 'value': '全部' },
  { 'label': '首次', 'value': '首次' },
])
</script>

<style>
</style>
