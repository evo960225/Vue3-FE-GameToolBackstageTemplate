<template>
  <el-container direction="vertical">
      <div class="">

        <!---- mail-options ---->
        <el-card class="m-3 max-w-[768px]">
          <div>
            <label>寄件排程：</label>
            <el-radio v-model="isScheduling" label="false">否</el-radio>
            <el-radio v-model="isScheduling" label="true" :disabled="true">是 (需離現在"2分鐘"之後)</el-radio>
            <div v-if="isScheduling==='true'" class="ml-3 mb-3">
              <SearchDateTime></SearchDateTime>
            </div>
          </div>
          <div class="space-y-2">
            <label>指定寄件範圍：</label>
            <el-radio v-model="selectScope" label="id">玩家ID</el-radio>
            <el-radio v-model="selectScope" label="allUser" :disabled="true">全部玩家</el-radio>
            <el-radio v-model="selectScope" label="createTime" :disabled="true">創號範圍</el-radio>
            <div class="">
              <div v-if="selectScope==='id'">
                <div class="pb-2 w-72">
                  <el-input v-model="id" type="text" placeholder="玩家ID" />
                </div>
              </div>
              <div v-if="selectScope==='createTime'">
                <div class="pb-2">
                  <label class="block my-4">指定於此時間之前創立的玩家帳號：</label>
                  <SearchDateTimeScope class="ml-2"></SearchDateTimeScope>
                </div>
              </div>
            </div>
            <div>
              <SearchDateTime v-model:datetime="strDeleteTime" title="指定刪除信件日期："></SearchDateTime>
            </div>
          </div>
        </el-card>

        <!---- mail-content ---->
        <el-card class="m-3 max-w-[768px]">
          <div class="space-y-2">
            <div>
              <div class="text-sm text-bgray-300">
                * 不可使用特殊符號
              </div> 
              <el-input v-model="title" type="text" placeholder="信件標題" maxlength="11" show-word-limit/>
            </div>
            <div>
              <div class="text-sm text-bgray-300">
                * 不可使用特殊符號
              </div>
              <el-input
                v-model="contents"
                maxlength="100"
                show-word-limit
                :rows="5"
                type="textarea"
                placeholder="信件內容"
              />
            </div>
            <el-input v-model="giftboxId" type="text" placeholder="禮包編號" />
            <el-input v-model="note" type="text" placeholder="備註" />

            <!--<el-input type="password" placeholder="執行人密碼" />-->
            <el-button @click="sendMail">送出</el-button>
          </div>
        </el-card>
      </div>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { defineComponent, ref, reactive } from 'vue'
import axiosApi from '../../js/axiosApi';
import SearchDate from '../search_ui/SearchDate.vue'
import SearchDateTime from '../search_ui/SearchDateTime.vue';

// form condition
const isServerLoading = ref(false)
const isScheduling = ref('false')
const selectScope = ref()

// api input data
const id = ref()
const title = ref()
const contents = ref()
const giftboxId = ref()
const strDeleteTime = ref()
const node = ref()


function sendMail() {
  console.log(strDeleteTime.value);
  const param = {
    id: id.value,
    title: title.value,
    contents: contents.value,
    giftboxId:  parseInt(giftboxId.value),	
    ttl: strDeleteTime.value? new Date(strDeleteTime.value).getTime() : -1,
    node: node.value
  }
  axiosApi
    .post('api/game/operate/send-mail', param)
    .then((res)=> {
      const data = res.data
      ElMessage.success('寄送成功！')

      id.value = null
      title.value = null
      contents.value = null
      giftboxId.value = null
      strDeleteTime.value = null
    })
    .catch((error)=>{
      ElMessage.error(error.response.data)
    })
    .finally(()=> {
      isServerLoading.value = false
    })
}

</script>

<style>
</style>
