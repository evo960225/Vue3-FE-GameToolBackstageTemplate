<template>
  <el-container direction="vertical">
    
    <!-- #region input -->
    <div class="my-4 space-y-4">
      <SearchDateScope v-model:start="searchDateStart" v-model:end="searchDateEnd" @change="searchData"/>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">

      <!-- #通關率 -->
      <el-tab-pane label="通關率" name="t1">
        <div class="m-2 shadow-md relative">
        <UiPageTable 
          :data="pageData"
          :data-length="tableRowLength"
          v-model:page="page"
          v-model:page-size="maxPageItem"
          :is-loading="isLoading"
          >
          <el-table-column prop="_id.number" label="關卡" width="100" />
          <el-table-column prop="count" label="總次數"  align="right" width="100">
            <template #default="scope">
              {{ scope.row.count !== undefined ? scope.row.count.toLocaleString() : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="passed" label="通關數" align="right" width="100">
            <template #default="scope">
              {{ scope.row.passed !== undefined ? scope.row.passed.toLocaleString() : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="passedRate" label="通關率" align="right" width="100">
            <template #default="scope">
              {{ scope.row.passedRate !== undefined ? (scope.row.passedRate * 100).toFixed(1) + '%' : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="leftStep" label="平均剩餘步數"  align="right" width="100">
            <template #default="scope">
              {{ scope.row.leftStep !== undefined ? (scope.row.leftStep).toFixed(1) : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="leftTime" label="平均剩餘秒數"  align="right" width="100">
            <template #default="scope">
              {{ scope.row.leftTime !== undefined ? (scope.row.leftTime).toFixed(1) : '-'}}
            </template>
          </el-table-column>
        </UiPageTable>
        </div>
      </el-tab-pane>


    </el-tabs>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import axiosApi from '../../js/axiosApi'
import moment from 'moment'
import SearchDate from '../search_ui/SearchDate.vue'
import UiPageTable from '../ui/UiPageTable.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'

const activeTab = ref('t1')
const stageData = ref()
const selectedlevel = ref()
const characterInLevel = ref()


const isLoading = ref(false)
const maxPageItem = ref(100)
const tableRowLength = ref(0)
const page = ref(1)
const searchDateStart = ref(new Date())
const searchDateEnd = ref(new Date())
const statisticDataByDate = ref({})
const statisticData = ref({})
const tableData = ref([])
const pageData = computed(() => {
  const data = tableData.value

  return data ? data.slice(maxPageItem.value * page.value - maxPageItem.value, maxPageItem.value * page.value) : []
})

async function loadData() {
  isLoading.value = true
  await axiosApi
    .get('api/game/server-levelfinish-statistic')
    .then((res)=> {
      const data = res.data
      
      // Object convert to Array
      data.forEach((x, i, a)=> { 

        if(!x._id.number) return

        if (!statisticDataByDate.value[x._id.date]) { 
          statisticDataByDate.value[x._id.date] = {} 
        } 
        x.passedRate = x.passed / (x.count || 1)
        statisticDataByDate.value[x._id.date][x._id.number] = x 

        
        if (!statisticData.value[x._id.number]) {
          statisticData.value[x._id.number] = {
            passed: 0,
            leftStep_sum: 0,
            leftTime_sum: 0,
            levelStep_sum: 0,
            levelTime_sum: 0,
            score_sum: 0,
            count: 0
          } 
        } 

        statisticData.value[x._id.number].passed += x.passed
        statisticData.value[x._id.number].leftStep_sum += x.leftStep * x.count
        statisticData.value[x._id.number].leftTime_sum += x.leftTime * x.count
        statisticData.value[x._id.number].levelStep_sum += x.leftStep * x.count
        statisticData.value[x._id.number].levelTime_sum += x.levelTime * x.count
        statisticData.value[x._id.number].score_sum += x.score * x.count
        statisticData.value[x._id.number].count += x.count
        
      })

    })
    .catch((error)=>{
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        isLoading.value = false
    })
}

async function searchData() {
  console.log(searchDateStart.value);
  console.log(searchDateEnd.value);
  if (searchDateStart.value && searchDateEnd.value) {
    searchDataByDate()
  } else {
    searchTotalData()
  }
}

async function searchDataByDate() {
  isLoading.value = true
  const dateStart = moment(searchDateStart.value)
  const dateEnd = moment(searchDateEnd.value)
  const list_dataBydate = []

  let curDate = dateStart
  while (curDate <= dateEnd) {
    const dateData = statisticDataByDate.value[curDate.format('YYYYMMDD')]

    // push data by date
    if (dateData) {
      dateData && list_dataBydate.push(dateData)
    }
    curDate = curDate.add(1, 'd')
  }

  const statisticData = {}
  console.log(list_dataBydate)
  list_dataBydate.forEach(dataBydate => {
    Object.keys(dataBydate).forEach(levelNumber => {
      const levelData = dataBydate[levelNumber]
      if (!statisticData[levelNumber]) {
        statisticData[levelNumber] = {...levelData} // clone
      } else {
        statisticData[levelNumber].passed += levelData.passed
        statisticData[levelNumber].leftStep_sum += levelData.leftStep * levelData.count
        statisticData[levelNumber].leftTime_sum += levelData.leftTime * levelData.count
        statisticData[levelNumber].levelStep_sum += levelData.leftStep * levelData.count
        statisticData[levelNumber].levelTime_sum += levelData.levelTime * levelData.count
        statisticData[levelNumber].score_sum += levelData.score * levelData.count
        statisticData[levelNumber].count += levelData.count
      }
    })
  })

  // get max level number 
  const levelNumbers =  Object.keys(statisticData).length !== 0 ? Object.keys(statisticData) : [0]
  const maxLevelNumber = levelNumbers
    .reduce((pre, cur) => { 
      return pre > parseInt(cur) ? pre : parseInt(cur) 
    })
  tableRowLength.value = maxLevelNumber


  tableData.value = [...Array(maxLevelNumber).keys()].map((i) => {
    const numberData = statisticData[i+1]
    if (!numberData)  return { _id: { number: i + 1}}
    numberData._id = {number: i + 1 }
    numberData.leftStep = numberData.leftStep_sum / numberData.count
    numberData.leftTime = numberData.leftTime / numberData.count
    numberData.levelStep = numberData.leftStep / numberData.count
    numberData.levelTime = numberData.levelTime / numberData.count
    numberData.score = numberData.score / numberData.count
    numberData.passedRate = numberData.passed / (numberData.count || 1)
    return numberData
  })

  
  isLoading.value = false
}

async function searchTotalData() {
  isLoading.value = true

  // get max level number 
  const levelNumbers =  Object.keys(statisticData.value).length !== 0 ? Object.keys(statisticData.value) : [0]
  const maxLevelNumber = levelNumbers
    .reduce((pre, cur) => { 
      return pre > parseInt(cur) ? pre : parseInt(cur) 
    })
  tableRowLength.value = maxLevelNumber


  // create tableData length by max level number
  tableData.value = [...Array(maxLevelNumber).keys()].map((i) => {
    const numberData = statisticData.value[i+1]
    if (!numberData)  return { _id: { number: i + 1}}
    numberData._id = {number: i + 1 }
    numberData.leftStep = numberData.leftStep_sum / numberData.count
    numberData.leftTime = numberData.leftTime / numberData.count
    numberData.levelStep = numberData.leftStep / numberData.count
    numberData.levelTime = numberData.levelTime / numberData.count
    numberData.score = numberData.score / numberData.count
    numberData.passedRate = numberData.passed / (numberData.count || 1)
    return numberData
  })
  isLoading.value = false
}

const filterTableData = computed(() => {
  return stageData
})

onMounted(async() => {
  await loadData()
  await searchData()
})

</script>

<style>
</style>
