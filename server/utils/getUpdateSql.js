module.exports = function (body) {
  var keys = Object.keys(body)
  var str = keys.map(key => {
    if(typeof body[key] !== 'string') {
      body[key] += ''
    }
    return `\`${key}\` = '${body[key].replace(/\'/g, '\\\'')}'`
  }).join(',')
  return str
}