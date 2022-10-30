<template>
<div class="w-full">

  <!-- roles -->
  <el-card class="m-4 shadow-md w-2/3 min-w-[400px]">
    <div class="flex">
      <el-radio-group v-model="role_id">
        <el-radio v-for="it in roleList" :key="it.role_id" :label="it.role_id">
          {{ it.ch_name }}
        </el-radio>
      </el-radio-group>
      <div class="m-auto mr-0">
        <el-button @click="updatePermission">更新</el-button>
      </div>
    </div>
  </el-card>

  <!-- tree -->
  <el-card class="m-4 w-2/3 min-w-[400px]" v-loading="loading">
    <el-tree
      ref="treeRef"
      :data="menuList"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[1, 2, 3, 4]"
      highlight-current
      :props="{ class: customNodeClass }"
    />
  </el-card>
  

</div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElTree, ElMessage } from 'element-plus'
import axiosApi from '../../js/axiosApi'
import menuList from '../../js/mainMenuList'

const role_id = ref()
const loading = ref(true)
const roleList =  ref()
const treeRef = ref()
const role = ref()

// Loading roles data
Promise.all([
  axiosApi
    .get('/api/role')
    .then((res) => {
      roleList.value = res.data.roles
      console.log(res.data);
    }).catch(e => {
      ElMessage('找不到資料！')
    }).finally(e => {
      
    })
])
.then(function(values) {
  role_id.value = roleList.value[0].role_id
  loading.value = false
});

// UI Event
const updatePermission = () => {
  loading.value = true
  const body = {
    'permissions_id': treeRef.value.getCheckedKeys(false)
  }
  axiosApi
    .put('/api/role/' + role.value.id, body)
    .then((res) => {
      role.value = res.data
      updateTree()
      ElMessage('更新成功！')
    }).catch(e => {
      ElMessage('找不到資料！')
    }).finally(e => {
      loading.value = false
    })
}


watch(role_id, ()=> {
  
  // is admin
  if (role_id.value === 0) {
    treeRef.value.setCheckedNodes(menuList)
    setTreeCheckedDisabled(menuList, true)
    setTreeChecked(menuList)
    return
  }
  setTreeCheckedDisabled(menuList, false)
  const id = roleList.value.find(
    (e) => e.role_id === role_id.value
  ).id

  loading.value = true
  axiosApi
    .get('/api/role/' + id)
    .then((res) => {
      role.value = res.data
      updateTree()
    }).catch(e => {
      ElMessage('找不到資料！')
    }).finally(e => {
      loading.value = false
    })

})

// UI style
const customNodeClass = (data, node) => {
  if (data.id < 10) {
    return 'is-main-item'
  }
  return null
}

// Method
function updateTree() {
  // set tree checked value
  const permissions = role.value.permissions
  treeRef.value.setCheckedKeys([])
  treeRef.value.setCheckedKeys(filterPermissionId(permissions), false)
}

function filterPermissionId(permissions) {
  const ids = permissions.map(e=>e.permission_id);
  return ids;
}

function setTreeChecked(node) {
  const ids = []
  const getAllId = (node) => {
    node.forEach((e,i,a) => {
      if (e.children) {
        getAllId(e.children)
      }
      ids.push(e.id)
    })
  }
  getAllId(node)
  treeRef.value.setCheckedKeys(ids)
}

function setTreeCheckedDisabled(node, val = false) {
  node.forEach((e,i,a) => {
    if (a[i].children) {
      setTreeCheckedDisabled(a[i].children, val)
    }
    a[i].disabled = val;
  })
}
</script>


<style>
.is-main-item {
  padding: 10px 0;
}
.is-main-item:not(:first-child) {
  border-top: 1px solid #EAEAEA;
}
.el-tree-node__content {
  height: 28px;
}
</style>
