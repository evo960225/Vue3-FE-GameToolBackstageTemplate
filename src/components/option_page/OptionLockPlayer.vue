<template>
  <el-container direction="vertical">
      <div class="">

        <!---- lock player ---->
        <el-card header="鎖定玩家" class="m-3 w-1/2">
          <div class="space-y-4">
            <SearchUser></SearchUser>
            <SearchDateScope></SearchDateScope>
          </div> 
        </el-card>

        <!---- message-content ---->
        <el-card class="m-3 w-1/2">
          <div class="space-y-2">
            <el-input type="text" placeholder="封鎖訊息標題" />
            <el-input
              v-model="textarea"
              :rows="5"
              type="textarea"
              placeholder="訊息內文"
            />
            <el-input type="text" v-model="memo" placeholder="備註" />
            <el-input type="password" v-model="password" placeholder="執行人密碼" />
            <el-button>送出</el-button>
          </div>
        </el-card>
      </div>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import SearchUser from '../search_ui/SearchUser.vue';
import SearchDateScope from '../search_ui/SearchDateScope.vue';

const isScheduling = ref('false')
const memo = ref()
const password = ref()
const textarea = ref()
</script>

<style>
</style>
