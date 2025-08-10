var matcher = /(\s*)([=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var occurrence = 1
  return code.replace(matcher, function (_, space, key, colon) {
    var concurrency = 's'
    var id = `_ID_${concurrency}-${block}-${number}-${occurrence++}_ID_`
    return space + key + id + colon
  })
}
