const _ = require('lodash')
const { validate } = require('waveorb')
const yaml = require('./lib/yaml.js')
const PIPES = require('./lib/pipes.js')

module.exports = function(opt = {}) {

  return async function(data) {

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

    function get(val) {
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

    function set(key, val) {
      if (val && typeof val == 'object') {
        function replace(obj) {
          for (const key in obj) {
            if (obj[key] && typeof obj[key] == 'object') {
              replace(obj[key])
            } else if (typeof obj[key] == 'string'){
              obj[key] = get(obj[key])
            }
          }
        }
        replace(val)

      } else if (typeof val == 'string') {
        val = get(val)
      }

      _.set(state.vars, key.slice(1), val)
    }

    async function run(code) {

      for (const name in code) {
        let val = code[name]
        let key, id, setter
        [key, id] = name.split('@')
        if (key[0] != '$') {
          [key, setter] = key.split('$')
        }

        if (key[0] == '$') {
          set(key, val)

        } else if (key == 'if') {
          for (let key in val) {
            // Support dot notation
            const [path, value] = Object.entries(val)[0]
            if (path.includes('.')) {
              val = _.set({}, path, value)
              key = path.split('.')[0]
            }
            const obj = val[key]
            const checks = get(key)
            state.test = !checks || !(await validate(obj, checks))
            if (!state.test) break
          }

        } else if (
          key == 'then' && state.test ||
          key == 'else' && state.test === false
        ) {
          await run(val)
          delete state.test

        } else if (key == 'return') {
          state.return = get(val)

        } else if (typeof opt.ext[key] == 'function') {
          const result = await opt.ext[key]({ state, key, val, id, set, get })
          if (setter) {
            set(`$${setter}`, result)
          }
        }
      }
    }
    await run(yaml(data))

    return state
  }
}
