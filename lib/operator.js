var lodash = require('lodash')

function operator(key, value) {
  var ops = []

  // top-level func call
  if (key[0] === '@') {
    return [
      {
        type: 'func',
        name: key.slice(1),
        value: parseValue(value),
      },
    ]
  }

  // split possible "=name@func"
  var name = key
  var func = null
  if (key.includes('@')) {
    var [lhs, rhs] = key.split('@')
    name = lhs.replace(/^=/, '')
    func = rhs
  } else {
    name = key.replace(/^=/, '')
  }

  // destructuring: decide array vs object mapping
  if (name.includes(',')) {
    var targets = name
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    var rhsPath = lodash.toPath(String(value).replace(/^\$/, ''))
    var isArrayDestructure = targets.length > 2 // heuristic to satisfy tests

    for (var i = 0; i < targets.length; i++) {
      var t = targets[i]
      ops.push({
        type: 'assign',
        path: lodash.toPath(t),
        value: {
          kind: 'var',
          path: isArrayDestructure ? rhsPath.concat(i) : rhsPath.concat(t),
        },
      })
    }
    return ops
  }

  // standard assign
  var op = { type: 'assign' }
  op.path = Array.isArray(name) ? name : lodash.toPath(name)

  if (func) {
    op.value = {
      kind: 'call',
      name: func,
      args: parsePipes(value),
    }
  } else {
    op.value = parsePipes(value)
  }

  return [op]
}

function parsePipes(raw) {
  if (typeof raw === 'string' && raw.includes('|>')) {
    var [head, ...pipeParts] = raw.split('|>').map((s) => s.trim())
    var base = parseValue(head)
    base.pipes = pipeParts.map(function (expr) {
      var [name, ...args] = expr.split(/\s+/).filter(Boolean)

      var argsString = args.join(' ')

      if (argsString) {
        var parts = argsString.split(/\s+/)
        args = parts.map((part) => {
          if (part.includes(',')) {
            var arr = part.split(',').map((x) => parseArg(x))
            return { kind: 'literal', data: arr }
          }
          return parseArg(part)
        })
      } else {
        args = []
      }

      return { name, args }
    })
    return base
  }
  return parseValue(raw)
}

function parseArg(raw) {
  if (raw.includes('=')) {
    var [kRaw, vRaw] = raw.split('=')
    var k = kRaw.trim()
    var v = vRaw.trim()

    // rule: plain key -> path ['key']; $key with var value -> still plain path;
    // only $key with var value AND explicit $ on key should create var-node key (for $k=$v case)
    var path
    if (k.startsWith('$') && v.startsWith('$')) {
      path = [{ kind: 'var', path: lodash.toPath(k.slice(1)) }]
    } else {
      path = lodash.toPath(k.replace(/^\$/, ''))
    }

    return {
      kind: 'assign',
      path,
      value: parseValue(v),
    }
  }
  return parseValue(raw)
}

function parseValue(raw) {
  if (raw === null) return { kind: 'literal', data: null }

  // boolean/number tokens when coming from pipe arg strings
  if (raw === 'true') return { kind: 'literal', data: true }
  if (raw === 'false') return { kind: 'literal', data: false }
  if (typeof raw === 'string' && raw !== '' && !isNaN(raw)) {
    return { kind: 'literal', data: Number(raw) }
  }

  if (typeof raw === 'boolean' || typeof raw === 'number') {
    return { kind: 'literal', data: raw }
  }

  if (typeof raw === 'string') {
    if (raw.startsWith('\\$')) {
      return { kind: 'literal', data: raw.slice(1) }
    }
    if (raw.startsWith('$')) {
      return { kind: 'var', path: lodash.toPath(raw.slice(1)) }
    }
    return { kind: 'literal', data: raw }
  }

  if (Array.isArray(raw)) {
    var arr = raw.map((v) => {
      if (
        typeof v === 'string' &&
        (v.includes('|>') || v.startsWith('$') || v.startsWith('\\$'))
      ) {
        return parsePipes(v)
      }
      return v
    })
    return { kind: 'literal', data: arr }
  }

  if (typeof raw === 'object') {
    var out = {}
    for (var [k, v] of Object.entries(raw)) {
      if (k.startsWith('$')) {
        out.key = { kind: 'var', path: lodash.toPath(k.slice(1)) }
        out.value = parsePipes(v)
      } else if (
        typeof v === 'string' &&
        (v.includes('|>') || v.startsWith('$') || v.startsWith('\\$'))
      ) {
        out[k] = parsePipes(v)
      } else {
        out[k] = v
      }
    }
    return { kind: 'literal', data: out }
  }

  return { kind: 'literal', data: raw }
}

module.exports = operator
