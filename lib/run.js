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

    if (func) {
      var extFuncs = Object.values(ext)
      var currentFunc = extFuncs.find((e) => e.name === func)

      if (!currentFunc) {
        throw new Error(`Unexisting function @${func} on line ${node.line}`)
      }

      var resultFunc
      if (node.mode === 'sync') {
        resultFunc = currentFunc.handler(ast, node)
      } else if (node.mode === 'async') {
        // Promise.all on node.siblings functions
      }

      if (assigns) {
        state.vars[assigns] = resultFunc
      }
    } else {
      if (value.startsWith('$')) {
        var varName = value.slice(1)
        value = state.vars[varName]
      }

      if (assigns) {
        state.vars[assigns] = value
      }
    }
  }

  return { state }
}

module.exports = run
