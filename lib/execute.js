var compile = require('./compile.js')
var parse = require('./parse.js')
var expand = require('./expand.js')
var html = require('./html.js')
var func = require('./func.js')
var get = require('./get.js')
var set = require('./set.js')
var ok = require('./ok.js')

// Execute code
module.exports = async function execute(code, config) {
  var tree = compile(code)

  var state = { vars: {} }
  var tagLevels = []

  // Add custom vars
  if (config.vars) {
    for (var name in config.vars) {
      state.vars[name] = config.vars[name]
    }
  }

  async function run(branch, currentLevel) {
    for (var node in branch) {
      if (typeof state.return != 'undefined') break

      var [key, ext, id] = parse(node)
      var current = branch[node]
      var args = {
        tagLevels,
        state,
        code,
        tree,
        branch,
        node,
        current,
        key,
        ext,
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
      var val = await expand(current, state, config, args)

      var parsed = func.parseName(ext)

      var fn = config.ext[parsed.fnName]

      if (typeof fn == 'function') {
        var tagsExt = Object.keys(html)
        var nonFuncExt = ['if', 'then', 'else', 'return', 'delete', ...tagsExt]

        if (!nonFuncExt.includes(parsed.fnName)) {
          val = await func.executeFn({ ...args, parsed, val, fn })
        } else {
          val = await fn({ ...args, val, currentLevel })
        }
      }

      if (typeof val != 'undefined' && key[0] == '=') {
        set(key, val, state)
      }
    }
  }

  // Start running tree at level 0
  await run(tree, 0)

  return state
}
