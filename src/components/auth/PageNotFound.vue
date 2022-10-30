<template>
<div class="bg h-screen bg-gray-900">
  <div class="h-screen opacity-90 bg-gradient-to-br from-violet-700 via-fuchsia-800 to-pink-600">
    <div class="flex h-screen">
      <div class="m-auto">
        <div class="text-white text-center mb-12">
          <div class="text-7xl tracking-070 mb-6">
            <font-awesome-icon :icon="['far', 'sad-tear']" class="mr-5" />404
          </div>
          <div class="text-2xl tracking-070 ">PAGE NOT FOUND!</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'


</script>
<style scoped>
.bg{
  background-image: url("../../assets/bg.svg");
  background-size: 55px 55px;
  background-repeat: repeat;
}
</style>