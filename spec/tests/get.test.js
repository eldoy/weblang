var get = require('../../lib/get.js')

test('read global (no node)', async ({ t }) => {
  var state = { vars: { hello: 'world' }, locals: {} }
  t.equal(get(state, 'hello'), 'world')
})

test('read current local', async ({ t }) => {
  var state = { vars: {}, locals: { 2: { hello: 'local' } } }
  var node = { scopeid: 2 }
  t.equal(get(state, 'hello', node), 'local')
})

test('read parent local', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'parent' } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'hello', node), 'parent')
})

test('nearest ancestor (skip missing immediate parent)', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'gp' }, 2: {} } }
  var gp = { scopeid: 1 }
  var parent = { scopeid: 2, parent: gp }
  var node = { scopeid: 3, parent }
  t.equal(get(state, 'hello', node), 'gp')
})

test('fallback to global when not in current/ancestors', async ({ t }) => {
  var state = { vars: { hello: 'G' }, locals: { 1: {}, 2: {} } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'hello', node), 'G')
})

test('undefined when not found anywhere', async ({ t }) => {
  var state = { vars: {}, locals: { 1: {}, 2: {} } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'missing', node), undefined)
})

test('current overrides parent and global', async ({ t }) => {
  var state = {
    vars: { hello: 'G' },
    locals: { 1: { hello: 'P' }, 2: { hello: 'C' } },
  }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'hello', node), 'C')
})

test('parent overrides global (no current)', async ({ t }) => {
  var state = { vars: { hello: 'G' }, locals: { 1: { hello: 'P' }, 2: {} } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'hello', node), 'P')
})

test('nested global path', async ({ t }) => {
  var state = { vars: { a: { b: 1 } }, locals: {} }
  t.equal(get(state, 'a.b'), 1)
})

test('nested local path (current)', async ({ t }) => {
  var state = { vars: {}, locals: { 2: { a: { b: 2 } } } }
  var node = { scopeid: 2 }
  t.equal(get(state, 'a.b', node), 2)
})

test('nested local path (parent)', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { a: { b: 3 } }, 2: {} } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'a.b', node), 3)
})

test('ignores unrelated scopes', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { x: 1 }, 3: { hello: 'other' } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  t.equal(get(state, 'hello', node), undefined)
})

test('does not modify state on read', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { a: 1 } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  void get(state, 'a', node)
  t.deepEqual(state, { vars: {}, locals: { 1: { a: 1 } } })
})
