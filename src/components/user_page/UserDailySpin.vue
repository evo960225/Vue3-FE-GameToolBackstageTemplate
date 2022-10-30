<template>
  <el-container direction="vertical">
    <!-- #region input -->
    <el-container direction="horizontal" class="my-4">
      <SearchUserVue></SearchUserVue>
      <el-button>查詢</el-button>
    </el-container>
    <!-- #endregion input -->

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="角色升級" name="p1">
        <el-input v-model="search" size="mini" placeholder="搜尋道具" class="m-4 w-36 my-2"/>
        <div class="m-4 shadow-md relative">
          <el-table :data="pageData" stripe border>
            <el-table-column prop="詳細資訊" label="道具名稱" />
            <el-table-column prop="數量" label="數量" sortable/>
            <el-table-column prop="獲取時間" label="獲取時間" sortable />
          </el-table>
          <el-pagination 
            layout="prev, pager, next" 
            :page-size="maxPageItem"
            :total="filterTableData.length" 
            @current-change="set_page"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import SearchUserVue from '../search_ui/SearchUser.vue';
import { defineComponent, ref, reactive, computed } from 'vue'
import dailySpinData from '../fill_data/dailySpinData';
const maxPageItem = 30
const page = ref(1)
const search = ref()
const activeTab = ref('p1')

function set_page(val) {
  page.value = val
}
const filterTableData = computed(() => {
  return dailySpinData.filter(
    (data) =>
      !search.value || data.詳細資訊.toLowerCase().includes(search.value.toLowerCase())
  )
})
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})

</script>

<style>
</style>
