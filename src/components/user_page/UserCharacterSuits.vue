<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="mb-3" @keyup.enter="searchData">
      <SearchUser ref="uiUser" class="my-4"></SearchUser>
      <SearchCharacterSuits ref="uiResourceLog" class="my-4"></SearchCharacterSuits>
      <SearchDateScope v-model:start="uiTimeStart" v-model:end="uiTimeEnd" class="my-4"></SearchDateScope>
      <el-button :disabled="!(selectUserValue&&uiResourceLog&&uiResourceLog.suitId)" @click="searchData">
        查詢
      </el-button>
    </div>
    
    <!-- #endregion input -->
    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="資源" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="logData" v-loading="loading"
            stripe border>
            <el-table-column prop="timeStamp" label="時間" min-width="300">
              <template #default="scope">
                  {{ new Date(scope.row.timeStamp).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="logType" label="操作方式" min-width="100"/>
            <el-table-column prop="count" label="數量" />
            <el-table-column prop="reason" label="來源" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import SearchUser from '../search_ui/SearchUser.vue'
import SearchCharacterSuits from '../search_ui/SearchCharacterSuits.vue'
import SearchDateScope from '../search_ui/SearchDateScope.vue'
import SearchResourceReason from '../search_ui/SearchResourceReason.vue'
import { ElMessage } from 'element-plus'
import axiosApi from '@/js/axiosApi'

const activeTab = ref('account')
const loading = ref(false)
const uiUser = ref()
const uiResourceLog = ref()
const uiTimeStart = ref()
const uiTimeEnd = ref()
const logData = ref()
const selectUserType = computed(() => uiUser.value && uiUser.value.userType)
const selectUserValue = computed(() => uiUser.value && uiUser.value.userValue)

function searchData() {
  loading.value = true

  const param = {
    [selectUserType.value]: selectUserValue.value,
    suitId: uiResourceLog.value.suitId,
    datetimeStart: uiTimeStart.value,
    datetimeEnd: uiTimeEnd.value
  }


  axiosApi
    .get('api/game/user-suit-logs', { params: param })
    .then((res)=> {
        const data = res.data
        logData.value = data.items
      })
    .catch((error)=>{
        logData.value = null
        ElMessage.error(error.toLocaleString())
        loading.value = false
    })
    .finally(()=> {
        loading.value = false
    })
}
</script>

<style>
</style>
