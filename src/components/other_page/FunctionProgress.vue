<template>
<div class="w-full">


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

const loading = ref(false)
const roleList =  ref()
const treeRef = ref()
const role = ref()


// Event


const customNodeClass = (data, node) => {
  if (data.id < 10) {
    return 'is-main-item'
  }
  return null
}

// Method


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
