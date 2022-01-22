const yaml = require('js-yaml')
const _ = require('lodash')
const extras = require('extras')

// Convert yaml string to javascript object
function load(code) {
  if (!code) return ''
  code = code.replace(/\t/g, '  ')
  return yaml.load(code, { json: true })
}

// Remove null and undefined from object
function clean(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(v => (v && typeof v == 'object') ? clean(v) : v)
      .filter(v => !(v == null))
  } else {
    return Object.entries(obj)
      .map(([k, v]) => [k, v && typeof v == 'object' ? clean(v) : v])
      .reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
  }
}

// Unpack object with dot notation
function undot(obj, sep = '.') {
  const un = {}
  function walk(obj, str) {
    for (const key in obj) {
      const trail = str ? `${str}${sep}${key}` : key
      if (_.isPlainObject(obj[key])) {
        walk(obj[key], trail)
      } else {
        _.set(un, trail, obj[key])
      }
    }
  }
  walk(obj)
  return un
}

module.exports = { load, clean, undot }
