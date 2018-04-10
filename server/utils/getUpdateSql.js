module.exports = function (body) {
  var keys = Object.keys(body)
  var str = keys.map(key => {
    return `\`${key}\` = '${body[key].replace(/\'/g, '\\\'')}'`
  }).join(',')
  return str
}