import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

const axiosApi = axios.create()
axiosApi.defaults.baseURL = import.meta.env.VITE_API_URL
axiosApi.defaults.withCredentials = true
axiosApi.interceptors.response.use((response) => response, (e) => {
  console.log(e.message, e.message === 'Network Error');
  if (e.response) {
    console.log(e.response);
    if (e.response.status === 401) {
      ElMessage.error('密碼錯誤！')
    } else if (e.response.status === 404) {
      ElMessage.error('找不到伺服器！')
      //setInterval(() => router.go(0), 2000)
    } else if (e.response.status === 419) {
      ElMessage.warning('頁面憑証過期')
      setInterval(() => router.go(0), 2000)
    } else if (e.response.status === 422) {
      ElMessage.warning('指令參數錯誤')
    } else if (e.response.status === 500) {
      ElMessage.error('伺服器錯誤！')
    }
  } else if (e.message === 'Network Error') {
    ElMessage.error('伺服器連線錯誤！')
  }
  throw e
})
export default axiosApi 