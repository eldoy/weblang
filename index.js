const yaml = require('js-yaml')
const _ = require('lodash')
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
function load(code) {
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

function get(val, state) {
  if (val[0] == '$') {
    const name = val.slice(1)
    val = val[1] == '$' ? name : _.get(state.vars, name)
  }
  return val
}

function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  const dotted = dot({ [key]: _.cloneDeep(val) })
  for (const k in dotted) {
    _.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}

// Extract key, name and id
function split(str) {
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
  if (!str.startsWith('```') || !str.endsWith('```')) {
    return []
  }
  const match = str.match(regexp.renderer)
  if (match) {
    return [match[1] || '', match[2] || '']
  }
  return []
}

function expand(obj = {}, state = {}, opt = {}) {
  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]

  if (_.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }

  function build(obj, state, opt) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] == 'object') {
        build(obj[key], state, opt)
      } else if (typeof obj[key] == 'string') {
        let [val, ...pipes] = obj[key].split('|').map((x) => x.trim())

        val = get(val, state)

        for (const pipe of pipes) {
          const [lang, body] = renderer(pipe)

          if (body) {
            val = body
            if (lang) {
              const renderer = opt.renderers[lang]
              if (typeof renderer == 'function') {
                // TODO: Async + pass args
                val = renderer()
              }
            }
          } else {
            let [name, ...options] = pipe.split(' ').map((x) => x.trim())

            const query = {}
            for (const opt of options) {
              let [key, val] = opt.split('=')
              val = get(val, state)
              query[key] = val
            }

            const fn = (opt.pipes || {})[name]
            if (typeof fn == 'function') {
              val = fn(val, query)
            }
          }
        }

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

  build(obj, state, opt)

  return wasString ? obj[0] : obj
}

module.exports = function (opt = {}) {
  opt.pipes = { ...pipes, ...opt.pipes }
  opt.ext = { ...ext, ...opt.ext }
  opt.renderers = { ...renderers, ...opt.renderers }

  return async function (code, params) {
    const state = {
      vars: {}
    }

    // Add custom vars
    if (opt.vars) {
      for (const name in opt.vars) {
        state.vars[name] = opt.vars[name]
      }
    }

    // Check if object validates
    async function ok(val) {
      for (const field in val) {
        const obj = val[field]
        const checks = get(field, state)
        if (checks && (await validate(obj, checks))) {
          return false
        }
      }
      return true
    }

    const tree = load(code)

    async function run(branch) {
      for (const node in branch) {
        if (typeof state.return != 'undefined') break

        let [key, ext, id] = split(node)
        let leaf = branch[node]
        let val = expand(leaf, state, opt)

        if (ext) {
          const fn = opt.ext[ext]
          if (typeof fn == 'function') {
            const args = {
              state,
              code,
              tree,
              branch,
              node,
              leaf,
              set,
              get,
              val,
              key,
              id,
              run,
              ok,
              opt,
              params,
              expand,
              load
            }
            val = await fn(args)
          }
        }

        if (typeof val != 'undefined' && key[0] == '=') {
          set(key, val, state)
        }
      }
    }

    await run(tree)

    return state
  }
}
