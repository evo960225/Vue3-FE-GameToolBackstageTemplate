<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <div class="space-x-4 space-y-3 mb-4" >
      <el-button class="self-flex w-18">查詢</el-button>
    </div>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="商店紀錄" name="t1">
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData"
            stripe border show-summary>
            <el-table-column prop="goodsguid" label="ID" />
            <el-table-column prop="goodsname" label="品名" />
            <el-table-column prop="buytime" label="購買次數" />
            <el-table-column prop="costcount" label="消費額" />
            <el-table-column prop="detail" label="明細">
              <template #default="scope">
                <el-link type="primary" @click="showDetail(scope.row.detail)">
                  <font-awesome-icon :icon="['fas', 'search-plus']" class="mr-3" />
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="filterTableData.length" 
            @current-change="set_page"></el-pagination>
        </div>

        <!---- 明細列表 ---->
        <el-dialog v-model="dialogVisible" width="800px">
          <el-table :data="gridData" >
            <el-table-column property="Id" label="ID" width="130"></el-table-column>
            <el-table-column property="DisplayName" label="買家"  width="180"></el-table-column>
            <el-table-column property="Buytime" label="次數" width="80" sortable></el-table-column>
            <el-table-column property="Cost" label="金額" width="120" sortables></el-table-column>
            <el-table-column property="Time" label="時間" width="300"></el-table-column>
          </el-table>
          <el-button 
            class="block mx-auto mt-3"
            @click="dialogVisible=false">OK</el-button>
        </el-dialog>

      </el-tab-pane>

    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import mallData from '../fill_data/mallData'

const maxPageItem = 30
const page = ref(1)
const activeTab = ref('t1')

mallData.forEach((x) => {
  console.log(x.detail);
  x.costcount = x.detail.map(x => x.Cost).reduce((a, b) => {
    return a + b
  })
})

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return mallData
})
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})



const dialogVisible = ref(false)
const gridData = ref()
function showDetail(val){
  gridData.value = val
  dialogVisible.value = true
}
</script>

<style>
</style>
