const _ = require('lodash')
const yaml = require('js-yaml')
const { dot, clean } = require('extras')

const regexp = {
  id: /#([a-z0-9]{24})/
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
  console.log(JSON.stringify({ str }))
  const lines = str.split('\n')
  const first = lines[0]

  if (!first.startsWith('```')) return

  const lang = first.slice(3)
  const last = lines[lines.length - 1]
  lines.shift()
  if (last.startsWith('```')) lines.pop()
  const body = lines.join('\n')
  return [lang, body]
}

module.exports = util
