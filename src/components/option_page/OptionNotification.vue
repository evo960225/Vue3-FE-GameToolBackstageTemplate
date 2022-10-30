<template>
  <el-container direction="vertical">

    <el-tabs v-model="activeTab">
      <!-- #region user -->
      <el-tab-pane label="全域推播" name="t1">
        <div class="m-4 p-3 shadow-md relative">
          <el-input v-model="inputTitle" placeholder="標題" class="my-1"></el-input>
          <el-input v-model="inputContent" type="textarea" placeholder="內容" 
                    :rows="4" maxlength="200" show-word-limit
                    class="my-1">
          </el-input>
          <el-button class="my-1" @click="push">推送</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const activeTab = ref('t1')
const inputTitle = ref('')
const inputContent = ref('')
const push = () => {
  ElMessageBox.confirm(
    '確定要推送訊息?',
    '注意',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'info',
    }
  )
  .then(() => {
    ElMessage({
      type: 'success',
      message: '推送成功',
    })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消推送',
    })
  })
}
</script>

<style>
</style>
