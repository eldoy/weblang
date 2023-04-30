const _ = require('lodash')
const { validate } = require('d8a')
const { dot, clean } = require('extras')
const expand = require('./lib/expand.js')
const load = require('./lib/load.js')
const util = require('./lib/util.js')
const core = require('./lib/core.js')
const pipes = require('./lib/pipes.js')

module.exports = function(opt = {}) {

  opt.pipes = { ...pipes, ...opt.pipes }
  opt.ext = { ...core, ...opt.ext }

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
      val = util.split(val)[0]
      if (typeof val == 'string' && val[0] == '$') {
        return _.get(state.vars, val.slice(1))
      }
      return val
    }

    // Set value in state
    function set(key, val) {
      if (key[0] == '=') key = key.slice(1)
      const dotted = dot({[key]: _.cloneDeep(val)})
      for (const k in dotted) {
        _.set(state.vars, k, dotted[k])
      }
      state.vars = clean(state.vars)
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

    // DEBUG:
    // console.log(JSON.stringify(tree, null, 2))

    async function run(branch) {

      for (const leaf in branch) {
        if (typeof state.return != 'undefined') break

        const vein = branch[leaf]
        const val = expand(vein, state, opt)

        let [key, id] = util.split(leaf)

        if (!key.includes('@') && key[0] == '=') {
          set(key, val)
          continue
        }

        let setter
        [setter, key] = key.split('@')
        setter = setter.slice(1)

        const ext = opt.ext[key]

        if (typeof ext == 'function') {
          const args = {
            state,
            code,
            tree,
            branch,
            leaf,
            vein,
            val,
            key,
            setter,
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
          const result = await ext(args)
          if (typeof result != 'undefined' && setter) {
            set(setter, result)
          }
        }
      }
    }

    await run(tree)

    return state
  }
}
