<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <el-container direction="horizontal" class="my-4">
      <SearchYear></SearchYear>
      <el-button>查詢</el-button>
    </el-container>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="月表" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="monthly"
            stripe border>
            <el-table-column prop="月份" label="月份" />
            <el-table-column prop="人數" label="人數" />
          </el-table>
        </div>
      </el-tab-pane>

      <!-- #region user -->
      <el-tab-pane label="周表" name="t2">
        <div class="m-4 shadow-md relative">
          <el-table :data="weekly" 
            stripe border>
            <el-table-column prop="週數" label="週數" />
            <el-table-column prop="人數" label="人數" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="折線圖" name="t3">
        <div class="m-4 shadow-md relative">
          <apexchart width="1000" type="line" :options="options" :series="series"></apexchart>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchYear from '../search_ui/SearchYear.vue'
import { weekly, monthly } from '../fill_data/reflowData'

const maxPageItem = 20
const page = ref(1)
const activeTab = ref('t1')

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return weekly
})
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})

var series = [{
    data: weekly.map(x=>x.人數)
}]
      
var options = {
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
    text: '每周回留人數',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: weekly.map((x,i,a)=>i),
  }
}

      
</script>

<style>
</style>
