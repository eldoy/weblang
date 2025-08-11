var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('undefined', async ({ t }) => {
  var ast = compile()
  var result = run(ast).state.result
  var expect = {}
  t.deepEqual(result, expect)
})

test('empty', async ({ t }) => {
  var ast = compile('')
  var result = run(ast).state.result
  var expect = {}
  t.deepEqual(result, expect)
})

test('string', async ({ t }) => {
  var ast = compile('a: hello')
  var result = run(ast).state.result
  var expect = { a: 'hello' }
  t.deepEqual(result, expect)
})

test('number', async ({ t }) => {
  var ast = compile('a: 5')
  var result = run(ast).state.result
  var expect = { a: 5 }
  t.deepEqual(result, expect)
})

test('object', async ({ t }) => {
  var ast = compile('a: b')
  var result = run(ast).state.result
  var expect = { a: 'b' }
  t.deepEqual(result, expect)
})

test('array', async ({ t }) => {
  var ast = compile('a: [1, 2]')
  var result = run(ast).state.result
  var expect = { a: [1, 2] }
  t.deepEqual(result, expect)
})

test('bool', async ({ t }) => {
  var ast = compile('a: true')
  var result = run(ast).state.result
  var expect = { a: true }
  t.deepEqual(result, expect)
})

test('null', async ({ t }) => {
  var ast = compile('a: null')
  var result = run(ast).state.result
  var expect = { a: null }
  t.deepEqual(result, expect)
})

test('block', async ({ t }) => {
  var code = ['@a: {}', '', '', '@b: {}'].join('\n')
  var ast = compile(code)
  var result = run(ast).state.result
  var expect = { '@a_ID_1-1-1_ID_': {}, '@b_ID_2-4-1_ID_': {} }
  t.deepEqual(result, expect)
})

test('assign - simple', async ({ t }) => {
  var ast = compile('=a: null')
  var result = run(ast).state.result
  var expect = { '=a_ID_1-1-1_ID_': null }
  t.deepEqual(result, expect)
})

test('func - simple', async ({ t }) => {
  var ast = compile('@a: null')
  var result = run(ast).state.result
  var expect = { '@a_ID_1-1-1_ID_': null }
  t.deepEqual(result, expect)
})

test('func - simple', async ({ t }) => {
  var ast = compile('@a: { @a: hello }')
  var result = run(ast).state.result
  var expect = { '@a_ID_1-1-1_ID_': { '@a_ID_1-1-2_ID_': 'hello' } }
  t.deepEqual(result, expect)
})
