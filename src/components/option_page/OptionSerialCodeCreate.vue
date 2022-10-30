<template>
  <div class="m-2">
    <el-card class="flex flex-row space-y-6 px-3 py-2">
      <row>
        <row-title>序號群組(刪除與查詢用途, 若無群組則為預設0, 建議每次都填)</row-title>
        <field>
          <el-input-number size="small"></el-input-number>
        </field>
      </row>
      <row>
        <row-title>字首字母(英數字,請少於10字)</row-title>
        <field>
          <el-input size="small"></el-input>
        </field>
      </row>
      <row>
        <row-title>自動產生字數(最多8碼)</row-title>
        <field>
          <el-input-number size="small"></el-input-number>
        </field>
      </row>
      <row>
        <row-title>自動產生字數規則</row-title>
        <field>
          <el-radio-group v-model="createRule">
            <el-radio :label="1">全英文</el-radio>
            <el-radio :label="2">全數字</el-radio>
          </el-radio-group>
        </field>
      </row>
      <row>
        <row-title>新增組數</row-title>
        <field>
          <el-input-number size="small"></el-input-number>
        </field>
      </row>
      <row>
        <row-title>全域變數(代表可供多位玩家使用 => 請填0, 若否則填-1)</row-title>
        <field>
          <el-radio-group v-model="globalVariable">
            <el-radio :label="0">0</el-radio>
            <el-radio :label="-1">-1</el-radio>
          </el-radio-group>
        </field>
      </row>
      <row>
        <row-title>使用次數(若為全域變數, 此欄設定此序號可供應多少人領取, 但每個ID限領一次)</row-title>
        <field>
          <el-input-number size="small"></el-input-number>
        </field>
      </row>
      <row>
        <row-title>序號所對應的獎勵禮包</row-title>
        <field>
          <el-input-number size="small"></el-input-number>
        </field>
      </row>
      <row>
        <row-title>序號啟用時間(營運時區 in GameDefine)</row-title>
        <field>
          <el-input size="small"></el-input>
        </field>
      </row>
      <row>
        <row-title>寄送禮包信件的標題</row-title>
        <field>
          <el-input size="small"></el-input>
        </field>
      </row>
      <row>
        <row-title>寄送禮包信件的內文</row-title>
        <field>
          <el-input 
            size="small"
            :rows="4"
            type="textarea">
          </el-input>
        </field>
      </row>
      <row>
        <row-title>說明備註</row-title>
        <field>
          <el-input size="small"></el-input>
        </field>
      </row>
      <div class="text-center w-full mt-4">
        <el-button>送出</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'


</script>

<style scoped>
row {
  @apply flex px-4 py-3 border-b border-red-100 w-full;
}

row-title {
  @apply block my-auto text-gray-600;
  width: 700px;
}

field {
  @apply my-auto w-56;
}

</style>
