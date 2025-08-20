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

    if (func) {
      var extFuncs = Object.values(ext)
      var currentFunc = extFuncs.find((e) => e.name === func)

      if (!currentFunc) {
        throw new Error(`Unexisting function @${func} on line ${node.line}`)
      }

      if (node.mode === 'sync') {
        resultFunc = currentFunc.handler(ast, node)
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
