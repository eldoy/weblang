var ext = require('../../lib/ext.js')
var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('if-then', async ({ t }) => {
  var code = [
    '@if:',
    '  $hello:',
    '    is: string',
    '@then:',
    '  =hello: then'
  ].join('\n')
  var ast = compile(code)
  var opt = { vars: { hello: 'world' } }
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
    '  =hello: else'
  ].join('\n')
  var ast = compile(code)
  var opt = { vars: { hello: 5 } }
  var result = await run(ast, opt)
  t.strictEqual(result.state.test, undefined)
  t.equal(result.state.vars.hello, 'else')
})

test('delete', async ({ t }) => {
  var code = ['@delete: $hello'].join('\n')
  var ast = compile(code)
  var opt = { vars: { hello: 'world' } }
  var result = await run(ast, opt)
  t.strictEqual(result.state.vars.hello, undefined)
})

test('return - value', async ({ t }) => {
  var code = ['@return: hello'].join('\n')
  var ast = compile(code)
  var opt = { vars: {} }
  var result = await run(ast, opt)
  t.strictEqual(result.state.return, 'hello')
})

test('return - var', async ({ t }) => {
  var code = ['@return: $hello'].join('\n')
  var ast = compile(code)
  var opt = { vars: { hello: 'world' } }
  var result = await run(ast, opt)
  t.strictEqual(result.state.return, 'world')
})

test('each-do - default', async ({ t }) => {
  var code = ['@each: $numbers', '@do:', '  =a: $item', '  =b: $i'].join('\n')
  var ast = compile(code)
  var opt = {
    vars: { numbers: [1, 2, 3, 4, 5] }
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.iterator, undefined)
  t.equal(result.state.vars.a, 5)
  t.equal(result.state.vars.b, 4)
})

test('each-do - specified', async ({ t }) => {
  var code = [
    '@each:',
    '  in: $numbers',
    '  as: item',
    '  n: i',
    '@do:',
    '  =a: $item',
    '  =b: $i'
  ].join('\n')
  var ast = compile(code)
  var opt = {
    vars: { numbers: [1, 2, 3, 4, 5] }
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.iterator, undefined)
  t.equal(result.state.vars.a, 5)
  t.equal(result.state.vars.b, 4)
})

test('each-do - unavailable', async ({ t }) => {
  var code = [
    '@each:',
    '  in: $numbers',
    '@do:',
    '  =a: $item',
    '  =b: $i'
  ].join('\n')
  var ast = compile(code)
  var opt = { vars: {} }
  var result = await run(ast, opt)
  t.strictEqual(result.state.iterator, undefined)
  t.strictEqual(result.state.in, undefined)
  t.strictEqual(result.state.as, undefined)
  t.strictEqual(result.state.n, undefined)
  t.strictEqual(result.state.vars.a, undefined)
  t.strictEqual(result.state.vars.b, undefined)
})

test('each-do-else', async ({ t }) => {
  var code = [
    '@each:',
    '  in: $numbers',
    '  as: item',
    '  n: i',
    '@do: {}',
    '@else:',
    '  =a: hello'
  ].join('\n')
  var ast = compile(code)
  var opt = {
    vars: { numbers: [] }
  }
  var result = await run(ast, opt)
  t.strictEqual(result.state.iterator, undefined)
  t.equal(result.state.vars.a, 'hello')
})

test('each-do-tags', async ({ t }) => {
  var code = ['@ul:', '  @each: $items', '  @do:', '    @li: $item'].join('\n')
  var ast = compile(code)

  var opt = {
    vars: { items: [1, 2] }
  }
  var result = await run(ast, opt)
  t.equal(result.state.return, '<ul><li>1</li><li>2</li></ul>')
})
