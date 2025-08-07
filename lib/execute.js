var parse = require('./parse.js')
var extract = require('./extract.js')
var expand = require('./expand.js')
var html = require('./html.js')
var func = require('./func.js')
var get = require('./get.js')
var set = require('./set.js')
var ok = require('./ok.js')

var tagsExt = Object.keys(html)
var nonFuncExt = ['if', 'then', 'else', 'return', 'delete'].concat(tagsExt)

module.exports = async function execute(code, config) {
  var tree = parse(code)
  var state = { vars: {} }

  if (config.vars) {
    for (var name in config.vars) {
      state.vars[name] = config.vars[name]
    }
  }

  async function run(branch, currentLevel) {
    var baseArgs = {
      state: state,
      code: code,
      tree: tree,
      branch: branch,
      run: run,
      config: config,
      expand: expand,
      parse: parse,
      get: function (key) {
        return get(key, state)
      },
      set: function (key, val) {
        return set(key, val, state)
      },
      ok: function (val) {
        return ok(val, state)
      },
    }

    for (var node in branch) {
      if (typeof state.return != 'undefined') break

      var [key, ext, id] = extract(node)
      var current = branch[node]

      var args = { ...baseArgs }
      args.node = node
      args.current = current
      args.key = key
      args.ext = ext
      args.id = id

      var val = await expand(current, state, config, args)
      var parsed = func.parseName(ext)
      var fn = config.ext[parsed.fnName]

      if (typeof fn == 'function') {
        if (nonFuncExt.indexOf(parsed.fnName) == -1) {
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

  await run(tree, 0)

  return state
}
