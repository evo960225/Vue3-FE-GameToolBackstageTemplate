<template>
  <el-container direction="vertical">
      <div class="">

        <!---- search user & item  ---->
        <el-card header="刪除道具" class="m-3 w-1/2">
          <div class="space-y-4">
            <SearchUser></SearchUser>
            <SearchResourceLog></SearchResourceLog>
            <label>數量： </label><el-input-number v-model="deleteCount" :min="1"></el-input-number>
          </div>
          
        </el-card>

        <!---- send content ---->
        <el-card class="m-3 w-1/2">
          <div class="space-y-2">
            <el-input type="text" placeholder="信件標題" />
            <el-input
              v-model="textarea"
              :rows="5"
              type="textarea"
              placeholder="信件內容"
            />
            <el-input type="text" placeholder="備註" />
            <el-input type="password" placeholder="執行人密碼" />
            <el-button>送出</el-button>
          </div>
        </el-card>
      </div>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import SearchDateTime from '../search_ui/SearchDateTime.vue'
import SearchDateTimeScope from '../search_ui/SearchDateTimeScope.vue';
import SearchUser from '../search_ui/SearchUser.vue';
import SearchResourceLog from '../search_ui/SearchResourceLog.vue';

const isScheduling = ref('false')
const selectScope = ref()
const deleteCount = ref(1)
</script>

<style>
</style>
