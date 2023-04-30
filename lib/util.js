const _ = require('lodash')
const yaml = require('js-yaml')
const { dot, clean } = require('extras')

const regexp = {
  id: /#([a-z0-9]{24})/,
  renderer: /^```(\w+)?\s(.*)\s```$/s
}

const util = { regexp, yaml }

util.get = function(val, state) {
  if (val[0] == '$') {
    const name = val.slice(1)
    val = val[1] == '$' ? name : _.get(state.vars, name)
  }
  return val
}

util.set = function (key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  const dotted = dot({[key]: _.cloneDeep(val)})
  for (const k in dotted) {
    _.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}

// Extract key, name and id
util.split = function(str) {
  let id = ''
  const match = str.match(regexp.id)
  if (match) {
    str = str.replace(match[0], '')
    id = match[1]
  }
  const [key, ext = ''] = str.trim().split('@')
  return [key, ext, id]
}

// Extract lang and body from renderer pipe
util.renderer = function(str) {
  if (!str.startsWith('```') || !str.endsWith('```')) {
    return []
  }
  const match = str.match(regexp.renderer)
  if (match) {
    return [match[1] || '', match[2] || '']
  }
  return []
}

module.exports = util
