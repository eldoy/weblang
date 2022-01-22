const _ = require('lodash')
const { validate } = require('d8a')
const expand = require('./lib/expand.js')
const { load, clean } = require('./lib/util.js')
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
      if (typeof val != 'string') return val
      let [v, ...pipes] = val.split('|').map(x => x.trim())
      if (v[0] == '$') {
        v = _.get(state.vars, v.slice(1)) || ''
      }
      for (const p of pipes) {
        const pipe = opt.pipes[p]
        if (typeof pipe == 'function') {
          v = pipe(v)
        }
      }
      return v
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

        let val = code[name]
        val = expand(val, state, opt)

        let [key, id] = name.split('@'), setter

        if (key[0] != '$') {
          [key, setter] = key.split('$')
        }

        if (key[0] == '$') {
          set(key, val)
        }

        else if (key == 'if') {
          for (let key in val) {
            const obj = val[key]
            const checks = get(key)
            state.test = !checks || !(await validate(obj, checks))
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
          state.return = get(val)
        }

        else if (typeof opt.ext[key] == 'function') {
          const args = { state, key, val, setter, id, run, set, get, params }
          const result = await opt.ext[key](args)
          if (setter) {
            set(setter, result)
          }
        }
      }
    }

    await run(data)

    return state
  }
}
