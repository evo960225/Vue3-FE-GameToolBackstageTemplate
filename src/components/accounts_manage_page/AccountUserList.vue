<template>

  <el-container direction="horizontal" class="my-4">
    <div class="m-4 shadow-md w-2/3 min-w-[400px]">
      <el-table :data="userList" v-loading="loading"
        stripe border>

        <!-- 成員 -->
        <el-table-column prop="name" label="成員" sortable fixed />

        <!-- 信箱 -->
        <el-table-column prop="email" label="信箱" width="300" />

        <!-- 權限 -->
        <el-table-column prop="role_name" label="權限" width="130" sortable>
          <template #default="scope">
            <div v-if="!scope.row.isEditing">
              {{ scope.row.role_name }}
            </div>
            <div v-if="scope.row.isEditing">
              <el-select v-model="scope.row.editingData.role_id">
                <el-option v-for="it in abilityList" 
                        :key="it.role_id" :label="it.ch_name" :value="it.role_id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>

        <!-- 二階段認證 -->
        <el-table-column prop="g2fa_enable" label="二階段認證" width="120" align="center">
          <template #default="scope">
            <div v-if="scope.row.g2fa_enable">
              <font-awesome-icon :icon="['fas', 'check']" class="mr-3 text-blue-400" />
            </div>
            <div v-if="!scope.row.g2fa_enable">
              <font-awesome-icon :icon="['fas', 'times']" class="mr-3 text-red-500" />
            </div>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="" width="180">
          <template #default="scope">
            <el-button 
              v-if="!scope.row.isEditing" type="primary" size="mini"
              @click="userDataEdit(scope)">修改</el-button>
            <el-button 
              v-if="!scope.row.isEditing" type="danger" size="mini"
              @click="userDataDelete(scope)">刪除</el-button>
            <el-button 
               v-if="scope.row.isEditing" type="danger" size="mini"
              @click="userDataEditUpdate(scope)">儲存</el-button>
            <el-button 
               v-if="scope.row.isEditing" type="warning" size="mini"
              @click="userDataEditCancel(scope)">取消</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </el-container>
</template>

<script setup>
import { defineComponent, ref, reactive, inject } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import axiosApi from '../../js/axiosApi'
import { useRoute } from 'vue-router';

// ref
const loading = ref(true)
const abilityList = ref()
const userList = ref()



// loading
Promise.all([
  axiosApi
    .get('/api/role')
    .then((res) => {
      abilityList.value = res.data.roles
    }).catch(e => {
      ElMessage('找不到資料！')
    })
  ,
  getUserData().catch((e)=>ElMessage(e))
]).finally(() => loading.value = false)




// event
const userDataEdit = (scope) => {
  scope.row.editingData = {...scope.row}
  scope.row.isEditing = true
}
const userDataEditCancel = (scope) => {
  scope.row.editingData = []
  scope.row.isEditing = false
}
const userDataEditUpdate = (scope) => {
  const parm = {
    email: scope.row.editingData.email,
    role_id: scope.row.editingData.role_id,
  }
  axiosApi
    .patch('/api/user-role', parm)
    .then((res) => {
      getUserData().then(()=>ElMessage('更新成功'))
    })
    .catch(e => {
      ElMessage('更新失敗')
    })
}
const userDataDelete = (scope) => {
  const id = scope.row.id
  ElMessageBox.confirm(
    '您確定要刪除帳號嗎?',
    '警告',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
    axiosApi
      .delete('/api/user/' + id)
      .then((res) => {
        getUserData()
        .then(()=>ElMessage({type: 'success', message: '刪除成功'}))
      })
      .catch(e => {
        ElMessage('刪除失敗')
      })
  })
 
}

// method
function getUserData() {
  const fetch = axiosApi
    .get('/api/user')
    .then((res) => {
      userList.value = res.data.users
      userList.value.forEach((e,i,a) => {
        a[i].isEditing = false
        a[i].editingData = []
        a[i].role_name = e.role.ch_name
        a[i].g2fa_enable = e.g2fa_enable
      })
    })
  return fetch
}

</script>


<style>
</style>
