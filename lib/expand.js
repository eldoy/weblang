var matcher = /\\?\$([^\s$]+)/g

function expand(state, value) {
  if (typeof value !== 'string') return value

  return value.replace(matcher, (m, name) => {
    if (m[0] === '\\') return '$' + name
    return state.vars[name] || ''
  })
}

module.exports = expand
