<template>
  <el-container direction="vertical">

    

    <el-tabs v-model="activeTab">
      <el-tab-pane label="PCU (日)" name="t1">
        <div class="flex ml-4">
          <SearchServer 
            v-model:value="uiServerId" 
            @change="searchData" 
            all-server-option="false"
            class="my-3"
          />
          <SearchDate v-model:date="searchDate" @change="searchByDate" class="ml-2 my-auto"></SearchDate>
        </div>
        <LineChart :chartData="chartData" :options="chartOption"/>
      </el-tab-pane>
      <el-tab-pane label="PCU (月)" name="t2" vloading="isLoadingMonth">
        <div class="flex ml-4">
          <SearchServer 
            v-model:value="uiServerId" 
            @change="searchData" 
            all-server-option="false"
            class="my-3"
          />
          <SearchMonth v-model:month="searchMonth" @change="searchByMonth" class="ml-2 my-auto"></SearchMonth>
        </div>
        <LineChart :chartData="chartDataByMonth" :options="chartMonthOption"/>
      </el-tab-pane>
    </el-tabs>

  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import SearchDate from '../search_ui/SearchDate.vue';
import SearchMonth from '../search_ui/SearchMonth.vue';
import SearchServer from '../search_ui/SearchServer.vue';
import axiosApi from '../../js/axiosApi'
import { Chart, registerables } from "chart.js";
import { LineChart } from 'vue-chart-3';
import { ElMessage } from 'element-plus';
import 'chartjs-adapter-moment';
import moment from 'moment';


const activeTab = ref('t1')
const isLoading = ref(false)
const isLoadingMonth = ref(false)
const uiServerId = ref()

Chart.register(...registerables);
const chartOption = ref({ 
  aspectRatio: 3,
  scales: {
    x: {
      type: 'timeseries',
      time: {
        unit: 'hour'
      },
      title: {
        display: true,
        text: '時間'
      },
    },
    y: {
      title: {
        display: true,
        text: '人數'
      },
      min: 0
    }
  }
})
const chartMonthOption = ref({ 
  aspectRatio: 3,
  scales: {
    x: {
      type: 'timeseries',
      time: {
        unit: 'day'
      },
      title: {
        display: true,
        text: '時間'
      },
    },
    y: {
      title: {
        display: true,
        text: '人數'
      },
      min: 0
    }
  }
})
const colors =  ['rgba(255, 99, 132, 1)']
const chartData = ref()
const chartDataByMonth = ref()

const searchDate = ref(moment().set({hour:0,minute:0,second:0,millisecond:0}).toDate())
const searchMonth = ref(moment().set({date:1, hour:0,minute:0,second:0,millisecond:0}).toDate())


async function searchByDate() {
  isLoading.value = true
  const param = {
    date: moment(searchDate.value).format('YYYYMMDD'),
    serverId: uiServerId.value
  }
  const data = [...Array(24)].map((x, i, a) => {
    return { num: Math.floor(Math.random() * 40 + 10) , time: searchDate.value.getTime() + 3600000*i }
  })

  chartData.value = {
    'labels': data.map((x) => new Date(x.time)),
    'datasets': [{
      label: '玩家人數',
        data: data.map((x) => x.num)
    }]
  }
  

}

async function searchByMonth() {
  isLoadingMonth.value = true
  const param = {
    date_ym: moment(searchMonth.value).format('YYYYMM'),
    serverId: uiServerId.value
  }

  const data = [...Array(30)].map((x, i, a) => {
    return { num: Math.floor(Math.random() * 40 + 10) , time: searchMonth.value.getTime() + 3600000*24*i }
  })

  chartDataByMonth.value = {
    'labels': data.map((x) => new Date(x.time)),
    'datasets': [{
      label: '玩家人數',
        data: data.map((x) => x.num)
    }]
  }

  /*
  axiosApi
    .get('api/game/pcu/month', { params: param })
    .then((res)=> {
      chartDataByMonth.value = {
        'labels': res.data.map((x)=>new Date(x.time)),
        'datasets': [{
          label: '玩家人數',
          data: res.data.map((x)=>x.num)
        }]
      }
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoadingMonth.value = false
    })
    */
}
const searchData = async() => {
  searchByDate()
  searchByMonth()
}
onMounted(()=>{
  searchData()
})
</script>

<style>
</style>
