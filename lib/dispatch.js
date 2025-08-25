var lodash = require('lodash')

var literal = require('./literal.js')
var piper = require('./piper.js')
var resolve = require('./resolve.js')

function parseArg(x) {
  if (!x.includes('=')) {
    return dispatch(x)
  }
  var [k, v] = x.split('=').map((s) => s.trim())
  var path =
    k.startsWith('$') && v.startsWith('$')
      ? [
          {
            kind: 'var',
            path: lodash.toPath(k.slice(1)),
          },
        ]
      : lodash.toPath(k.replace(/^\$/, ''))
  return {
    kind: 'assign',
    path,
    value: dispatch(v),
  }
}

function dispatch(raw) {
  if (typeof raw != 'string' || !raw.includes('|>')) {
    return literal(raw) || resolve(raw, dispatch)
  }

  var parsed = piper(raw)
  var base = dispatch(parsed.head)
  base.pipes = []

  for (var i = 0; i < parsed.pipes.length; i++) {
    var { name, argsRaw } = parsed.pipes[i]

    var args = []

    if (argsRaw.length === 1 && argsRaw[0].includes(',')) {
      var splitArgs = argsRaw[0].split(',')
      var data = []
      for (var j = 0; j < splitArgs.length; j++) {
        data.push(parseArg(splitArgs[j]))
      }
      args = [{ kind: 'literal', data }]
    } else {
      for (var j = 0; j < argsRaw.length; j++) {
        args.push(parseArg(argsRaw[j]))
      }
    }

    base.pipes.push({ name, args })
  }

  return base
}

module.exports = dispatch
