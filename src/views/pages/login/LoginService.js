import { API } from 'src/constance'
import axios from 'axios'

const api = `${API}auth`
export const signin = async (obj) => {
  const url = `${api}/sign-in`
  return await axios.post(url, obj)
}

export const getCurrentUser = async () => {
  return await axios.get(`${API}user/me`)
}
