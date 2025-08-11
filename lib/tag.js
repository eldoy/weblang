var matcher = /(\s*)([-]?\s*[=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var occurrence = 1
  var isAsync = false // Track async state for all tags

  return code.replace(matcher, function (_, space, key, colon) {
    // Detect async based on the presence of "-" in the key
    if (key.startsWith('-')) {
      isAsync = true // Set async if "-" is found
    }

    var concurrency = isAsync ? 'a' : 's' // Use 'a' for async, otherwise 's' for sync
    var cleanKey = key.replace(/^\s*-\s*/, '') // Clean leading dash if it's present
    var id = `_ID_${concurrency}-${block}-${number}-${occurrence++}_ID_`

    // Reset async state after each match
    if (!key.startsWith('-')) {
      isAsync = false
    }

    return space + cleanKey + id + colon
  })
}
