<template>
  <div class="flex space-x-3">
    <label class="my-auto ml-2">時間區間：</label>
    
    <!-- if screen > sm -->
    <div class="sm:hidden"> 
      <el-date-picker
        v-model="selectDateScope"
        type="daterange"
        range-separator="To"
        start-placeholder="起始"
        end-placeholder="結束"
        @change="updateValue" 
      />
    </div>

    <!-- if  screnn < sm size -->
    <div class="sm:block hidden space-y-2">
      <el-date-picker 
        v-model="dateStart" 
        @change="updateValueStart" 
        :disabled-date="handleStartDisabled"
        placeholder="起始" 
      />
      <el-date-picker 
        v-model="dateEnd"
        @change="updateValueEnd" 
        :disabled-date="handleEndDisabled"
        placeholder="結束" 
      />
    </div>

  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'

const props = defineProps([
  'title',
  'start',
  'end'
])

const dateStart = ref(props.start)
const dateEnd = ref(props.end)
const selectDateScope = ref([props.start, props.end]) 

const emits = defineEmits(['update:start', 'update:end', 'change'])
const labelTitle = ref(props.title === undefined? '時間區間：': props.title)
// event
function updateValue(val) {
  if (!val) return
  emits('update:start', val[0])
  dateStart.value = val[0]
  emits('update:end', val[1])
  dateEnd.value = val[1]
  emits('change') 
}
function updateValueStart(val) {
  emits('update:start', val)
  if(!selectDateScope.value) selectDateScope.value = [val, val]
  selectDateScope.value[0] = val
}
function updateValueEnd(val) {
  emits('update:end', val)
  if(!selectDateScope.value) selectDateScope.value = [val, val]
  selectDateScope.value[1] = val
}

const handleStartDisabled = (date) => {
  if(!dateEnd.value) return false
  return date.getTime() > dateEnd.value
}
const handleEndDisabled = (date) => {
  if(!dateStart.value) return false
  return date.getTime() < dateStart.value
}
defineExpose({
  selectDateScope,
})
</script>

<style>
</style>
