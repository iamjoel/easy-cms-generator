module.exports = {
  success(data) {
    return {
      errCode: 0,
      data
    }
  },
  error(error) {
    return {
      errCode: 1,
      error
    }
  }
}