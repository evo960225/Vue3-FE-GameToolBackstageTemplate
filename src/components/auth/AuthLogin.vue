<template>
<div class="login">
  <div class="h-screen bg-gradient-to-br from-indigo-100 to-pink-100">
    <div class="flex">
      <div class="bg-white shadow-el rounded-lg mx-auto mt-12 px-6 py-3">
        <div class="m-4 space-y-3">
          <h1 class="text-3xl text-red-400 font-bold tracking-010">Game Backstage</h1>
          <h2 class="text-gray-600 mt-6">登入帳號</h2>
          
          <!---- form ---->
          <el-form :model="formData" v-loading="loading" class="w-96 sm:w-full">
            <el-form-item class="my-3">
              <el-input type="email" id="email" placeholder="Email"
                @keyup.enter="login" 
                autocomplete v-model="formData.email" />
            </el-form-item>
            <el-form-item class="my-3">
              <el-input type="password" id="password" placeholder="Password" 
                @keyup.enter="login"
                v-model="formData.password" />
            </el-form-item>
            <el-form-item class="my-3">
              <el-button type="submit" @click="login">登入</el-button>
            </el-form-item>
          </el-form>

          <!---- dialog ---->
          <el-dialog v-model="show2FA" title="請輸入驗證碼" width="20%">
            <span>請輸入六位數驗證碼</span>
            <el-input v-model="twoFAcode" type="number" 
              @input="twoFaCodeLengthLimit" @keyup.enter="twoFaCodeLogin"/>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="twoFaCodeLogin">確認</el-button>
              </span>
            </template>
          </el-dialog>

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, toRef, inject } from 'vue'
import axiosApi from '../../js/axiosApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router' // import router


const loading = ref(false)
const show2FA = ref(false)

// data
const formData = reactive({
  'email': '',
  'password': '',
  'google2fa': '',
  'recaptcha': '',
})
const twoFAcode = toRef(formData, 'google2fa')
const reCaptchaToken = toRef(formData, 'recaptcha')

// verify reCaptcha
/* 停用
const reCaptchaSiteKey = '6Lf7Zb0dAAAAAKvvUYc9HqeuaWOUrr9CwrBW0ws2';
const scriptTag = document.createElement("script");
const loadRecaptcha = onMounted(() => {
  if (document.getElementById('recaptcha')) return;
  scriptTag.id = 'recaptcha'
  scriptTag.src = "https://www.google.com/recaptcha/api.js?render=" + reCaptchaSiteKey;
  document.getElementsByTagName('head')[0].appendChild(scriptTag);
})
*/

// sign in
const router = useRouter() 
const login = () => { 
  //grecaptcha.ready(function() {
  //  grecaptcha
  //    .execute(reCaptchaSiteKey, {action: 'submit'})
  //    .then((token) => {
        loading.value = true
        //reCaptchaToken.value = token

        axiosApi
          .get('/sanctum/csrf-cookie')
          .then(res => {

            axiosApi
              .post('/login', formData)
              .then((res) => {
                if(res.data['2fa_reqire']){
                  show2FA.value = true
                } else {
                  // 取得登入訪問Token
                  localStorage.setItem('token', res.data.token)
                  // 隱藏grecaptcha圖示
                  // document.querySelector('.grecaptcha-badge').style += 'visibility: hidden;'
                  ElMessage({ message: '登入成功', type: 'success',})
                  router.go(0)
                }
              })
              .catch((e)=>{
                if(twoFAcode.value){
                  ElMessage({ message: '驗證碼錯誤！', type: 'error',})
                }
                else {
                  ElMessage({ message: '請確認帳號、密碼是否錯誤！', type: 'error',})
                }
              })   
              .finally(()=>{
                twoFAcode.value = ''
                loading.value = false
              })

          })
          .catch((e)=>{
              ElMessage({ message: e.message, type: 'error',})
              loading.value = false
          })
  //  })
  //})
}
const twoFaCodeLogin = () => { 
  show2FA.value = false 
  login()
}

// 限制驗證碼字數
const twoFaCodeLengthLimit = (val,b) => {
  if(val.length > 6) {
    twoFAcode.value = val.slice(0,6)
  }
}

</script>

<style>
.el-input__inner::-webkit-outer-spin-button,
.el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.el-input__inner[type=number] {
  -moz-appearance: textfield;
}
</style>
