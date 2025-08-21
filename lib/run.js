async function run(ast, opt = {}) {
  var state = {
    vars: {},
    result: null,
    err: null,
  }

  var { ext = {} } = opt

  for (var node of ast) {
    var { key, value } = node

    var [assigns, func] = key.split('@')
    assigns = assigns.split(',')

    var resultFunc
    var extFuncs = Object.values(ext)

    function execFunc(node, isChild = false) {
      func = node.key.split('@')[1]

      var currentFunc = extFuncs.find((e) => e.name === func)

      if (!currentFunc) {
        var msg = `the function "${func}" does not exist`
        state.err = `error on line ${node.line} column ${node.column}: ${msg}`
        return { state }
      }

      if (node.mode === 'sync') {
        try {
          var res = currentFunc.handler(ast, node)
          if (!isChild) resultFunc = res

          for (var child of node.children) {
            if (child.key.includes('@')) {
              execFunc(child, true)
              if (state.err) break
            }
          }
        } catch (e) {
          state.err = `error on line ${node.line} column ${node.column}: ${e.message}`
          return { state }
        }
      } else if (node.mode === 'async') {
        // Promise.all on node.siblings functions
      }
    }

    if (func) {
      execFunc(node)
      if (state.err) return { state }
    } else {
      if (typeof value === 'string' && value.startsWith('$')) {
        var varName = value.slice(1)
        value = state.vars[varName]
      }
    }

    for (var i = 0; i < assigns.length; i++) {
      var assignKey = assigns[i]
      if (!assignKey) continue

      var currentValue = Array.isArray(value) ? value[i] : value
      state.vars[assignKey] = resultFunc ?? currentValue
    }
  }

  return { state }
}

module.exports = run
