var shape = require('../../lib/shape.js')

test('assign', async ({ t }) => {
  var code = { '=hello_ID_s-1-1-1_ID_': 'user' }
  var result = shape(code)

  t.equal(result.id, 's-1-1-1')
  t.equal(result.key, 'hello')
  t.equal(result.value, 'user')
  t.equal(result.level, 1)
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.occurrence, 1)
  t.equal(result.path, '')
  t.equal(result.concurrency, 'sync')
  t.equal(result.type, 'assign')
  t.equal(result.parent, null)
  t.equal(result.next, null)
  t.equal(result.previous, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.attributes, [])
  t.deepEqual(result.group, [])

  t.equal(result.index, 0)
  t.equal(result.siblings.length, 1)
  t.equal(result.siblings[0].id, 's-1-1-1')
})

test('assign - async', async ({ t }) => {
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
