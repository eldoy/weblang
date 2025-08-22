var matcher = /\\?\$([a-zA-Z0-9_]+)/g

function expand(state, value) {
  if (value == null) return value

  if (typeof value === 'string') {
    return value.replace(matcher, (m, name) => {
      if (m[0] === '\\') return '$' + name
      return state.vars[name] || ''
    })
  }

  if (Array.isArray(value)) {
    var arr = []
    for (var i = 0; i < value.length; i++) {
      arr.push(expand(state, value[i]))
    }
    return arr
  }

  if (typeof value === 'object') {
    var obj = {}
    for (var k in value) {
      var newKey = k.replace(matcher, (m, name) => {
        if (m[0] === '\\') return '$' + name
        return state.vars[name] || ''
      })
      obj[newKey] = expand(state, value[k])
    }
    return obj
  }

  return value
}

module.exports = expand
