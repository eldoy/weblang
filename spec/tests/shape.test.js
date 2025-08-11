var shape = require('../../lib/shape.js')

test('assign', async ({ t }) => {
  var code = { '=hello_ID_s-1-1-1_ID_': 'user' }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('assign - async', async ({ t }) => {
  var code = { '=hello_ID_a-1-1-1_ID_': 'user' }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('assign - async spaced', async ({ t }) => {
  var code = { '=hello_ID_a-1-1-1_ID_': 'user' }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('assign func', async ({ t }) => {
  var code = { '=hello@func_ID_s-1-1-1_ID_': 'user' }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('assign func - async', async ({ t }) => {
  var code = { '=hello@func_ID_a-1-1-1_ID_': 'user' }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('func - one', async ({ t }) => {
  var code = { '@db_ID_s-1-1-1_ID_': {} }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('func - multiple', async ({ t }) => {
  var code = { '@p_ID_s-1-1-1_ID_': { '@p_ID_s-1-1-2_ID_': 'a' } }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})

test('func - async single', async ({ t }) => {
  var code = { '@p_ID_a-1-1-1_ID_': { '@p_ID_a-1-1-2_ID_': 'a' } }
  var result = shape(code)
  var expect = {}
  t.equal(result, expect)
})
