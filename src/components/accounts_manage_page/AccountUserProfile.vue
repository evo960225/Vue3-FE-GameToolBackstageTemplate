<template>
  <div class="m-auto w-full p-3">
    <el-card header="個人檔案" v-loading="loading"
      class="m-auto min-w-[300px] max-w-[600px]">
      <div class="m-3 space-y-4">
        <el-button type="danger" size="large" class="pc:float-right" @click="showResetPwd=true">重設密碼</el-button>
        <div class="">
          <line>
            <div class="w-24 mr-1">名稱：</div>
            <div v-if="!isEditing">
              <span>{{ user && user.name }}</span>
              <el-link :underline="false" type="primary" @click="isEditing=true">
                <font-awesome-icon :icon="['fas', 'edit']" size="md" class="ml-2" />
              </el-link>
            </div>
            <div v-if="isEditing" class="flex">
              <el-input v-model="uiName" type="mini" />
              <el-link :underline="false" type="danger" @click="updateUser">
                <font-awesome-icon :icon="['fas', 'check']" size="lg" class="ml-2" />
              </el-link>
              <el-link :underline="false" type="warning" @click="isEditing=false">
                <font-awesome-icon :icon="['fas', 'times']" size="lg" class="ml-2" />
              </el-link>
            </div>
          </line>
        </div>
        <line>
          <div class="w-24 mr-1">Email：</div>
          <span>{{ user && user.email }}</span>
        </line>
        <line>
          <div class="w-24 mr-1">權限：</div>
          <span>{{ user && user.role }}</span>
        </line>
        <line>
          <div class="w-24 mr-1">建立日期：</div>
          <span>{{ user && user.createDate }}</span>
        </line>
      </div>


      <div class="mt-12 border-t border-gray-100">
        <div class="flex m-3 mt-4">
            <el-checkbox @change="change2faQrcode"
              v-model="fa2" size="medium" label="啟用二階段認證" />
        </div>

        <!-- QR code -->
        <div v-if="fa2Qrcode" class="flex flex-col opacity-70">
          <div class="m-auto" v-html="fa2Qrcode"></div>
          <div class="m-auto color-red-500">警告：請下載使用Authenticator掃描QRCode，以便下次登入</div>
        </div>
      </div>
      
    </el-card>

    <!------ dialog ------>
    <el-dialog v-model="showResetPwd" title="重新設定密碼">
      <el-form ref="form" :model="resetPwd" label-width="150px">
          <el-form-item prop="old_password" label="請輸入當前密碼" required>
            <el-input 
              v-model="resetPwd.old_password"
              placeholder="" type="password" ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="請輸入新密碼" required>
            <el-input 
              v-model="resetPwd.password"
              placeholder="" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="password_confirmation" label="再次輸入新前密碼" required>
            <el-input 
              v-model="resetPwd.password_confirmation"
              placeholder="" type="password"></el-input>
          </el-form-item>
        </el-form>
     
      <template #footer>
        <span class="dialog-footer">
          <el-button 
             @click="showResetPwd=false">取消</el-button>
          <el-button type="danger" @click="submitResetData">確認</el-button>
        </span>
      </template>
    </el-dialog>
  </div>



</template>

<script setup>
import SearchUserVue from '../search_ui/SearchUser.vue';
import { defineComponent, ref, reactive, toRef, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import axiosApi from '../../js/axiosApi'

const loading = ref(true)
const user = reactive({
  id:'',
  name:'',
  email:'',
  role:'',
  createDate:'',
  fa2_enable: false
})
const isEditing = ref(false)
const uiName = toRef(user, 'name')
const fa2 = toRef(user, 'fa2_enable')
const fa2Qrcode = ref()

const showResetPwd = ref(false)
const resetPwd = reactive({
  old_password: '',
  password: '',
  password_confirmation: ''
})

// Loading
loading.value = true
axiosApi
  .get('/api/me')
  .then((res) => {
    asyncUserData(res.data)
  })
  .catch(e => {
    ElMessage('找不到資料！')
  })
  .finally(e => loading.value = false)
axiosApi
  .get('/api/get-2fa-qr')
  .then((res) => {
    fa2Qrcode.value = res.data.qrcode;
  })

// Event
const updateUser = () => {
  loading.value = true
  const parm = user;
  axiosApi
    .patch('/api/me', parm)
    .then((res) => {
      asyncUserData(res.data)
      ElMessage({type:'success', message:'更新成功'})
    })
    .catch(e => {
      ElMessage('更新失敗')
    }).
    finally(e => { 
      loading.value = false
      isEditing.value = false
    })
}
const change2faQrcode = () => {
  if(fa2.value) {
    enable2faQrcode()
  } else {
    disable2faQrcode()
  }
}
const enable2faQrcode = () => {
  loading.value = true
  axiosApi
    .post('/api/enable-2fa')
    .then((res) => {
      fa2Qrcode.value = res.data.qrcode;
      ElMessage({type:'success', message:'更新成功'})
      ElMessageBox({
        title:'警告',
        message: '請下載使用Authenticator掃描QRCode，以便下次登入 Code，以便下次登入。假如您想重啟認證，需重新掃描QR Code來更新憑證！',
        type: 'warning'
      })
    })
    .catch(e => {
      ElMessage('更新失敗')
    })
    .finally(e => { 
      loading.value = false
    })
}
const disable2faQrcode = () => {
  loading.value = true
  axiosApi
    .post('/api/disable-2fa')
    .then((res) => {
      fa2Qrcode.value = null;
    })
    .catch(e => {
      ElMessage('更新失敗')
    })
    .finally(e => { 
      loading.value = false
      isEditing.value = false
    })
}

const submitResetData = () => {
  const parm = resetPwd
  loading.value = true
  axiosApi
    .patch('/api/reset-password', parm)
    .then((res) => {
      ElMessage({type:'success', message:'密碼更新成功！'})
    })
    .catch(e => {
      ElMessage('密碼更新失敗！')
    })
    .finally(e => { 
      loading.value = false
      showResetPwd.value = false
    })
}

// Method
function asyncUserData(resData) {
  user.id = resData.id
  user.name = resData.name
  user.email = resData.email
  user.role = resData.role.ch_name
  user.createDate = (new Date(resData.created_at)).toLocaleDateString()
  user.fa2_enable = resData.g2fa_enable === 1
}


</script>

<style scoped>
line { 
  color: var(--el-input-font-color,var(--el-text-color-regular));
  @apply flex pl-1 pb-1 border-dashed border-b border-rose-200 pc:w-[75%]
    xs:text-sm;
}
</style>
