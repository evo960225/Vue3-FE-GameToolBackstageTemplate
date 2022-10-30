<template>
  <el-container direction="vertical">
    <el-card class="m-4">
      <el-tabs v-model="activeTab">
        <!-- #region user -->
        <el-tab-pane label="全服信件" name="t1">
          <div class="flex justify-between">
            <SearchDateScope></SearchDateScope>
            <el-button type="button">搜尋</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="排程中的信件" name="t2">
          <el-button type="button">搜尋</el-button>
        </el-tab-pane>
        <el-tab-pane label="特定玩家" name="t3">
          <div class="flex">
            <el-input placeholder="Suppert Code" width="150"></el-input>
            <el-button type="button">搜尋</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="m-4">
      <el-table
        :data="serverMail" border stripe>
        <el-table-column prop="寄送信件時間戳記" label="寄送信件時間戳記"></el-table-column>
        <el-table-column prop="寄送信件時間" label="寄送信件時間"></el-table-column>
        <el-table-column prop="在指定日期前創立之玩家帳號" label="在指定日期前創立之玩家帳號"></el-table-column>
        <el-table-column prop="寄送給指定玩家們" label="寄送給指定玩家們"></el-table-column>
        <el-table-column prop="刪除信件時間" label="刪除信件時間"></el-table-column>
        <el-table-column prop="信件標題" label="信件標題"></el-table-column>
        <el-table-column prop="信件內容" label="信件內容"></el-table-column>
        <el-table-column prop="禮包編號" label="禮包編號"></el-table-column>
        <el-table-column prop="WhoSend" label="WhoSend"></el-table-column>
        <el-table-column prop="Memo" label="Memo"></el-table-column>
      </el-table>
    </el-card>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import serverMail from '../fill_data/serverMail';
import SearchDateScope from '../search_ui/SearchDateScope.vue';
const activeTab = ref('t1')

</script>

<style>
</style>
