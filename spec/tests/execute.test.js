var compile = require('../../lib/compile.js')
var execute = require('../../lib/execute.js')

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'world')
})

test('assign indirect - value', async ({ t }) => {
  var ast = compile('=bye: $hello')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye, 'world')
})

test('assign func value', async ({ t }) => {
  var ast = compile('=result@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {
    ext: {
      func: {
        name: 'func',
        handler: async function ({ data }) {
          return 'hello ' + data
        },
      },
    },
  }
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.result, 'hello world')
})

test('assign func error', async ({ t }) => {
  var ast = compile('=result,err@func: hello')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {
    ext: {
      func: {
        name: 'func',
        handler: function () {
          throw Error('bye')
        },
      },
    },
  }
  await execute(ast, node, state, opt)
  t.equal(state.vars.result, 'hello')
  t.equal(state.vars.err, 'bye')
})

test('execute children', async ({ t }) => {
  var ast = compile('@div:\n  @p: hello')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {
    ext: {
      div: {
        name: 'div',
        handler: function ({ state }) {
          state.vars.div = 'div'
        },
      },
      p: {
        name: 'p',
        handler: function ({ state }) {
          state.vars.p = 'p'
        },
      },
    },
  }
  await execute(ast, node, state, opt)
  t.equal(state.vars.div, 'div')
  t.equal(state.vars.p, 'p')
})

test('execute children - break', async ({ t }) => {
  var ast = compile('@div:\n  @p: hello')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {
    ext: {
      div: {
        name: 'div',
        handler: function ({ state }) {
          state.break = true
        },
      },
      p: {
        name: 'p',
        handler: function ({ state }) {
          state.vars.p = 'p'
        },
      },
    },
  }
  await execute(ast, node, state, opt)
  t.strictEqual(state.vars.p, undefined)
})
