<template>
<div class="w-full">
  <div class="w-full pt-3" v-if="showCreateView" >
    <el-card header="新增帳戶" class="m-4 w-1/2 min-w-[400px] mx-auto" v-loading="loading">
      <div>
        <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
          <el-form-item prop="name" label="用戶名稱">
            <el-input 
              v-model="formData.name"
              placeholder="" type="text" ></el-input>
          </el-form-item>
          <el-form-item prop="email" label="e-mail">
            <el-input 
              v-model="formData.email"
              placeholder="" type="email"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密碼" >
            <el-input 
              v-model="formData.password"
              placeholder="" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="password_confirmation" label="再次輸入密碼" >
            <el-input 
              v-model="formData.password_confirmation"
              placeholder="" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="role_id" label="權限：">
            <el-radio-group v-model="formData.role_id">
                <el-radio v-for="it in abilityList" :key="it.role_id" :label="it.role_id">{{ it.ch_name }}</el-radio>
            </el-radio-group>
            <el-button class="float-right" type="success" @click="accountCreate">建立</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
  <AccountCreateOK ref="uiOk" ></AccountCreateOK>
  
</div>
</template>

<script setup>

import { defineComponent, ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import axiosApi from '../../js/axiosApi'
import AccountCreateOK from './AccountCreateOK.vue'
import { useRouter } from 'vue-router' // import router
const router = useRouter()

// data input
const abilityList =  ref()
const formData = reactive({
  name: null,
  email: '',
  password: '',
  password_confirmation: '',
  role_id: ''
})
const form = ref()
const formRules = {
  name: [
    {
      required: true,
      message: '需要輸入該欄位',
      trigger: 'blur',
    }
  ],
  email: [
    {
      required: true,
      message: '需要輸入該欄位',
      trigger: 'blur',
    }
  ],
  password: [
    {
      required: true,
      message: '需要輸入該欄位',
      trigger: 'blur',
    }
  ],
  password_confirmation: [
    {
      required: true,
      message: '需要輸入該欄位',
      trigger: 'blur',
    }
  ],
  role_id: [
    {
      required: true,
      message: '必須選擇權限',
      trigger: 'blur',
    }
  ],
}

// ui state
const loading = ref(true)
const uiOk = ref()
const showCreateView = ref(true)




axiosApi
  .get('/api/role')
  .then((res) => {
    abilityList.value = res.data.roles
  }).catch(e => {
    ElMessage('找不到資料！')
  }).finally(e => loading.value = false)


// Event
const accountCreate = () => {
  form.value.validate((valid) => {
    if (!valid) {
      ElMessage('部分資料未填寫！')
      return false
    }
    const parm = formData
    axiosApi
      .post('/api/register', parm)
      .then((res) => {
        ElMessage('新增成功')
        showCreatedUser(res.data)
      })
      .catch(e => {
        console.log(e.response.data);
        if(e.name === 'Type Error') {
          ElMessage('顯示錯誤')
        }
        else if (e.response.data.email){
          ElMessage('該信箱已被註冊')
        } 
        else {
          ElMessage('建立失敗')
        }
      })
  })
}
// Method
const showCreatedUser = (userData) => {
  showCreateView.value = false
  uiOk.value.user = userData
  uiOk.value.goBackEvent = createAgain
}
const createAgain = (userData) => {
  router.go(0)
}

</script>

<style>
</style>
