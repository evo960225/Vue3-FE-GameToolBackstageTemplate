<template>
  <el-container direction="vertical">
    <el-tabs v-model="activeTab" v-loading="isLoading">
      <el-tab-pane label="充值近況" name="t1">
        <SearchServer 
          v-model:value="uiServerId" 
          @change="searchData" 
          all-server-option="true"
          class="mx-4"
        />
        <LineChart :chartData="chartData" :options="chartOption"/>
      </el-tab-pane>
      <el-tab-pane label="日統計" name="t2">
        <div class="flex">
          <SearchServer 
            v-model:value="uiServerId" 
            @change="searchData" 
            all-server-option="true"
            class="mx-4"
          />
          <SearchDate v-model:date="searchDate" @change="searchHourly" /> 
        </div>
        <LineChart :chartData="chartDailyData" :options="chartOption"/>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import SearchDate from '../search_ui/SearchDate.vue';
import SearchMonth from '../search_ui/SearchMonth.vue';
import axiosApi from '../../js/axiosApi'
import { Chart, registerables } from "chart.js";
import { LineChart } from 'vue-chart-3';
import { ElMessage } from 'element-plus';
import 'chartjs-adapter-moment';
import moment from 'moment';
import SearchServer from '../search_ui/SearchServer.vue';
Chart.register(...registerables);

const activeTab = ref('t1')
const isLoading = ref(false)
const uiServerId = ref()
const chartOption = ref({ 

  responsive: true,
  aspectRatio: 2,
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
          text: '金額',
        },
        position: 'left',
        min: 0,
    },
    y2: {
      title: {
          display: true,
          text: '充值次數',
        },
      position: 'right',
      min: 0,
      grid: {
        drawOnChartArea: false // only want the grid lines for one axis to show up
      },
    }
  }
})
const colors =  ['rgba(255, 99, 132, 1)']
const chartData = ref()
const chartDailyData = ref()

const searchDate = ref(new Date().setHours(0,0,0,0))


async function searchRecent24Hour() {
  isLoading.value = true
  const param = {
    serverId: uiServerId.value,
    date: moment(new Date()).format('YYYYMMDD')
  }
  axiosApi
    .get('api/game/recent-payment', { params: param })
    .then((res)=> {
      const hourList = [...Array(24)].map((_,i)=>moment().startOf('hour').subtract(24-i, 'hours').toDate())
      const dataList = [...Array(24)].map((_,i)=> {
        const date_ymdh = moment().startOf('hour').subtract(24-i, 'hours').format('YMMDDHH')
        return res.data.find( ({ date_hour }) => date_hour === date_ymdh ) || 0;
      })
      res.data.forEach((x, i, a)=> {
        a[i].date = moment(x.date_hour.slice(0,8) + ' ' + x.date_hour.slice(-2) + '0000').toDate()
      })
      chartData.value = {
        'labels': hourList, //符合moment格式
        'datasets': [
          {
            label: '充值金額',
            data: dataList.map((x)=>x.money ? x.money : 0),
          }, {
            label: '充值次數',
            data: dataList.map((x)=>x.count ? x.count : 0),
            yAxisID: 'y2',
            type: 'bar',
          }
        ]
      }
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoading.value = false
    })
}

async function searchHourly() {
  isLoading.value = true
  const param = {
    serverId: uiServerId.value,
    date: moment(searchDate.value).format('YYYYMMDD')
  }
  axiosApi
    .get('api/game/recharge-hourly', { params: param })
    .then((res)=> {
      const hourList = [...Array(24)].map((_,i)=>moment(searchDate.value).startOf('hour').add(i, 'hours').toDate())
      const dataList = [...Array(24)].map((_,i)=> {
        const date_ymdh = moment(searchDate.value).startOf('hour').add(i, 'hours').format('YMMDDHH')
        
        return res.data.find( ({ date_hour }) => date_hour === date_ymdh ) || 0;
      })

      res.data.forEach((x, i, a)=> {
        a[i].date = moment(x.date_hour.slice(0,8) + ' ' + x.date_hour.slice(-2) + '0000').toDate()
      })
      chartDailyData.value = {
        'labels': hourList, //符合moment格式
        'datasets': [
          {
            label: '充值金額',
            data: dataList.map((x)=>x.money ? x.money : 0),
          }, {
            label: '充值次數',
            data: dataList.map((x)=>x.count ? x.count : 0),
            yAxisID: 'y2',
            type: 'bar',
          }
        ]
      }
    })
    .catch((e)=> {

    })
    .finally(()=> {
        isLoading.value = false
    })
}


function searchData() {
  searchRecent24Hour()
  searchHourly()
}

onMounted(()=>{
  searchData()
})
</script>

<style>
</style>
