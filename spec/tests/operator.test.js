var operator = require('../../lib/operator.js')

test('assign', ({ t }) => {
  var result = operator('a')
  t.equal(result.ext, null)
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, ['a'])
})

test('assign ext', ({ t }) => {
  var result = operator('a@func')
  t.equal(result.ext, 'func')
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, ['a'])
})

test('assign ext - squelch', ({ t }) => {
  var result = operator(',b@func')
  t.equal(result.ext, 'func')
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, ['', 'b'])
})

test('assign multiple', ({ t }) => {
  var result = operator('a,b@func')
  t.equal(result.ext, 'func')
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, ['a', 'b'])
})

test('assign multiple - no ext', ({ t }) => {
  var result = operator('a,b')
  t.equal(result.ext, null)
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, ['a'])
})

test('assign squelch - no ext', ({ t }) => {
  var result = operator(',b')
  t.equal(result.ext, null)
  t.equal(result.bang, false)
  t.deepEqual(result.assigns, [])
})

test('assign bang', ({ t }) => {
  var result = operator('a,b!')
  t.equal(result.ext, null)
  t.deepEqual(result.assigns, ['a'])
  t.equal(result.bang, false)
})

test('ext', ({ t }) => {
  var result = operator('@func')
  t.equal(result.ext, 'func')
  t.deepEqual(result.assigns, [])
  t.equal(result.bang, false)
})

test('ext bang', ({ t }) => {
  var result = operator('@func!')
  t.equal(result.ext, 'func')
  t.deepEqual(result.assigns, [])
  t.deepEqual(result.bang, true)
})
