<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <el-container direction="horizontal" class="my-4">
      <SearchIntervalTimeScope></SearchIntervalTimeScope>
      <el-button>查詢</el-button>
    </el-container>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">

      <el-tab-pane label="日表" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="dailySlice"
            stripe border>
            <el-table-column prop="日期" label="日期" />
            <el-table-column prop="人數" label="人數" />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="daily.length" 
            @current-change="setDailyPage"></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="周表" name="t2">
        <div class="m-4 shadow-md relative">
          <el-table :data="weeklySlice"
            stripe border>
            <el-table-column prop="週數" label="週數" />
            <el-table-column prop="人數" label="人數" />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="weekly.length" 
            @current-change="setWeeklyPage"></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="月表" name="t3">
        <div class="m-4 shadow-md relative">
          <el-table :data="monthly" 
            stripe border>
            <el-table-column prop="月份" label="月份" />
            <el-table-column prop="人數" label="人數" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="折線圖" name="t4">
        <div class="m-4 shadow-md relative">
          <apexchart width="1000" type="line" :options="chartOptions" :series="weeklySeries"></apexchart>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchIntervalTimeScope from '../search_ui/SearchIntervalTimeScope.vue'
import { daily, weekly, monthly } from '../fill_data/retentionData'

const maxPageItem = 30
const weeklyPage = ref(1)
const dailyPage = ref(1)
const activeTab = ref('t1')

function setWeeklyPage(val) {
  weeklyPage.value = val
}
function setDailyPage(val) {
  dailyPage.value = val
}
const weeklySlice = computed(() => {
  return weekly.slice(maxPageItem * weeklyPage.value - maxPageItem, maxPageItem * weeklyPage.value)
})
const dailySlice = computed(() => {
  return daily.slice(maxPageItem * dailyPage.value - maxPageItem, maxPageItem * dailyPage.value)
})
const weeklySeries = [{
    data: weekly.map(x=>x.人數)
}]
var chartOptions = {
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: '每周駐留人數',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: weekly.map((x,i,a)=>x.週數),
  }
}
</script>

<style>
</style>
