var compile = require('../../lib/compile.js')
var execute = require('../../lib/execute.js')

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'world')
  t.equal(val, 'world')
  t.strictEqual(err, null)
})

test('assign indirect - string', async ({ t }) => {
  var ast = compile('=bye: $hello')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye, 'world')
  t.equal(val, 'world')
  t.strictEqual(err, null)
})

test('assign indirect - array', async ({ t }) => {
  var ast = compile('=bye: [$hello, 2]')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye[0], 'world')
  t.equal(state.vars.bye[1], 2)
  t.deepEqual(val, ['world', 2])
  t.strictEqual(err, null)
})

test('assign indirect - object key', async ({ t }) => {
  var ast = compile('=bye: { $hello: a }')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.vars.bye, { world: 'a' })
  t.deepEqual(val, { world: 'a' })
  t.strictEqual(err, null)
})

test('assign indirect - object value', async ({ t }) => {
  var ast = compile('=bye: { a: $hello }')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.vars.bye, { a: 'world' })
  t.deepEqual(val, { a: 'world' })
  t.strictEqual(err, null)
})

test('assign deconstruct - array', async ({ t }) => {
  var ast = compile('=a,b,c: [1,2,3]')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, 3)
  t.deepEqual(val, [1, 2, 3])
  t.strictEqual(err, null)
})

test('assign deconstruct - string', async ({ t }) => {
  var ast = compile('=a,b,c: hello')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(state.vars.a, 'hello')
  t.equal(state.vars.b, 'hello')
  t.equal(state.vars.c, 'hello')
  t.equal(val, 'hello')
  t.strictEqual(err, null)
})

test('assign func value', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: async function () {
      return 'bye'
    },
  }
  var opt = { ext: { func } }
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'bye')
  t.equal(val, 'bye')
  t.strictEqual(err, null)
})

test('assign deconstruct func', async ({ t }) => {
  var ast = compile('=a,b,c@func: {}')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function () {
      return [1, 2, 3]
    },
  }
  var opt = { ext: { func } }
  var [val, err] = await execute(ast, node, state, opt)
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, 3)
  t.deepEqual(state.result, undefined)
  t.strictEqual(err, null)
})

test('throw explicit from func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function () {
      throw new Error('explicit throw')
    },
  }
  var opt = { ext: { func } }
  var [val, err] = await execute(ast, node, state, opt)
  t.deepEqual(state.vars, {})
  t.strictEqual(val, null)
  t.equal(err, 'explicit throw')
})

test('throw on missing func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = { ext: {} }
  var [val, err] = await execute(ast, node, state, opt)
  t.deepEqual(state.vars, {})
  t.strictEqual(val, null)
  t.equal(err, 'the function "func" does not exist')
})
