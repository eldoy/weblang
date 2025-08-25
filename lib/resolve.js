var lodash = require('lodash')

function resolve(raw, dispatcher) {
  if (Array.isArray(raw)) {
    return {
      kind: 'literal',
      data: raw.map((v) =>
        typeof v === 'string' &&
        (v.includes('|>') || v.startsWith('$') || v.startsWith('\\$'))
          ? dispatcher(v)
          : v,
      ),
    }
  }

  if (typeof raw !== 'object') {
    return { kind: 'literal', data: raw }
  }

  var data = {}
  for (var [k, v] of Object.entries(raw)) {
    if (k.startsWith('$')) {
      data.key = {
        kind: 'var',
        path: lodash.toPath(k.slice(1)),
      }
      data.value = dispatcher(v)
    } else if (
      typeof v === 'string' &&
      (v.includes('|>') || v.startsWith('$') || v.startsWith('\\$'))
    ) {
      data[k] = dispatcher(v)
    } else {
      data[k] = v
    }
  }

  return { kind: 'literal', data }
}

module.exports = resolve
