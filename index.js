const _ = require('lodash')
const { validate } = require('d8a')
const { clean } = require('extras')
const expand = require('./lib/expand.js')
const load = require('./lib/load.js')
const util = require('./lib/util.js')
const core = require('./lib/core.js')
const pipes = require('./lib/pipes.js')

module.exports = function(opt = {}) {

  opt.pipes = { ...pipes, ...opt.pipes }
  opt.ext = { ...core, ...opt.ext }

  return async function(data, params) {

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
      if (key[0] == '$') key = key.slice(1)
      _.set(state.vars, key, _.cloneDeep(val))
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

    async function run(code) {

      const blob = load(code)

      for (const name in blob) {
        if (typeof state.return != 'undefined') break

        const raw = blob[name]
        const val = expand(raw, state, opt)

        let [key, id] = util.split(name)

        if (key[0] == '$') {
          set(key, val)
          continue
        }

        let setter
        [key, setter] = key.split('$')

        const ext = opt.ext[key.slice(1)]

        if (typeof ext == 'function') {
          const args = {
            state,
            code,
            blob,
            raw,
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

    await run(data)

    return state
  }
}
