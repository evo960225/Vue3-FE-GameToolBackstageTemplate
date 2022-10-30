<template>
  <el-card class="m-auto my-4 px-10 py-2 md:px-4">
    <div class="text-2xl text-bgray-600 xs:text-lg">
      <span>您好{{ username }}主人公！ </span>
      <span>歡迎來到遊戲後台</span>
    </div>
    <div> </div>
    <div class="mt-4 rounded-lg text-lg text-bgray-500 md:text-base">
      <div class="my-3">
      本場所是範例環境，主要是展示UI及基本邏輯功能。資料有部分是自動產生，有些也是存在於資料庫。
      </div>
      <div class="my-3">
      前端是由Vue3、Element Plus、Tailwind CSS所編寫。<br class="md:hidden"/>
      後端則是Laravel、Mysql、MongoDB Atlas
      </div>
      <div class="my-3">
      有些頁面可能有功能不完全的地方還請見諒！
      </div>
    </div>
    <div class="mt-4 text-xl text-bgray-400"></div>
  </el-card>
  </template>

<script setup>
  import { onBeforeUnmount, ref } from 'vue'

  const username = ref(localStorage.getItem('username'))
  const timeName = ref()
  const hour = new Date().getHours()
  if (5<=hour && hour<=10) {
    timeName.value = "早安"
  } else if (11<=hour && hour<=16) {
    timeName.value = "午安"
  } else {
    timeName.value = "晚安"
  }

</script>