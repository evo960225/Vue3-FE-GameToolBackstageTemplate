<template>
  <el-container direction="vertical">

    <el-tabs v-model="activeTab">
      <el-tab-pane label="當前上線" name="account">
        <SearchServer 
          v-model:value="uiServerId" 
          @change="searchData" 
          all-server-option="false"
          class="ml-4"
          :isLoading="loading"
        />
        <div class="m-4 shadow-md relative">
          <UiPageTable :data="pageData" :isLoading="loading" 
            v-model:page="page" 
            v-model:page-size="pageSize"
            :data-length="dataLength"
            @sort-change="sortData"
          >
            <el-table-column prop="playerId" label="玩家ID" width="220" />
            <el-table-column prop="playerName" label="玩家名稱" />
            <el-table-column prop="playerLevel" label="等級"  width="80" sortable="custom" />
            <el-table-column prop="vipLevel" label="VIP"  width="80" sortable="custom"/>
            <el-table-column prop="gold" label="金幣" align="right">
              <template #default="scope">
                {{ parseInt(scope.row.gold).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="arenaRank" label="競技場排名"  width="80" sortable="custom" />
          </UiPageTable>
        </div>
      </el-tab-pane>

    </el-tabs>
  </el-container>
</template>


<script setup>
import SearchUser from '../search_ui/SearchUser.vue'
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import axiosApi from '@/js/axiosApi'
import UiPageTable from '../ui/UiPageTable.vue';
import SearchServer from '../search_ui/SearchServer.vue';

const axiosSource = axios.CancelToken.source();

const activeTab = ref('account')

const uiServerId = ref()
const uiUser = ref()
const userData = ref()
const loading = ref(false)


// table
const page = ref(1)
const pageSize = ref(25)
const dataLength = ref()

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return userData.value
})

const pageData = computed(() => {
  const fdata = filterTableData.value
  if (!fdata) return []
  return fdata.slice(pageSize.value * page.value - pageSize.value, pageSize.value * page.value)
})

const sortData = ({column, prop, order}) => {
  userData.value.sort(compareFunc(prop,order))
}

const compareFunc = (propertyName, sort) => {
  return function (obj1, obj2) {
    var value1 = obj1[propertyName]
    var value2 = obj2[propertyName]
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      const res = value1.localeCompare(value2, 'zh')
      return sort === 'ascending' ? res : -res
    } else {
      if (value1 <= value2) {
        return sort === 'ascending' ? -1 : 1
      } else if (value1 > value2) {
        return sort === 'ascending' ? 1 : -1
      }
    }
  }
}
// function
async function searchData(){
  loading.value = true

  axiosApi
    .get('api/game/online-player', { params: { serverId: uiServerId.value } })
    .then((res)=> {
      const data = res.data
      userData.value = JSON.parse(data.data)
      userData.value.forEach((e, i, a) => {
        a[i].playerLevel = parseInt(e.playerLevel)
        a[i].vipLevel = parseInt(e.vipLevel)
        a[i].arenaRank = parseInt(e.arenaRank)
      });
      dataLength.value = userData.value.length
    })
    .catch((error)=>{
        userData.value = null
        ElMessage.error(error.toLocaleString())
    })
    .finally(()=> {
        loading.value = false
    })
}
onMounted((x) => {
  //searchData()
})
</script>

<style>
</style>
