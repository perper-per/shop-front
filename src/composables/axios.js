import axios from 'axios'
import { useUserStore } from '@/stores/user'

// baseURL = http://localhost:4000
// axios.post('/user')
// axios.post('/user/login')
// ===============
// baseURL = x
// axios.post('http://localhost:4000/user')
// axios.post('http://localhost:4000/user/login')

// + 建立 axios實例
// >不用身分驗證的 api，公開 api
const api = axios.create({
  baseURL: import.meta.env.VITE_API,
})

// + 建立
// >要身分驗證 (需要JWT) 的 api(Auth)
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API,
})

// + 設定axios 攔截器
// 1. axios.get() / axios.post()
// 2. interceptors.request(請求設定 => {})
// 3. 送出
// 4. interceptors.response(成功處理, 失敗處理)
// 5. await / .then().catch()
apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})


apiAuth.interceptors.response.use(res => res, async error => {
  // >判斷失敗有沒有收到回應
  // 沒收到回應時可能是網路問題
  // 有收到才需要處理
  if (error.response) {
    // 如果錯誤是登入過期（token 過期）
    if (
      error.response.data.message === 'userTokenExpired' &&
      error.config.url !== '/user/refresh'
    ) {
      const user = useUserStore()
      try {
        // >如果舊 token 換新 token 成功，發送請求
        const { data } = await apiAuth.patch('/user/refresh')
        // >更新 store 的 token
        user.token = data.result
        // >修改發生錯誤的請求設定，換成新的 token
        error.config.headers.Authorization = 'Bearer ' + user.token
        // >用新的設定重新發送原本的請求
        return axios(error.config)
      } catch (error) {
        console.log(error)
        // >如果換新 token 失敗，登出用戶
        user.logout()
      }
    }
  }
  // >（舊換新失敗也是）直接回傳錯誤
  return Promise.reject(error)
})

// +提供一個 useAxios 方法，讓其他地方可以使用這兩個 Axios 實例
export const useAxios = () => {
  return { api, apiAuth }
}
