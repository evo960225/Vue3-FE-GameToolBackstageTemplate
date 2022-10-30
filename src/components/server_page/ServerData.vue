<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <el-container direction="horizontal" class="my-4">
      <SearchTimeScope></SearchTimeScope>
      <el-button>查詢</el-button>
    </el-container>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="總報表" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData"
            stripe border>
            <el-table-column prop="搜尋日期" label="搜尋日期" width="120" fixed />
            <el-table-column prop="登入人數" label="登入人數" />
            <el-table-column prop="新註冊玩家" label="新註冊玩家" />
            <el-table-column prop="DAU" label="DAU" width="65" />
            <el-table-column prop="WAU" label="WAU" width="65" />
            <el-table-column prop="MAU" label="MAU" width="65" />
            <el-table-column prop="最高在線" label="MAX CCU" />
            <el-table-column prop="AvgCCU" label="AvgCCU" />
            <el-table-column prop="本日第一次付費人數" label="本日第一次付費人數" />
            <el-table-column prop="付費人數" label="付費人數" />
            <el-table-column prop="付費率" label="付費率" />
            <el-table-column prop="收入(TWD)" label="收入(TWD)" width="130"/>
            <el-table-column prop="ARPU" label="ARPU" />
            <el-table-column prop="ARPPU" label="ARPPU" />
            <el-table-column prop="AU" label="AU" />
            <el-table-column prop="廣告點擊數" label="廣告點擊數" />
            <el-table-column prop="廣告點擊率" label="廣告點擊率" />
            <el-table-column prop="次留數" label="次留數" />
            <el-table-column prop="3日留存" label="3日留存" />
            <el-table-column prop="5日留存" label="5日留存" />
            <el-table-column prop="7日留存" label="7日留存" />
            <el-table-column prop="14日留存" label="14日留存" />
            <el-table-column prop="30日留存" label="30日留存" />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="filterTableData.length" 
            @current-change="set_page"></el-pagination>
        </div>
      </el-tab-pane>

      <!-- #region user -->
      <el-tab-pane label="留存" name="t2">
        <div class="m-4 shadow-md relative">
          <el-table :data="userData" 
            stripe border>
            <el-table-column fixed prop="label" label="標題" width="180" />
            <el-table-column prop="value" label="內容" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import serverData from '../fill_data/serverData'

const maxPageItem = 20
const page = ref(1)
const activeTab = ref('t1')

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return serverData
})
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})
</script>

<style>
</style>
