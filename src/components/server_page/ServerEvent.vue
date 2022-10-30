<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="space-y-3 my-4">
      <SearchDateScope></SearchDateScope>
      <SearchEvent></SearchEvent>
      <el-button>查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">

      <el-tab-pane label="活動紀錄" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="dataSlice"
            stripe border>
            <el-table-column prop="日期" label="日期" />
            <el-table-column prop="訪客數" label="訪客數" sortable />
            <el-table-column prop="CCU" label="CCU" sortable />
            <el-table-column prop="活動參與率" label="活動參與率" />
            <el-table-column prop="完成活動人數" label="完成活動人數" />
            <el-table-column prop="完成率" label="完成率" sortable />
            <el-table-column prop="活動消費" label="活動消費" sortable />
            <el-table-column prop="活動產出" label="活動產出" sortable />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="eventData.length" 
            @current-change="setPage"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import eventData from '../fill_data/eventData'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import SearchEvent from '../search_ui/SearchEvent.vue'

const maxPageItem = 30
const tablePage = ref(1)
const activeTab = ref('t1')

function setPage(val) {
  tablePage.value = val
}
const dataSlice = computed(() => {
  return eventData.slice(
    maxPageItem * tablePage.value - maxPageItem,
    maxPageItem * tablePage.value)
})
</script>

<style>
</style>
