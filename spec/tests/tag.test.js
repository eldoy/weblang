var tag = require('../../lib/tag.js')

test('assign', async ({ t }) => {
  var code = '=hello: user'
  var result = tag(code, 1, 1)
  var expect = '=hello_ID_s-1-1-1_ID_: user'
  t.equal(result, expect)
})

test('assign - async', async ({ t }) => {
  var code = '- =hello: user'
  var result = tag(code, 1, 1)
  var expect = '=hello_ID_a-1-1-3_ID_: user'
  t.equal(result, expect)
})

test('assign - async spaced', async ({ t }) => {
  var code = '-   =hello: user'
  var result = tag(code, 1, 1)
  var expect = '=hello_ID_a-1-1-5_ID_: user'
  t.equal(result, expect)
})

test('assign func', async ({ t }) => {
  var code = '=hello@func: user'
  var result = tag(code, 1, 1)
  var expect = '=hello@func_ID_s-1-1-7_ID_: user'
  t.equal(result, expect)
})

test('assign func - async', async ({ t }) => {
  var code = '- =hello@func: user'
  var result = tag(code, 1, 1)
  var expect = '=hello@func_ID_a-1-1-9_ID_: user'
  t.equal(result, expect)
})

test('func - one', async ({ t }) => {
  var code = '@db: {}'
  var result = tag(code, 1, 1)
  var expect = '@db_ID_s-1-1-1_ID_: {}'
  t.equal(result, expect)
})

test('func - multiple', async ({ t }) => {
  var code = '@p: { @p: a }'
  var result = tag(code, 1, 1)
  var expect = '@p_ID_s-1-1-1_ID_: { @p_ID_s-1-1-7_ID_: a }'
  t.equal(result, expect)
})

test('func - async single', async ({ t }) => {
  var code = '- @p: { @p: a }'
  var result = tag(code, 1, 1)
  var expect = '@p_ID_a-1-1-3_ID_: { @p_ID_s-1-1-9_ID_: a }'
  t.equal(result, expect)
})
