<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="mb-3" @keyup.enter="searchData">
        <SearchUser ref="uiUser" class="my-4"></SearchUser>
        <SearchStage ref="uiStage" class="my-4"></SearchStage>
        <el-button @click="searchData">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="關卡紀錄" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="stageData" v-loading="loading"
            stripe border>
            <el-table-column prop="number" label="關卡" width="120" sortable/>
            <el-table-column prop="firstTimeStart" label="首次開始時間" width="250"/>
            <el-table-column prop="firstTimePass" label="首次通關時間" width="250"/>
            <el-table-column prop="score" label="最高分數" width="120" sortable align="right">
              <template #default="scope">
                {{ scope.row.score.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="spendTime" label="花費時間(秒)" sortable align="right">
              <template #default="scope">
                {{ scope.row.spendTime.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="playTimes" label="遊戲次數" sortable align="right" width="100">
              <template #default="scope">
                {{ scope.row.playTimes.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="playTimes" label="接關次數" sortable align="right" width="100">
              <template #default="scope">
                {{ scope.row.continueCount && scope.row.continueCount.toLocaleString() }}
              </template>
            </el-table-column>
            <!--
            <el-table-column prop="玩家使用角色" label="玩家使用角色">
               <template #default="scope">
                {{ scope.row.team }}
              </template>
            </el-table-column>
            -->
            <el-table-column prop="使用小槌子數量" label="小槌子使用量" width="50" />
            <el-table-column prop="使用大槌子數量" label="大槌子使用量" width="50" />
            <el-table-column prop="使用手套數量" label="手套使用量" width="50"/>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '@/js/axiosApi'
import { ElMessage } from 'element-plus'
import SearchUser from '../search_ui/SearchUser.vue';
import SearchStage from '../search_ui/SearchStage.vue';

const loading = ref()
const uiUser = ref()
const stageData = ref()
const activeTab = ref('account')

// function
function searchData(){
  loading.value = true

  const param = {}
  const selectUserType = uiUser.value.userType
  const selectUserValue = uiUser.value.userValue
  param[selectUserType] = selectUserValue

  axiosApi
    .get('api/game/user-level-progress', { params: param })
    .then((res)=> {
        const data = res.data
        stageData.value = data.items
        // datetime format
        stageData.value.forEach((e,i,a) => {
          if(e.firstTimeStart) {
            a[i].firstTimeStart = new Date(e.firstTimeStart).toLocaleString()
          }
          if(e.firstTimePass) {
            a[i].firstTimePass = new Date(e.firstTimePass).toLocaleString()
          }
        });
      })
    .catch((error)=>{
        stageData.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        loading.value = false
    })
}
</script>

<style>
</style>
