<template>
  <div class="flex">
    <label class="my-auto mr-3">{{ labelTitle }}</label>
    <el-date-picker
      v-model="month"
      type="month"
      placeholder=""
      @change="updateValue" 
    ></el-date-picker>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, ref, reactive } from 'vue'

const props = defineProps(['title','month'])
const emits = defineEmits(['update:month', 'change' ])

function updateValue(val) {
  emits('update:month', val)
  month.value = val
  emits('change')
}

const labelTitle = ref(props.title === undefined ? '選擇月份：': props.title)
const month = ref(props.month)




</script>

<style>
</style>
