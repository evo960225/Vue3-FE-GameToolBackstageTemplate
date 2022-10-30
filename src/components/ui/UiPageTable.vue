<template>
  <el-pagination 
    layout="prev, pager, next, sizes" 
    v-model:page-size="pageSize"
    :page-sizes="[25, 50, 100]"
    :total="dataLength" 
    v-model:currentPage="page"
    @current-change="setPage"
    class="my-1"
  ></el-pagination>
  <el-table 
    :data="data" 
    v-loading="isLoading"
    stripe border>
    <slot></slot>
  </el-table>
  <el-pagination 
    layout="prev, pager, next, sizes" 
    v-model:page-size="pageSize"
    :page-sizes="[25, 50, 100]"
    :total="dataLength" 
    v-model:currentPage="page"
    @current-change="setPage"
    class="my-1"
  >
  </el-pagination>
</template>


<script setup>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive, onMounted, toRef, computed } from 'vue'
import axiosApi from '../../js/axiosApi'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: []
  },
  pageSize: {
    type: Number,
    default: 100
  },
  dataLength: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  }
})
const isLoading = computed(()=> props.isLoading)
const data = computed(()=> props.data)
const pageSize = ref(props.pageSize)
const dataLength = computed(()=> props.dataLength)
const page = ref(props.page)

const emit = defineEmits(['pageChange', 'update:page', 'update:pageSize'])

function setPage(val) {
  page.value = val
  emit('update:page', page.value)
  emit('update:pageSize', pageSize.value)
  // 有查詢到資料才能換頁
  if (data.value) {
    emit('pageChange')
  }
}
</script>

<style>
</style>
