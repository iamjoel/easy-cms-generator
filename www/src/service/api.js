import axios from 'axios'
import wrapFetchQuery from '@/assets/utils/wrap-fetch-query'
import {SERVER_PREFIX} from '@/setting'


export const fetchList = (key, condition, pager, sort) => {
  var url = wrapFetchQuery(`${SERVER_PREFIX}/${key}/list`, condition, pager, sort)
  return axios.get(url, {
    params: {
    },
  })
}

export const fetchModel = (key, id) => {
  return axios.get(`${SERVER_PREFIX}/${key}/${id}`, {
    params: {
    },
  })
}

export const addModel = (key, data) => {
  var model = Object.assign({}, data)
  delete model.hasChanged
  return axios.put(`${SERVER_PREFIX}/${key}`, model)
}

export const editModel = (key, data) => {
  var model = Object.assign({}, data)
  delete model.hasChanged
  return axios.post(`${SERVER_PREFIX}/${key}/${data.id}`, model)
}

export const deleteModel = (key, id) => {
  return axios.delete(`${SERVER_PREFIX}/${key}/${id}`)
}

export const syncModel = (key, data) => {
  return axios.post(`${SERVER_PREFIX}/config/sync/${key}`)
}

export const syncStauts = (key) => {
  return axios.get(`${SERVER_PREFIX}/sync-status`)
}

