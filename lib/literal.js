var lodash = require('lodash')

function literal(raw) {
  if (raw === null) {
    return { kind: 'literal', data: null }
  }

  if (raw === 'true') {
    return { kind: 'literal', data: true }
  }

  if (raw === 'false') {
    return { kind: 'literal', data: false }
  }

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

  return null
}

module.exports = literal
