const yaml = require('js-yaml')

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
      .map(v => (v && typeof v === 'object') ? clean(v) : v)
      .filter(v => !(v == null))
  } else {
    return Object.entries(obj)
      .map(([k, v]) => [k, v && typeof v === 'object' ? clean(v) : v])
      .reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
  }
}

module.exports = { load, clean }
