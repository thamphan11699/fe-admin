import axios from 'axios'
import { API } from 'src/constance'

const url = `${API}user`

export const getAll = async (obj) => {
  return await axios.post(`${url}/all`, obj)
}

export const getOne = async (id) => {
  return await axios.get(`${url}/${id}`)
}

export const save = async (obj) => {
  return await axios.post(`${url}`, obj)
}

export const clear = async (id) => {
  return await axios.delete(`${url}/${id}`)
}

export const update = async (id, obj) => {
  return await axios.put(`${url}/${id}`, obj)
}

export const getRoles = async () => {
  return await axios.post(`${API}role/all`, { pageSize: 1000, pageIndex: 1 })
}
