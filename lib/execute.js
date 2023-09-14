const compile = require('./compile.js')
const parse = require('./parse.js')
const expand = require('./expand.js')
const get = require('./get.js')
const set = require('./set.js')
const ok = require('./ok.js')

// Execute code
module.exports = async function execute(code, config) {
  const tree = compile(code)

  const state = { vars: {} }

  // Add custom vars
  if (config.vars) {
    for (const name in config.vars) {
      state.vars[name] = config.vars[name]
    }
  }

  async function run(branch) {
    for (const node in branch) {
      if (typeof state.return != 'undefined') break

      let [key, ext, id] = parse(node)
      let current = branch[node]
      const args = {
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

      const fn = config.ext[ext]
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