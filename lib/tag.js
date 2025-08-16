var matcher = /(\s*)([-]?\s*[=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var count = 1
  var isAsync = false

  return code.replace(matcher, function (_, space, key, colon) {
    if (key.startsWith('-')) {
      isAsync = true
    }

    var flag = isAsync ? 'a' : 's'
    var cleanKey = key.replace(/^\s*-\s*/, '')
    var id = `_ID_${flag}-${block}-${number}-${count++}_ID_`

    if (!key.startsWith('-')) {
      isAsync = false
    }

    return space + cleanKey + id + colon
  })
}
