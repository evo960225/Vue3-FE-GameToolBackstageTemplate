<script setup>

import MainPage from './components/MainPage.vue';

</script>

<template>
  <div class="game_backstage">
    <router-view />
  </div>
</template>

<style>
label {
  color: var(--el-input-font-color,var(--el-text-color-regular));
}

</style>