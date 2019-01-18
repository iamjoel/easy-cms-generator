export const dictObj = state => {
  var res = {}
  state.dict.forEach(item => {
    res[item.key] = item.value
  })
  return res
}

export const isProjectInited = state => {
  return true
  // return state.projectPath && state.adminInited && state.serverInited
}
