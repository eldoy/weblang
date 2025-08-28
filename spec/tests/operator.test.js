var operator = require('../../lib/operator.js')

test('assign', ({ t }) => {
  var result = operator('a')
  t.strictEqual(result.ext, null)
  t.deepEqual(result.assigns, ['a'])
  t.equal(result.bang, false)
})

test('assign ext', ({ t }) => {
  var result = operator('a@func')
  t.equal(result.ext, 'func')
  t.deepEqual(result.assigns, ['a'])
  t.equal(result.bang, false)
})

test('assign ext - squelch', ({ t }) => {
  var result = operator(',b@func')
  t.equal(result.ext, 'func')
  t.deepEqual(result.assigns, ['b'])
  t.equal(result.bang, false)
})

test('assign multiple', ({ t }) => {
  var result = operator('a,b@func')
  t.equal(result.ext, 'func')
  t.deepEqual(result.assigns, ['a', 'b'])
  t.equal(result.bang, false)
})

test('assign multiple - no ext', ({ t }) => {
  var result = operator('a,b')
  t.strictEqual(result.ext, null)
  t.deepEqual(result.assigns, ['a'])
  t.equal(result.bang, false)
})

test('assign squelch - no ext', ({ t }) => {
  var result = operator(',b')
  t.equal(result.ext, null)
  t.deepEqual(result.assigns, [])
  t.equal(result.bang, false)
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
