import axios from 'axios'
const { API } = require('src/constance')

const url = `${API}color`

export const save = async (obj) => {
  return await axios.post(url, obj)
}

export const update = async (obj, id) => {
  return await axios.put(`${url}/${id}`, obj)
}

export const clear = async (id) => {
  return await axios.delete(`${url}/${id}`)
}

export const getOne = async (id) => {
  return await axios.get(`${url}/${id}`)
}

export const getAll = async (obj) => {
  return await axios.post(`${url}/all`, obj)
}

export const getParent = async (obj) => {
  return await axios.post(`${url}/get-all`, obj)
}
