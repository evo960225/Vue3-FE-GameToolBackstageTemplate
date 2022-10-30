<template>
  <el-container direction="vertical">
    <div class="flex ml-4">
      <SearchServer 
        v-model:value="uiServerId" 
        @change="searchData" 
        all-server-option="false"
        class="my-3"
      />
    </div>


    <el-tabs v-model="activeTab">
      <el-tab-pane label="統計圖" name="t1">
        <BarChart  :chartData="chartData" :options="chartOption"/>
      </el-tab-pane>
      <el-tab-pane label="領取統計" name="t2">
        <div class="m-4 shadow-md relative">
          <UiPageTable :data="pageData" :isLoading="isLoading" 
            v-model:page="page" 
            v-model:page-size="pageSize"
            :data-length="dataLength"
          >

            <el-table-column prop="ReadingName" label="商品名稱" />
            <el-table-column prop="FirstMultiple" label="首次倍數" />
            <el-table-column prop="count" label="領取次數" />
            
          </UiPageTable>
        </div>
      </el-tab-pane>
    </el-tabs>

  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import SearchDate from '../search_ui/SearchDate.vue';
import SearchMonth from '../search_ui/SearchMonth.vue';
import UiPageTable from '../ui/UiPageTable.vue';
import axiosApi from '../../js/axiosApi'
import { Chart, registerables } from "chart.js";
import { BarChart } from 'vue-chart-3';
import { ElMessage } from 'element-plus';
import 'chartjs-adapter-moment';
import moment from 'moment';
import SearchServer from '../search_ui/SearchServer.vue';

const activeTab = ref('t1')
const isLoading = ref(false)
const uiServerId = ref()
const searchedData = ref()

const page = ref(1)
const pageSize = ref(25)
const dataLength = ref(0)

Chart.register(...registerables);
const chartOption = ref({ 
  aspectRatio: 2,
  scales: {
    x: {
      
      title: {
        display: true,
        text: '商品'
      },
    },
    y: {
      title: {
        display: true,
        text: '數量'
      },
      min: 0
    }
  },
  borderWidth: 0
  
})

const chartData = ref()



async function searchByDate() {
  isLoading.value = true
  const param = {
    serverId: uiServerId.value
  }
  axiosApi
    .get('api/game/recharge-first', { params: param })
    .then((res)=> {
      searchedData.value = res.data
      dataLength.value = res.data.length
      const sorted_byId = [...res.data].sort((a,b)=> a.CommodityID - b.CommodityID)
      chartData.value = {
        'labels': sorted_byId.map((x)=>x.ReadingName),
        'datasets': [{
          label: '領取數量',
          data: sorted_byId.map((x)=>x.count)
        }]
      }
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoading.value = false
    })
}
const pageData = computed(() => {
  const fdata = searchedData.value
  return fdata && fdata.slice(pageSize.value * page.value - pageSize.value, pageSize.value * page.value)
})
const searchData = async() => {
  searchByDate()
}
onMounted(()=>{
  searchData()
})
</script>

<style>
</style>
