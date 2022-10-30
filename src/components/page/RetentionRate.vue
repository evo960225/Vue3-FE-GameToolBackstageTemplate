<template>
  <el-container direction="vertical">

    <table>
      <tr class="h-3 bg-bgray-300/50">
        <th class="px-2 py-1 w-32 text-gray-600">日期</th>
        <th class="px-2 py-1 w-20 text-right text-gray-600">註冊人數</th>
        <th v-for="offset in offsetDayList" :key="offset" class="text-right px-2 py-1 w-20 text-gray-600"> 
          +{{ offset }}天 
        </th>
      </tr>
      <tr class="h-3 bg-gray-200/20" v-for="(date, index) in allLoginDate" v-bind:key="date">
        <td class="px-2 py-1">{{ date }}</td>
        <td class="px-2 py-1 text-right">{{ retentionRateData[date].CreateDateCount.toLocaleString() }}</td>
        <td v-for="offset in offsetDayList" v-bind:key="offset" class="text-right px-2 py-1"> 
          {{ retentionRateData[date][offset] && (retentionRateData[date][offset].retentionRate*100).toFixed(1) + '% ' }}
        </td>
      </tr>
    </table>
  </el-container>
</template>


<script setup>
import SearchDate from '../search_ui/SearchDate.vue'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'
import UiPageTable from '../ui/UiPageTable.vue';
import moment from 'moment';

const activeTab = ref('account')
const uiUser = ref()
const retentionRateData = ref()
const isLoading = ref(false)
const searchDate = ref()
const allLoginDate = ref()
const offsetDayList = ref([1,2,3,4,5,6,7,14,30])
// function
async function searchData(){
  isLoading.value = true

  const param = {
    date: moment().format('YYYYMMDD')
  }

  axiosApi
    .get
    ('api/game/retention-rate', { params : param } )
    .then((res)=> {
      const data = res.data
      retentionRateData.value = {}

      Object.entries(data).forEach(([k,v])=> {
        const date = k.split('_')[1]
        retentionRateData.value[date] = {}
        retentionRateData.value[date]['CreateDateCount'] = Object.values(v)[0].CreateDateCount
        Object.entries(v).forEach(([row_k,row_v])=> {
          retentionRateData.value[date][row_k.split('_')[0]] = row_v
        })
      })
      
      allLoginDate.value = Object.entries(data).map(([k,v])=> {
        return k.split('_')[1]
      }); 

    })
    .catch((error)=>{
        userData.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        //isLoading.value = false
    })
}
onMounted((x) => {
  searchData()
})
</script>

<style scoped>
table, td {
  border: 1px dashed #f0f0f0;
}

</style>
