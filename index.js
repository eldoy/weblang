const _ = require('lodash')
const { validate } = require('d8a')
const expand = require('./lib/expand.js')
const load = require('./lib/load.js')
const util = require('./lib/util.js')
const core = require('./lib/core.js')
const pipes = require('./lib/pipes.js')
const renderers = require('./lib/renderers.js')

module.exports = function(opt = {}) {
  opt.pipes = { ...pipes, ...opt.pipes }
  opt.ext = { ...core, ...opt.ext }
  opt.renderers = { ...renderers, ...opt.renderers }

  return async function(code, params) {
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
        if (checks && await validate(obj, checks)) {
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
              pipes,
              util,
              load,
              core
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
