<template>
  <div class="giftbox-modify w-full">

    <!------ Main ------>
    <el-card header="" class="m-3">
      <div class="my-4 ">
        <div>
          
        </div>
        <div class="flex space-x-4">
          <el-button @click="showCreateGiftboxPanel()">新增項目</el-button>
          <div class="flex">
            <label class="w-20">搜尋：</label>
            <el-input placeholder="物品" v-model="searchItemName"></el-input>
          </div>
        </div>
      </div>

      <!-- table -->
      <el-table :data="pageData" stripe border>
        <el-table-column prop="編號(數字單一且唯一)" label="編號" width="100" />
        <el-table-column prop="禮包名稱" label="禮包名稱" width="250" />
        <el-table-column label="物品">
          <template #default="scope">
            {{ scope.row.物品.map((x)=>x.名稱 + ':' + x.數量).join(", &nbsp;") }}
          </template>
        </el-table-column>
        <el-table-column label="詳細" width="70">
          <template #default="scope">
            <el-link type="primary" @click="showDetail(scope.row)">
              <font-awesome-icon :icon="['fas', 'search-plus']" class="mr-3" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <el-pagination 
        layout="prev, pager, next" 
        :page-size="maxPageItem"
        :total="filterTableData.length" 
        @current-change="setPage">
      </el-pagination>

    </el-card>


    <!------ 禮包明細 ------>
    <el-dialog v-model="isDialogVisible" width="800px">
      <div class="m-2 space-y-2">

        <!-- 操作按鈕 -->
        <div class="flex text-right space-x-2">
          <el-button type="info" @click="rowDataAddItem">新增物品</el-button>
          <div v-if="isDialogCreateGiftbox">
            <el-button type="danger" @click="rowDataCreateCommit">
              建立禮包
            </el-button>
          </div>
          <div v-if="!isDialogCreateGiftbox">
            <el-button type="warning" @click="rowDataUpdateCommit">
              上傳更新
            </el-button>
          </div>
        </div>
        <el-input placeholder="禮包名稱" v-model="giftboxEditName"></el-input>  
      </div>
      
      <div class="m-2 shadow-md">
        <el-table :data="giftboxEditData"
          border>

          <!-- 表單.類型 -->
          <el-table-column property="類型" label="類型">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.類型 }}
              </div>
              <div v-if="scope.row.isEditing">
                <el-select 
                  v-model="scope.row.editingData.類型" 
                  size="small"
                >
                  <el-option v-for="it in itemTypeList" 
                          :key="it" :label="it" :value="it">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <!-- 表單.編號 -->
          <el-table-column property="名稱" label="名稱">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.名稱 }}
              </div>
              <div v-if="scope.row.isEditing">
                <div v-if="scope.row.editingData.類型==='一般物品'">
                  <SearchResource
                    size="small"
                    v-model:label="scope.row.editingData.名稱"
                    v-model:value="scope.row.editingData.編號"
                  >
                  </SearchResource>
                </div>
                <div v-if="scope.row.editingData.類型==='角色'">
                  <SearchCharacterList 
                    size="small"
                    v-model:label="scope.row.editingData.名稱"
                    v-model:value="scope.row.editingData.編號"
                  >
                  </SearchCharacterList>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 表單.數量 -->
          <el-table-column property="數量" label="數量" width="140">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.數量 }}
              </div>
              <div v-if="scope.row.isEditing">
                <el-input-number 
                  v-model="scope.row.editingData.數量"
                  controls-position="right" size="small"
                  :min="1" >
                </el-input-number>
              </div>
            </template>
          </el-table-column>

          <!-- 表單.機率 -->
          <el-table-column property="機率" label="機率" width="100">
              <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.機率? scope.row.機率: '' }}
              </div>
              <div v-if="scope.row.isEditing">
                <el-input-number 
                  v-model="scope.row.editingData.機率"
                  controls-position="right" size="small"
                  :min="0">
                </el-input-number>
              </div>
            </template>
          </el-table-column>

          <!-- 表單.限時 -->
          <el-table-column property="限時" label="限時(小時)" width="100">
            <template #default="scope">
              <div v-if="!scope.row.isEditing">
                {{ scope.row.限時? scope.row.限時: '' }}
              </div>
              <div v-if="scope.row.isEditing">
                <el-input-number 
                  v-model="scope.row.editingData.限時"
                  controls-position="right" size="small"
                  :min="0">
                </el-input-number>
              </div>
            </template>
          </el-table-column>

          <!-- 表單.編輯 -->
          <el-table-column label="編輯" width="60">
            <template #default="scope">
              <div v-if="!scope.row.isEditing" class="space-x-2">
                <el-link type="primary" @click="rowDataEdit(scope)">
                  <font-awesome-icon :icon="['fas', 'edit']" class="m-auto" />
                </el-link>
                <el-link type="info" @click="rowDataRemoveItem(scope)">
                  <font-awesome-icon :icon="['fas', 'trash-alt']" class="m-auto" />
                </el-link>
              </div>
              <div v-if="scope.row.isEditing" class="space-x-2">
                <el-link type="success" @click="rowDataEditOk(scope)">
                  <font-awesome-icon :icon="['fas', 'check']" class="m-auto" />
                </el-link>
                <el-link type="info" @click="rowDataEditCancel(scope)">
                  <font-awesome-icon :icon="['fas', 'times']" class="m-auto" />
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import giftboxList from '../fill_data/giftboxList'
import SearchCharacterList from '../search_ui/SearchCharacterList.vue'
import SearchResource from '../search_ui/SearchResource.vue'
import axiosApi from '../../js/axiosApi';



//------------------------------------------------
// 分頁
//------------------------------------------------
const maxPageItem = 20
const page = ref(1)
// function
const setPage = (val) => {
  page.value = val
}
const pageData = computed(() => {
  let fdata = filterTableData.value
  return fdata.slice(maxPageItem * page.value - maxPageItem, maxPageItem * page.value)
})


//------------------------------------------------
// el-dialog 
//------------------------------------------------
const itemTypeList = ref([
  '一般物品',
  '角色'
])
const refItem = ref()
const refCharacter = ref()
const isDialogVisible = ref(false)
const isDialogCreateGiftbox = ref(false)
const giftboxEditName = ref()
const giftboxEditData = ref()
function showDetail(val){
  const cloneData = JSON.parse(JSON.stringify(val.物品))
  giftboxEditData.value = cloneData
  giftboxEditName.value = val.禮包名稱
  isDialogVisible.value = true
  isDialogCreateGiftbox.value = false
}
function showCreateGiftboxPanel(){
  giftboxEditData.value = [{ isEditing: true, editingData: { } }]
  giftboxEditName.value = ''
  isDialogVisible.value = true
  isDialogCreateGiftbox.value = true
}

// function
// -----------------------------------
// rowData
const rowDataCreateCommit = (scope) => {
  ElMessage({
    type: 'warning',
    message: '無法新增禮包！系統未完成~',
  })
}

const rowDataUpdateCommit = (scope) => {
  ElMessage({
    type: 'warning',
    message: '無法更新！系統未完成~',
  })
}

const rowDataEdit = (scope) => {
  giftboxEditData.value[scope.$index].editingData= { ...scope.row }
  giftboxEditData.value[scope.$index].isEditing = true
}

const rowDataEditCancel = (scope) => {
  scope.row.editingData = []
  scope.row.isEditing = false
}

const rowDataEditOk = (scope) => {
  const temp = scope.row.editingData
  // 驗證資料
  if (!(temp.類型 && temp.編號 && temp.數量)){
    ElMessage({ type:'warning', message: '請先填寫[類型],[編號],[數量]欄位後再更新' })
    return
  } 

  // 更新操作
  scope.row.isEditing = false

  giftboxEditData.value.forEach((x, i, a) => {
    
    if (x===scope.row) {
      a[i] = temp
    }
  })
}

const rowDataAddItem = (scope) => {
  giftboxEditData.value.push({
    editingData: {"編號":""},
    isEditing: true
  })
  console.log(giftboxEditData.value);
}

const rowDataRemoveItem = (scope) => {
  giftboxEditData.value = giftboxEditData.value.filter(
    (x) => x!==scope.row
  )
}

//------------------------------------------------
// 過濾資料
// ------------------------------------------------
const searchItemName = ref()
const filterTableData =  computed(() => {
  if (!searchItemName.value) return giftboxList
  const searchLowName = searchItemName.value.toLowerCase()
  return giftboxList.filter(
    (data) => {
      if (data.物品) {
        const isFind = data.物品.find((e) => {
          const lowName = e.名稱.toLowerCase()
          return lowName.includes(searchLowName)
        })
        return isFind
      } 
    }
  )
})

</script>

<!--/////////////////////////////////////////////////////-->

<style>
.giftbox-modify .el-input-number {
  width: 100%;
}
.giftbox-modify .el-input-number--small .el-input-number__decrease,
.giftbox-modify .el-input-number--small .el-input-number__increase {
    width: 28px;
    font-size: 13px;
}
.giftbox-modify .el-input-number.is-controls-right .el-input__inner {
    padding-left: 12px;
    padding-right: 42px;
}
</style>
