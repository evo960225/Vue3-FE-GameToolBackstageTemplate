<template>
  <div>
    <label class="my-auto mr-3">{{ labelTitle }}</label>
    <el-date-picker
      v-model="datetime"
      type="datetime"
      placeholder=""
      @change="updateValue" 
    ></el-date-picker>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, ref, reactive } from 'vue'

const props = defineProps(['title','datetime'])
const emits = defineEmits(['update:datetime', 'change'])
const labelTitle = ref(props.title === undefined ? '選擇日期：': props.title)

const datetime = ref(props.datetime)
function disabledDate(time) {
  return time.getTime() > Date.now()
}
function updateValue(val) {
  emits('update:datetime', val)
  datetime.value = val
  emits('change')
}


defineExpose({ datetime, })
</script>

<style>
</style>
