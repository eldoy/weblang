var compile = require('../../lib/compile.js')

test('undefined', async ({ t }) => {
  var result = compile()
  var expect = {}
  t.deepEqual(result, expect)
})

test('empty', async ({ t }) => {
  var result = compile('')
  var expect = {}
  t.deepEqual(result, expect)
})

test('string', async ({ t }) => {
  var result = compile('a: hello')
  var expect = { a: 'hello' }
  t.deepEqual(result, expect)
})

test('number', async ({ t }) => {
  var result = compile('a: 5')
  var expect = { a: 5 }
  t.deepEqual(result, expect)
})

test('object', async ({ t }) => {
  var result = compile('a: b')
  var expect = { a: 'b' }
  t.deepEqual(result, expect)
})

test('array', async ({ t }) => {
  var result = compile('a: [1, 2]')
  var expect = { a: [1, 2] }
  t.deepEqual(result, expect)
})

test('bool', async ({ t }) => {
  var result = compile('a: true')
  var expect = { a: true }
  t.deepEqual(result, expect)
})

test('null', async ({ t }) => {
  var result = compile('a: null')
  var expect = { a: null }
  t.deepEqual(result, expect)
})

test('block', async ({ t }) => {
  var code = ['@a: {}', '', '', '@b: {}'].join('\n')
  var result = compile(code)
  var expect = { '@a_ID_1-1-1_ID_': {}, '@b_ID_2-4-1_ID_': {} }
  t.deepEqual(result, expect)
})

test('assign - simple', async ({ t }) => {
  var result = compile('=a: null')
  var expect = { '=a_ID_1-1-1_ID_': null }
  t.deepEqual(result, expect)
})

test('func - simple', async ({ t }) => {
  var result = compile('@a: null')
  var expect = { '@a_ID_1-1-1_ID_': null }
  t.deepEqual(result, expect)
})

test('func - simple', async ({ t }) => {
  var result = compile('@a: { @a: hello }')
  var expect = { '@a_ID_1-1-1_ID_': { '@a_ID_1-1-2_ID_': 'hello' } }
  t.deepEqual(result, expect)
})
