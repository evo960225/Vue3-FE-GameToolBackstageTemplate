<template>

  <!---- dialog ---->
  <el-dialog v-model="modelValue" :title="title" width="25%">
    <div>請輸入執行人密碼</div>
    <el-input v-model="password" type="password" @keyup.enter="handleCommitEvent"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleCommitEvent" size="small">確認</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive, onMounted, toRef } from 'vue'
import axiosApi from '../../js/axiosApi'

const props = defineProps(['modelValue', 'param', 'title'])
const emits = defineEmits(['update:modelValue', 'commitEvent'])


// 執行人密碼
const password = ref()

const handleCommitEvent = () => {
  const param = props.param
  param['password'] = password.value
  emits('update:modelValue', false)
  emits('commit', param, () => {
    password.value = ''
  })
}


</script>

<style>
</style>
