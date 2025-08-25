var lodash = require('lodash')

var dispatch = require('./dispatch.js')

function operator(key, value) {
  var val = dispatch(value)

  if (key[0] == '@') {
    return [{ type: 'func', name: key.slice(1), value: val }]
  }

  var [assigns, func] = key.split('@')
  assigns = assigns.replace(/^=/, '')

  if (assigns.includes(',')) {
    var targets = assigns
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    var valuePath = lodash.toPath(String(value).replace(/^\$/, ''))
    var isArray = targets.length > 2

    return targets.map((t, i) => ({
      type: 'assign',
      path: lodash.toPath(t),
      value: {
        kind: 'var',
        path: isArray ? valuePath.concat(i) : valuePath.concat(t),
      },
    }))
  }

  return [
    {
      type: 'assign',
      path: Array.isArray(assigns) ? assigns : lodash.toPath(assigns),
      value: func ? { kind: 'call', name: func, args: val } : val,
    },
  ]
}

module.exports = operator
