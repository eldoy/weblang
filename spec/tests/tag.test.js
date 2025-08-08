var tag = require('../../lib/tag.js')

test('assign', async ({ t }) => {
  var code = '=hello: user'
  var result = tag(code, 1, 1)
  var expect = '=hello_ID_1-1-1_ID_: user'
  t.equal(result, expect)
})

test('func - one', async ({ t }) => {
  var code = '@db: {}'
  var result = tag(code, 1, 1)
  var expect = '@db_ID_1-1-1_ID_: {}'
  t.equal(result, expect)
})

test('func - multiple', async ({ t }) => {
  var code = '@p: { @p: a }'
  var result = tag(code, 1, 1)
  var expect = '@p_ID_1-1-1_ID_: { @p_ID_1-1-2_ID_: a }'
  t.equal(result, expect)
})
