<template>
  <div class="m-2 w-full">
    <!---- search panel ---->
    <el-card class="flex flex-row space-y-6 px-3 py-2">
      <el-form>
        <el-form-item label="搜尋方式：">
          <el-radio-group v-model="searchType">
            <el-radio label="group">群組</el-radio>
            <el-radio label="startDate">開始日期</el-radio>
            <el-radio label="endDate">結束日期</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- type select -->
        <div v-if="searchType==='group'">
          <el-form-item label="群組搜尋：" size="small">
            <el-input-number
              v-model="groupNum"
              size="small"
              controls-position="right"
              class="my-auto"
            />
          </el-form-item>
        </div>
        <div v-if="searchType==='startDate'">
          <el-form-item label="開始日期：">
            <el-date-picker 
              v-model="startDate"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="searchType==='endDate'">
          <el-form-item label="結束日期：">
            <el-date-picker 
              v-model="endDate"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- /type select -->

        <el-form-item label="序號是否被使用：">
          <el-radio-group v-model="isSerialUsed">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="text-left">
          <el-button>送出</el-button>
        </div>
       </el-form>
    </el-card>

    <!---- data table ---->
    <el-card class="mt-6 px-1 py-2 shadow-lg relative">
      <div class="mb-4">
        <el-button>清除序號</el-button>
      </div>
      <el-table 
        ref="multipleTableRef" 
        :data="serialCodeList" 
        @selection-change="handleSelectionChange"
        stripe border class="w-full">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="序號" label="序號" />
        <el-table-column prop="群組" label="群組" />
        <el-table-column prop="序號開始啟用時間(營運時區 in GameDefine)" label="序號開始啟用時間(營運時區 in GameDefine)" />
        <el-table-column prop="序號結束時間(營運時區 in GameDefine)" label="序號結束時間(營運時區 in GameDefine)" />
        <el-table-column prop="說明備註" label="說明備註" />
        <el-table-column prop="全域變數" label="全域變數" />
        <el-table-column prop="得到禮包編號" label="得到禮包編號" />
        <el-table-column prop="有無被使用過?" label="有無被使用過?" />
        <el-table-column prop="使用玩家" label="使用玩家" />
      </el-table>
   </el-card>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import  serialCodeList  from '../fill_data/serialCodeList'

// Data Form
const searchType = ref('group')
const isSerialUsed = ref()
const groupNum = ref()
const startDate = ref()
const endDate = ref()

// Data Table
const multipleTableRef = ref()
const multipleSelection = ref()
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

</script>

<style scoped>

</style>
