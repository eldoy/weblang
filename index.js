const _ = require('lodash')
const { validate } = require('waveorb')
const yaml = require('./lib/yaml.js')


module.exports = function(opt = {}) {
  // TODO: options should be
  // vars - default variables for each run
  // functions - extra functions, should override default ones
  // pipes - transformative functions run on values, should override default ones

  return async function(data) {

    const state = {
      vars: {}
    }

    function set(key, val) {
      if (val && typeof val == 'object') {
        function replace(obj) {
          for (const key in obj) {
            if (obj[key] && typeof obj[key] == 'object') {
              replace(obj[key])
            } else if (typeof obj[key] == 'string' && obj[key][0] == '$'){
              obj[key] = _.get(state.vars, obj[key].slice(1))
            }
          }
        }
        replace(val)

      } else if (typeof val == 'string' && val[0] == '$') {
        val = _.get(state.vars, val.slice(1))
      }

      _.set(state.vars, key.slice(1), val)
    }

    async function run(code) {

      for (const name in code) {
        let val = code[name]
        let [key, no] = name.split('@')

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
            const checks = _.get(state.vars, key.slice(1))
            state.test = !checks || !(await validate(obj, checks))
            if (!state.test) break
          }

        } else if (
          key == 'then' && state.test ||
          key == 'else' && state.test === false
        ) {
          await run(val)
          delete state.test
        }

      //   if (key == 'return') {

      //     if (_.isPlainObject(val)) {
      //       for (const k in val) {
      //         const v = val[k]
      //         console.log({ k, v })
      //         val[k] = state.var[v] || v
      //       }
      //       return val
      //     }

      //     return state.var[val] || val
      //   }
      }
    }
    await run(yaml(data))

    return state
  }
}

// This stuff has to be implemented in application plugins:

// if (key == 'filters') {
//   // OPTIMIZE: Prefetch or cache these
//   // Only fetch data, or store as object in action
//   const filters = await $.db('filter').find({ name: { $in: val } })
//   for (const filter of filters) {
//     const filterCode = yaml.load(filter.data, { json: true })
//     await run(filterCode)
//   }
// }

// if (key == 'allow') {
//   await $.allow(val)
// }

// if (key == 'deny') {
//   await $.deny(val)
// }

// if (key == 'validate') {
//   await $.validate(val)
// }

// if (key == 'set') {
//   for (const k in val) {
//     const v = val[k]
//     state.var[k] = v
//   }
// }

// if (key == 'db') {
//   let { path, set } = val
//   console.log({ path, set })
//   let [model, verb] = path.split('/')
//   const args = getDatabaseArgs(verb)
//   console.log('ARGS:', ...args)
//   const method = $.db(model)[verb]
//   const result = await method(...args)
//   if (set) {
//     state.var[set] = result
//   }
// }

// if (key == 'mail') {
//   const { name } = val
//   let email = await $.db('email').get({ name })
//   if (email) {
//     const emailCode = yaml.load(email.data, { json: true })
//     email = _.merge(email, emailCode)
//   }
//   email = _.merge(email, { to, from, subject, content } = val)
//   console.log({ email })
//   email.layout = 'mail'
//   $.mailer.send(email, $, { })
// }

// if (key == 'keep' || key == 'remove') {
//   const name = Object.keys(val)[0]
//   const obj = state.var[name]
//   if (obj) {
//     await $[key](obj, val[name])
//   }
// }
