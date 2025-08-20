async function run(ast, opt = {}) {
  var state = {
    result: null,
    err: null,
    vars: {},
  }

  var { ext = {} } = opt

  for (var node of ast) {
    var { key, value } = node

    var [assigns, func] = key.split('@')
    assigns = assigns.split(',')

    var resultFunc

    function haltOnErr(msg) {
      state.err = `error on line ${node.line} column ${node.column}: ${msg}`
      return { state }
    }

    if (func) {
      var extFuncs = Object.values(ext)
      var currentFunc = extFuncs.find((e) => e.name === func)

      if (!currentFunc) {
        return haltOnErr(`the function "${func}" does not exist`)
      }

      if (node.mode === 'sync') {
        try {
          resultFunc = currentFunc.handler(ast, node)
        } catch (e) {
          return haltOnErr(e.message)
        }
      } else if (node.mode === 'async') {
        // Promise.all on node.siblings functions
      }
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
