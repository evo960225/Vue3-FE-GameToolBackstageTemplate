<template>
  <div class="flex w-full">
    <el-card class="m-2 w-60">
      <el-radio-group v-model="selectedLeaderBoard">
        <el-radio v-for="x in leaderBoardList" :label="x" :key="x">
        </el-radio>
      </el-radio-group>
    </el-card>
    <el-card class="m-2 w-full">
    <!-- table -->
      <el-table 
        :data="pageData" stripe border
        class="w-full">
        <el-table-column prop="rank" label="排名" width="100" />
        <el-table-column prop="id" label="id" width="150" />
        <el-table-column prop="Score" label="分數" width="150" />
        <el-table-column label="" width="70">
          <template #default="scope">
            <el-link type="warning" @click="showDetail(scope.row)">
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-3" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁 -->
      <el-pagination 
        layout="prev, pager, next" 
        :page-size="maxPageItem"
        :total="leaderBoardData.length" 
        @current-change="setPage">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'

const leaderBoardData = ref([
  {
    "rank": 1,
    "id": 4180924316,
    "Score": 623,
    "when": "2022/1/20 14:29"
  },
  {
    "rank": 2,
    "id": 3832957690,
    "Score": 205,
    "when": "2022/1/19 13:58"
  }
])
const leaderBoardList = ref([
  '紅包排行榜',
  '火箭排行榜',
])
const selectedLeaderBoard = ref()

//------------------------------------------------
// 分頁
//------------------------------------------------
const maxPageItem = 20
const page = ref(1)
// function
const setPage = (val) => {
  page.value = val
}
const pageData = computed(() => {
  let fdata = leaderBoardData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})

</script>

<style>
</style>
