// var compile = require('../../lib/compile.js')
// var run = require('../../lib/run.js')

// test('undefined', async ({ t }) => {
//   var ast = compile()
//   var result = run(ast).state.result
//   var expect = {}
//   t.deepEqual(result, expect)
// })

// test('empty', async ({ t }) => {
//   var ast = compile('')
//   var result = run(ast).state.result
//   var expect = {}
//   t.deepEqual(result, expect)
// })

// test('string', async ({ t }) => {
//   var ast = compile('a: hello')
//   var result = run(ast).state.result
//   var expect = { a: 'hello' }
//   t.deepEqual(result, expect)
// })

// test('number', async ({ t }) => {
//   var ast = compile('a: 5')
//   var result = run(ast).state.result
//   var expect = { a: 5 }
//   t.deepEqual(result, expect)
// })

// test('object', async ({ t }) => {
//   var ast = compile('a: b')
//   var result = run(ast).state.result
//   var expect = { a: 'b' }
//   t.deepEqual(result, expect)
// })

// test('array', async ({ t }) => {
//   var ast = compile('a: [1, 2]')
//   var result = run(ast).state.result
//   var expect = { a: [1, 2] }
//   t.deepEqual(result, expect)
// })

// test('bool', async ({ t }) => {
//   var ast = compile('a: true')
//   var result = run(ast).state.result
//   var expect = { a: true }
//   t.deepEqual(result, expect)
// })

// test('null', async ({ t }) => {
//   var ast = compile('a: null')
//   var result = run(ast).state.result
//   var expect = { a: null }
//   t.deepEqual(result, expect)
// })
