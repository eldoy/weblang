let compile = require('./compile.js')
let parse = require('./parse.js')
let expand = require('./expand.js')
let get = require('./get.js')
let set = require('./set.js')
let ok = require('./ok.js')

// Execute code
module.exports = async function execute(code, config) {
  let tree = compile(code)

  let state = { vars: {} }

  // Add custom vars
  if (config.vars) {
    for (let name in config.vars) {
      state.vars[name] = config.vars[name]
    }
  }

  async function run(branch) {
    for (let node in branch) {
      if (typeof state.return != 'undefined') break

      let [key, ext, id] = parse(node)
      let current = branch[node]
      let args = {
        state,
        code,
        tree,
        branch,
        node,
        current,
        key,
        id,
        run,
        config,
        expand,
        compile,
        get: function (key) {
          return get(key, state)
        },
        set: function (key, val) {
          return set(key, val, state)
        },
        ok: function (val) {
          return ok(val, state)
        }
      }
      let val = await expand(current, state, config, args)

      let fn = config.ext[ext]
      if (typeof fn == 'function') {
        val = await fn({ ...args, val })
      }

      if (typeof val != 'undefined' && key[0] == '=') {
        set(key, val, state)
      }
    }
  }

  await run(tree)

  return state
}