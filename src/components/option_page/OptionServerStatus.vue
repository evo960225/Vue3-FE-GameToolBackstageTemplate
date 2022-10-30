<!--
      +--------------------+
      | +--------+ +-----+ |
      | | status | | btn | |
      | +--------+ +-----+ |
      | +----------------+ |
      | | log            | |
      | +----------------+ |
      +--------------------+
-->
<template>
  <el-container direction="vertical">
    
    <div class="flex">  
      <el-card header="伺服器狀態(x)" class="m-4 w-1/2">
        <el-table :data="serverStatus" :show-header="false"
          stripe border >
          <el-table-column prop="key" label="名稱"/>
          <el-table-column prop="value" label="值"/>
          <el-table-column label="操作" width="40">
            <template #default="scope">
              <el-link type="primary"
                v-if="scope.row.key==='承載人數上限'"
                @click="showEditLimitNumber=true">
                <font-awesome-icon :icon="['far', 'edit']" />
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="m-4" header="伺服器設定" v-loading="isServerLoading">
        <div class="flex flex-col space-y-2 mx-4">
          <el-button class="button" type="info" @click="changeSystemStatus('ShutdownPreparing')">準備進入維護</el-button>
          <span></span>
          <el-button class="button" type="danger" @click="changeSystemStatus('Maintaining')">強制進入維護</el-button>
          <span></span>
          <el-button class="button" type="warning" @click="changeSystemStatus('PreRegistering')">進入預先註冊狀態</el-button>
          <span></span>
          <el-button class="button" type="primary" @click="changeSystemStatus('Operating')">開機</el-button>
        </div>
      </el-card>
    </div>  
    <el-card class="m-4 min-w-[300px]" header="伺服器log(x)">
      <div class="flex flex-col space-y-2 mx-2">
        <el-table
          :data="serverLog" :show-header="false" stripe>
          <el-table-column prop="time" width="300"></el-table-column>
          <el-table-column prop="content"></el-table-column>
        </el-table>
      </div>
    </el-card>



    <!-- hide -->
    <el-dialog
      v-model="showEditLimitNumber"
      title="變更承載人數上限"
      width="30%"
    >
      <el-input-number v-model="limitNum" :step="100" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditLimitNumber=false">取消</el-button>
          <el-button type="danger" @click="showEditLimitNumber=false">變更</el-button>
        </span>
      </template>
    </el-dialog>

  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import serverStatus from '../fill_data/serverStatus'
import serverLog from '../fill_data/serverLog'
import axiosApi from '../../js/axiosApi'

const isServerLoading = ref(false)
const showEditLimitNumber = ref()
const limitNum = ref(1000)

function changeSystemStatus(setStatus) {
  isServerLoading.value = true
  const param = {
    serverStatus: setStatus
  }
  axiosApi
    .post('api/game/operate/change-system-status', { params: param })
    .then((res)=> {
      const data = res.data
      ElMessage.success('運行成功！')

    })
    .catch((error)=>{
      logData.value = null
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      isServerLoading.value = false
    })
}
</script>

<style>
</style>
