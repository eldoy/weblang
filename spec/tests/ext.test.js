var ext = require('../../lib/ext.js')
var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('if-then', async ({ t }) => {
  var code = [
    '@if:',
    '  $hello:',
    '    is: string',
    '@then:',
    '  =hello: then',
  ].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { if: ext.if, then: ext.then },
    vars: { hello: 'world' },
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.test, undefined)
  t.equal(result.state.vars.hello, 'then')
})

test('if-then-else', async ({ t }) => {
  var code = [
    '@if:',
    '  $hello:',
    '    is: string',
    '@then:',
    '  =hello: then',
    '@else:',
    '  =hello: else',
  ].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { if: ext.if, then: ext.then, else: ext.else },
    vars: { hello: 5 },
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.test, undefined)
  t.equal(result.state.vars.hello, 'else')
})

test('delete', async ({ t }) => {
  var code = ['@delete: hello'].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { delete: ext.delete },
    vars: { hello: 'world' },
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.vars.hello, undefined)
})

test('return - value', async ({ t }) => {
  var code = ['@return: hello'].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { return: ext.return },
    vars: {},
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.return, 'hello')
})

test('return - var', async ({ t }) => {
  var code = ['@return: $hello'].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { return: ext.return },
    vars: { hello: 'world' },
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.return, 'world')
})
