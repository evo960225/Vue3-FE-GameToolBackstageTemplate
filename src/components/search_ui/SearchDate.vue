<template>
  <div>
    <label class="my-auto mr-3">{{ labelTitle }}</label>
    <el-date-picker
      v-model="date"
      type="date"
      placeholder=""
      :shortcuts="shortcuts"
      @change="updateValue" 
    ></el-date-picker>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, ref, reactive } from 'vue'

const props = defineProps(['title', 'date'])
const emits = defineEmits(['update:date', 'change'])
const labelTitle = ref(props.title === undefined ? '選擇日期：' : props.title)
const date = ref(props.date)

function disabledDate(time) {
  return time.getTime() > Date.now()
}
function updateValue(val) {
  emits('update:date', val)
  date.value = val
  emits('change')
}

const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '上禮拜',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]


defineExpose({ date, })
</script>

<style>
</style>
