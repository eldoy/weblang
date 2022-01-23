const _ = require('lodash')
const { validate } = require('d8a')
const { clean } = require('extras')
const expand = require('./lib/expand.js')
const { load } = require('./lib/util.js')
const PIPES = require('./lib/pipes.js')

module.exports = function(opt = {}) {

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

    // Add pipes
    opt.pipes = { ...PIPES, ...opt.pipes }

    // Add extensions
    opt.ext = opt.ext || {}

    // Get value from state
    function get(val) {
      if (typeof val == 'string' && val[0] == '$') {
        return _.get(state.vars, val.slice(1))
      }
      return val
    }

    // Set value in state
    function set(key, val) {
      if (key[0] == '$') key = key.slice(1)
      _.set(state.vars, key, val)
      state.vars = clean(state.vars)
    }

    async function run(code) {

      if (typeof code == 'string') {
        code = load(code)
      }

      for (const name in code) {
        if (typeof state.return != 'undefined') break

        let raw = code[name]
        let val = expand(raw, state, opt)

        let [key, id] = name.split('@'), setter

        if (key[0] != '$') {
          [key, setter] = key.split('$')
        }

        if (key[0] == '$') {
          set(key, val)
        }

        else if (key == 'if') {
          for (const field in val) {
            const obj = val[field]
            const checks = get(field)
            state.test = !checks || !await validate(obj, checks)
            if (!state.test) break
          }
        }

        else if (
          key == 'then' && state.test ||
          key == 'else' && state.test === false
        ) {
          await run(val)
          delete state.test
        }

        else if (key == 'return') {
          state.return = val
        }

        else if (typeof opt.ext[key] == 'function') {
          const args = {
            state,
            key,
            val,
            raw,
            setter,
            id,
            run,
            set,
            get,
            opt,
            params
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
