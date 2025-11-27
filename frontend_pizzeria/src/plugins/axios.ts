import Axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/index'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT || 'http://localhost:3000/api',
})

axios.interceptors.request.use((config: any) => {
  const authStore = useAuthStore()
  if (config.headers) {
    config.headers['Content-type'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + authStore.token
  }
  return config
})

export default axios
