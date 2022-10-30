<template>
    <label v-if="labelTitle" class="my-auto ml-2 mr-3">{{ labelTitle }}</label>
    <el-date-picker
      v-model="timeScope"
      type="datetimerange"
      range-separator="To"
      start-placeholder="起始"
      end-placeholder="結束"
      @change="updateValue"
    >
    </el-date-picker>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
let timeScope = ref() 
const props = defineProps([
  'title',
  'start',
  'end'
])
const emits = defineEmits([ 'update:start', 'update:end' ])
const labelTitle = ref(props.title === undefined? '時間區間：': props.title)

const datetimeStart = computed(()=> {
  if (!timeScope.value) return null 
  return new Date(timeScope.value[0]).toISOString()
})
const datetimeEnd  = computed(()=> {
  if (!timeScope.value) return null 
  return new Date(timeScope.value[1]).toISOString()
})

// event 
function updateValue(val) {
  emits('update:start', val[0])
  emits('update:end', val[1])
}

</script>

<style>
</style>
