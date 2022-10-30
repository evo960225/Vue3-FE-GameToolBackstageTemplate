<template>
  <el-container direction="vertical">
      <div class="">

        <!---- search-options ---->
        <el-card class="m-3 max-w-[768px]" v-loading="isLoadingItem">
          <div class="space-y-5">
            <div class="flex">
              <label>伺服器：</label>
              <SearchServer 
                v-model:value="uiServerId" 
                all-server-option="true"
                class="mx-4"
              />
            </div>

            <div>
              <label>指定寄件範圍：</label>
              <el-radio v-model="sendType" label="id">玩家ID</el-radio>
              <el-radio v-model="sendType" label="allUser">全部玩家</el-radio>
              <el-radio v-model="sendType" label="onlineUser">在線玩家</el-radio>
              <div class="">
                <div v-if="sendType==='id'">
                  <div class="w-72">
                    <el-input type="text" placeholder="玩家ID" v-model="userId"/>
                  </div>
                </div>
              </div>
            </div>

            <div class="">
              <label>寄送物品：</label>
              <el-radio v-model="isSendItem" label="yes">是</el-radio>
              <el-radio v-model="isSendItem" label="no">否</el-radio>
              <div>
                <div v-if="isSendItem==='yes'">
                  <div v-for="(selectedItem, i) in selectedItems" :key="selectedItem">
                    <el-select 
                      v-model="selectedItems[i]" 
                      filterable
                      has-validation="true" 
                      placeholder="選擇物品"
                      class="my-2"
                    >
                      <el-option
                        v-for="item in itemList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      > 
                      </el-option>
                    </el-select>
                    <span class="m-2 text-gray-300"> x </span>
                    <el-input-number v-model="itemsNum[i]" :min="1" />
                      <el-link type="info" class="ml-5 text-lg"
                        @click="()=> {
                          selectedItems = selectedItems.filter((_,_i) => i !== _i)
                          itemsNum = itemsNum.filter((_,_i) => i !== _i) 
                        }"> 
                        x
                      </el-link>
                  </div>
                 
                  <el-link type="danger" class="mt-2 w-12 text-lg border rounded-sm"
                    @click="()=> selectedItems.push(null) && itemsNum.push(1)">
                    +
                  </el-link>
                </div>
              </div>
            </div>

            <div class="flex pt-2 ">
              <label>信件保留時間：</label>
              <div class="w-72 my-auto">
                <el-select v-model="retenttionTime" class="m-2" placeholder="Select" size="large">
                  <el-option
                    v-for="item in retenttionTimeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </el-card>

        <!---- search-content ---->
        <el-card class="m-3 max-w-[768px]" v-loading="isLoading">
          <div class="space-y-2">
            <el-input v-model="mailSubject" type="text" placeholder="信件標題" />
            <el-input
              v-model="mailContent"
              :rows="5"
              type="textarea"
              placeholder="信件內容"
            />
            
   
            <el-button @click="sendMail" 
              :disabled="!(uiServerId&&userId&&mailSubject&&mailContent)||(isSendItem==='yes'&&selectedItems.every(x => x===null))">
              送出
            </el-button>
          </div>
        </el-card>
      </div>
  </el-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import internal from 'stream';
import { defineComponent, ref, reactive, onMounted } from 'vue'
import axiosApi from '../../js/axiosApi';
import showMessage from '../../js/poolMessage';
import SearchDate from '../search_ui/SearchDate.vue'
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import SearchServer from '../search_ui/SearchServer.vue';

const retenttionTime = ref(30*24*60*60000)
const retenttionTimeList = ref([
  { label:'5分鐘', value: 5*60000 },
  { label:'10分鐘', value: 10*60000 },
  { label:'15分鐘', value: 15*60000 },
  { label:'30分鐘', value: 30*60000 },
  { label:'1小時', value: 60*60000 },
  { label:'2小時', value: 2*60*60000 },
  { label:'3小時', value: 3*60*60000 },
  { label:'6小時', value: 6*60*60000 },
  { label:'12小時', value: 12*60*60000 },
  { label:'1天', value: 1*24*60*60000 },
  { label:'2天', value: 2*24*60*60000 },
  { label:'3天', value: 3*24*60*60000 },
  { label:'7天', value: 7*24*60*60000 },
  { label:'14天', value: 14*24*60*60000 },
  { label:'30天', value: 30*24*60*60000 },
  { label:'60天', value: 60*24*60*60000 },
  { label:'90天', value: 90*24*60*60000 },
  { label:'不限', value: 100*365*24*60*60000 },
])
const isLoading = ref(false)
const sendType = ref('id')
const userId = ref()
const uiServerId = ref()
const isSendItem = ref('no')
const isLoadingItem = ref(false)
const itemList = ref()
const itemsNum = ref([1])
const selectedItems = ref([null])

const mailSubject = ref()
const mailContent = ref()

async function sendMail(){

  const param = {
    serverId: uiServerId.value,
    targetPlayerId: userId.value, 
    senderName: "GM",
    subject: mailSubject.value,
    content: mailContent.value,
    validMillis: retenttionTime.value,
    itemStr: isSendItem.value==='yes' ? 
      selectedItems.value
        .filter(x => x)
        .map((x, i) => x + ":" + itemsNum.value[i] ) 
        .join(';')
      : 'null'
  }

  let postUrl = ''
  if (sendType.value === 'id') postUrl = 'send-player-mail'
  if (sendType.value === 'allUser') postUrl = 'send-world-mail'
  if (sendType.value === 'onlineUser') postUrl = 'send-online-players-mail'
  if (!postUrl) {
    ElMessage.error('寄送範圍錯誤！')
    return
  }

  isLoading.value = true
  await new Promise(r => setTimeout(r, 600));
  ElMessage.success('寄件成功~')
  isLoading.value = false
  resetInput()
}
const getItems = async() => {
  isLoadingItem.value = true
  axiosApi
    .get('api/game/item-list')
    .then((res)=> {
      itemList.value = res.data 
    })
    .catch((error)=>{
      ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
      isLoadingItem.value = false
    })
}
const resetInput = () => {
  userId.value = null
  mailSubject.value = ''
  mailContent.value = ''
  retenttionTime.value = 30*24*60*60000
  selectedItems.value = [null]
  itemsNum.value = [1]
}
onMounted(async(x) => {
  await getItems()
})
</script>

<style>
</style>
