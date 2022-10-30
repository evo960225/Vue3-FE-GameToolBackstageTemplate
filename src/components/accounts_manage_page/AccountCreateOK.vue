<template>
  <div class="w-full pt-3" v-if="user">
    <el-card header="帳號已成立" class="m-4 w-1/2 min-w-[400px] mx-auto" v-loading="loading">
      <div class="space-y-4">
        <line>
          <div class="w-24 mr-1">用戶名稱</div>
          <div>{{ user.user.name }}</div>
        </line>
        <line>
          <div class="w-24 mr-1">電子信箱：</div>
          <div>{{ user.user.email }}</div>
        </line>
        <line>
          <div class="w-24 mr-1">權限：</div>
          <div>{{ user.user.role.ch_name }}</div>
        </line>
      </div>
      <div class="mt-6">
        <el-button type="danger" @click="goBackEvent">再次新增使用者</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import SearchUserVue from '../search_ui/SearchUser.vue';
import { defineComponent, ref, reactive } from 'vue'

const user = ref()
const goBackEvent = ref()

defineExpose({ user, goBackEvent })
</script>

<style scoped>
line { 
  color: var(--el-input-font-color,var(--el-text-color-regular));
  @apply flex pl-1 pb-1 border-dashed border-b border-rose-200 w-2/3;
}
</style>

