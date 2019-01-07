module.exports = {
  success(data={}) {
    return {
      errCode: 0,
      data
    }
  },
  error(error, errCode) {
    return {
      errCode: errCode || 1,
      error
    }
  }
}