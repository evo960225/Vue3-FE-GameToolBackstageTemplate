
import { ElMessage } from "element-plus";
import getServerList from './serverList';


export default async function showPoolMessage(res) {
	const serverList = await getServerList()	
	if(!res.data) {
		ElMessage.error('推送失敗')
	}
	if (!res.data.result) {
		const resList = res.data;
		Object.entries(resList).forEach(([k, v]) => {
			// timeout防止message擠再一起 
			setTimeout(() => {
				if (v.result === 1) {
					ElMessage({
						showClose: true,
						message: serverList[k].name + ': 推送成功',
						duration: 1000 * 30,
						type: 'success',
					})
				} else {
					ElMessage({
						showClose: true,
						message: serverList[k].name + ': ' + v.message,
						duration: 1000 * 30,
						type: 'error',
					})
				}
			}, 1)
		})
	} else {
		const result = res.data.result
		const message = res.data.message
		if (result === 1 || message === 'OK!' || message === 'OK') {
			ElMessage.success('推送成功')
		} else {
			ElMessage.error('推送失敗')
		}
	}
}