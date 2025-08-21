var column = require('../../lib/column.js')

test('assign', async ({ t }) => {
  var line = '=hello: user'
  var result = column(line)
  t.equal(result, 1)
})

test('assign async', async ({ t }) => {
  var line = '- =hello: user'
  var result = column(line)
  t.equal(result, 3)
})

test('assign async wide', async ({ t }) => {
  var line = '-   =hello: user'
  var result = column(line)
  t.equal(result, 5)
})

test('assign func', async ({ t }) => {
  var line = '=hello@func: user'
  var result = column(line)
  t.equal(result, 7)
})

test('assign func', async ({ t }) => {
  var line = '- =hello@func: user'
  var result = column(line)
  t.equal(result, 9)
})

test('func', async ({ t }) => {
  var line = '@db: {}'
  var result = column(line)
  t.equal(result, 1)
})

test('func - multiple', async ({ t }) => {
  var line = '@p: { @p: a }'

  var result = column(line)
  t.equal(result, 1)

  var result2 = column(line, result)
  t.equal(result2, 7)
})

test('func - multiple', async ({ t }) => {
  var line = '- @p: { @p: a }'

  var result = column(line)
  t.equal(result, 3)

  var result2 = column(line, result)
  t.equal(result2, 9)
})
