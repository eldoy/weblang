const _ = require('lodash')
const yaml = require('js-yaml')
const { cuid, transform, dot, undot, clean } = require('extras')
const { validate } = require('d8a')
const ext = require('./lib/ext.js')
const pipes = require('./lib/pipes.js')
const renderers = require('./lib/renderers.js')

const regexp = {
  id: /#([a-z0-9]{24})/,
  renderer: /^```(\w+)?\s(.*)\s```$/s,
  identifier: /^\s*[=@].*?:/gm
}

// Convert yaml string to javascript object
function compile(code) {
  if (!code) return ''
  if (typeof code != 'string') return code

  // Replace tabs with spaces
  code = code.replace(/\t/g, '  ')

  // Add identifier to each variable and keyword node
  // Avoids duplicate key errors when re-using keys
  code = code.replace(regexp.identifier, (m) => {
    const keys = m.slice(0, -1).split('.')
    keys[0] += `#${cuid()}`
    return keys.join('.') + ':'
  })

  return yaml.load(code, { json: true })
}

// Set state value
function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  const dotted = dot({ [key]: _.cloneDeep(val) })
  for (const k in dotted) {
    _.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}

// Get state value
function get(val, state) {
  if (val[0] == '$') {
    const name = val.slice(1)
    val = val[1] == '$' ? name : _.get(state.vars, name)
  }
  return val
}

// Check if object validates
async function ok(val, state) {
  for (const field in val) {
    const obj = val[field]
    const checks = get(field, state)
    if (checks && (await validate(obj, checks))) {
      return false
    }
  }
  return true
}

// Extract key, name and id
function parse(str) {
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
function renderer(str) {
  if (str.startsWith('```') && str.endsWith('```')) {
    const match = str.match(regexp.renderer)
    if (match) {
      return [match[1] || '', match[2] || '']
    }
  }
  return []
}

// Apply pipes
async function piper(val, pipes, state, config, args) {
  for (const pipe of pipes) {
    const [lang, body] = renderer(pipe)

    if (body) {
      if (lang) {
        const renderer = config.renderers[lang]
        if (typeof renderer == 'function') {
          val = await renderer({ ...args, lang, body, val })
        }
      } else {
        val = body
      }
    } else {
      let [name, ...options] = pipe.split(' ').map((x) => x.trim())

      const params = {}
      for (const config of options) {
        let [key, val] = config.split('=')
        val = get(val, state)
        params[key] = val
      }

      const fn = (config.pipes || {})[name]
      if (typeof fn == 'function') {
        val = await fn({ ...args, params, val })
      }
    }
  }
  return val
}

// Recursive builder
async function build(obj, state, config, args) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] == 'object') {
      await build(obj[key], state, config, args)
    } else if (typeof obj[key] == 'string') {
      let [val, ...pipes] = obj[key].split('|').map((x) => x.trim())

      val = get(val, state)
      val = await piper(val, pipes, state, config, args)
      val = transform(val)

      // Remove undefined
      if (typeof val == 'undefined') {
        delete obj[key]
      } else {
        obj[key] = val
      }
    }
  }
}

// Expand dot and initiate build
async function expand(obj = {}, state = {}, config = {}, args = {}) {
  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]
  if (_.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }
  await build(obj, state, config, args)

  return wasString ? obj[0] : obj
}

// Execute code
async function execute(code, config, state) {
  const tree = compile(code)

  async function run(branch) {
    for (const node in branch) {
      if (typeof state.return != 'undefined') break

      let [key, ext, id] = parse(node)
      let current = branch[node]
      const args = {
        state,
        code,
        tree,
        branch,
        node,
        current,
        key,
        id,
        run,
        config,
        expand,
        compile,
        get: function (key) {
          return get(key, state)
        },
        set: function (key, val) {
          return set(key, val, state)
        },
        ok: function (val) {
          return ok(val, state)
        }
      }
      let val = await expand(current, state, config, args)

      const fn = config.ext[ext]
      if (typeof fn == 'function') {
        val = await fn({ ...args, val })
      }

      if (typeof val != 'undefined' && key[0] == '=') {
        set(key, val, state)
      }
    }
  }

  await run(tree)

  return state
}

// Init weblang runner
function init(config = {}) {
  config.pipes = { ...pipes, ...config.pipes }
  config.ext = { ...ext, ...config.ext }
  config.renderers = { ...renderers, ...config.renderers }

  const state = { vars: {} }

  // Add custom vars
  if (config.vars) {
    for (const name in config.vars) {
      state.vars[name] = config.vars[name]
    }
  }

  return {
    run: function (code) {
      return execute(code, config, state)
    }
  }
}

module.exports = {
  compile,
  set,
  get,
  ok,
  parse,
  renderer,
  piper,
  build,
  expand,
  init
}
