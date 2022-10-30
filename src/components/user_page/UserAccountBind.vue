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
      <el-tab-pane label="帳號綁定" name="account">
        <div class="m-4 shadow-md relative">
          <el-table :data="bindData"
            stripe border>
            <el-table-column prop="OpenIDType" label="綁定平台" width="180" />
            <el-table-column prop="OpenID" label="綁定ID" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button v-if="scope.row.OpenID!='N/A' && scope.row.OpenIDType.includes('ID')" 
                           type="text" @click.prevent="showUnbind">解除綁定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script setup>
import SearchUserVue from '../search_ui/SearchUser.vue';
import { defineComponent, ref, reactive } from 'vue'
import bindData from '../fill_data/bindData';
import { ElMessageBox, ElMessage } from 'element-plus';

const activeTab = ref('account')
function showUnbind() {
  ElMessageBox.confirm(
        '你確定要解除綁定嗎?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '已解除綁定',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消解除綁定',
        })
      })
  }
</script>

<style>
</style>
