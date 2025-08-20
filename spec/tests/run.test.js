var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('empty', async ({ t }) => {
  var ast = compile('')
  var output = await run(ast)
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('value', async ({ t }) => {
  var ast = compile('a: hello')
  var output = await run(ast)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var output = await run(ast)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign, get value', async ({ t }) => {
  var ast = compile('=hello: world\n =bye: $hello')
  var output = await run(ast)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.vars.bye, 'world')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign func value', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      return node.value + '!'
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.equal(output.state.vars.hello, 'world!')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('explicit throw on func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      throw new Error('explicit throw')
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(output.state.err, 'error on line 1 column 6: explicit throw')
})

test('throw on missing func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var opt = {
    ext: {},
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(
    output.state.err,
    'error on line 1 column 6: the function "func" does not exist',
  )
})

test('assign multiple', async ({ t }) => {
  var ast = compile('=a,b,c: [1,2,3]')
  var output = await run(ast)
  t.equal(output.state.vars.a, 1)
  t.equal(output.state.vars.b, 2)
  t.equal(output.state.vars.c, 3)
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign multiple func', async ({ t }) => {
  var ast = compile('=a,b,c@func: world')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      return node.value + '!'
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars.a, 'world!')
  t.deepEqual(output.state.vars.b, 'world!')
  t.deepEqual(output.state.vars.c, 'world!')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('execute only func', async ({ t }) => {
  var ast = compile('@func: {}')
  var hasExecuted = false
  var func = {
    name: 'func',
    handler: function (ast, node) {
      hasExecuted = true
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.equal(hasExecuted, true)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('throw only on func', async ({ t }) => {
  var ast = compile('@func: {}')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      throw new Error('explicit throw')
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(output.state.err, 'error on line 1 column 1: explicit throw')
})

// Create tests for, and possible variations:
// =hello: world ✅
// =bye: $hello ✅
// =hello@func: world ✅
// =a,b,c: [1,2,3] ✅
// =a,b@func: {} ✅
// @func: {} ✅
// @func: { @func: {} }
// @func: [$a, 1, 2]
// @func: { a: $a, b: $b, c: 2 }
// - @func1: {}
// - @func2: {}
