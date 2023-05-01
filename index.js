const _ = require('lodash')
const { transform, undot } = require('extras')
const { validate } = require('d8a')
const load = require('./lib/load.js')
const util = require('./lib/util.js')
const ext = require('./lib/ext.js')
const pipes = require('./lib/pipes.js')
const renderers = require('./lib/renderers.js')

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
        let statement = obj[key]

        let [val, ...pipes] = statement.split('|').map((x) => x.trim())

        let data = {}
        for (const pipe of pipes) {
          const [lang, body] = util.renderer(pipe)

          if (body) {
            data = body
            if (lang) {
              const renderer = opt.renderers[lang]
              if (typeof renderer == 'function') {
                // TODO: Async + pass args
                data = renderer()
              }
            }
          } else {
            let [name, ...options] = pipe.split(' ').map((x) => x.trim())

            const params = {}
            for (const opt of options) {
              let [key, val] = opt.split('=')
              val = util.get(val, state)
              params[key] = val
            }
            data[name] = params
          }
        }
        pipes = data

        val = util.get(val, state)

        if (typeof pipes == 'string') {
          val = pipes
        } else {
          val = transform(val)

          // Apply pipes
          for (const name in pipes) {
            const pipe = (opt.pipes || {})[name]
            if (typeof pipe == 'function') {
              val = pipe(val, pipes[name])
            }
          }
        }

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

    // Get value from state
    function get(val) {
      return util.get(val, state)
    }

    // Set value in state
    function set(key, val) {
      return util.set(key, val, state)
    }

    // Check if object validates
    async function ok(val) {
      for (const field in val) {
        const obj = val[field]
        const checks = get(field)
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

        const leaf = branch[node]
        let val = expand(leaf, state, opt)

        let [key, ext, id] = util.split(node)
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
              val,
              key,
              id,
              run,
              set,
              get,
              ok,
              opt,
              params,
              expand,
              util,
              load
            }
            val = await fn(args)
          }
        }

        if (typeof val != 'undefined' && key[0] == '=') {
          set(key, val)
        }
      }
    }

    await run(tree)

    return state
  }
}
