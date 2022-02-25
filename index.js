const _ = require('lodash')
const { validate } = require('d8a')
const { clean } = require('extras')
const expand = require('./lib/expand.js')
const load = require('./lib/load.js')
const util = require('./lib/util.js')
const pipes = require('./lib/pipes.js')

module.exports = function(opt = {}) {

  opt.pipes = { ...pipes, ...opt.pipes }

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

    // Add extensions
    opt.ext = opt.ext || {}

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

      let blob = code

      if (typeof blob == 'string') {
        blob = load(blob, opt)
      }

      for (const name in blob) {
        if (typeof state.return != 'undefined') break

        let raw = blob[name]
        let val = expand(raw, state, opt)

        let [key, id] = util.split(name)
        let setter

        if (key[0] != '$') {
          [key, setter] = key.split('$')
        }

        if (key[0] == '$') {
          set(key, val)

        } else if (key == 'if') {
          state.test = await ok(val)

        } else if (
          key == 'then' && state.test ||
          key == 'else' && state.test === false
        ) {
          await run(val)
          delete state.test

        } else if (key == 'return') {
          state.return = _.cloneDeep(val)

        } else if (typeof opt.ext[key] == 'function') {
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
            util
          }
          const result = await opt.ext[key](args)
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
