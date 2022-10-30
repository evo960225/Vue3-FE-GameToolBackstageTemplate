<template>
  <div class="w-[768px]">
    <el-card v-loading="isLoading" class="m-3  md:w-full" >
      <div class="space-y-5">

        <div class="flex">
          <label class="w-[100px]">伺服器：</label>
          <SearchServer 
            v-model:value="uiServerId"
            @change="pageReload" 
            all-server-option="false"
            class="mr-3"
          />
        </div>

        <div class="">
          <label class="w-[100px]">JSON Command：</label>
          <el-input
            v-model="commandBody"
            type="textarea"
            :autosize="{ minRows: 3 }"
            class="mt-3 w-full"
          />
        </div>

        <div class="flex">
          <el-button @click="sendCommand" :disabled="!(uiServerId && commandBody)" >
            送出
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-loading="isLoading" class="m-3 h-32 md:w-full" >
      <label class="w-[100px]">回應：</label>
      <div class="px-1 py-2">{{ responseBody }}</div>
    </el-card>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import SearchServer from '../search_ui/SearchServer.vue';
import axiosApi from '../../js/axiosApi';
import showMessage from '../../js/poolMessage';
import { ElMessage } from 'element-plus';
import 'chartjs-adapter-moment';
import moment from 'moment';

const isLoading = ref(false)
const uiServerId = ref()
const commandBody = ref(`{
  "action": 250,
  "command": ""
}`)
const responseBody = ref('{}')


async function sendCommand() {
  isLoading.value = true
  const param = {
    serverId: uiServerId.value,
    commandBody: commandBody.value,
  }
  axiosApi
    .post('api/game/backend-command', param)
    .then((res)=> {
      responseBody.value = res.data
    })
    .catch((e)=> {
      ElMessage.error('不明錯誤！')
    })
    .finally(()=> {
      isLoading.value = false
    })
}

</script>

<style>
</style>
