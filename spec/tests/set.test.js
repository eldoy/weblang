var set = require('../../lib/set.js')

test('create global - no node', async ({ t }) => {
  var state = { vars: {}, locals: {} }
  set(state, 'hello', 'world')
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.locals, {})
})

test('create current local - not found', async ({ t }) => {
  var state = { vars: {}, locals: {} }
  var node = { scopeid: 2 }
  set(state, 'hello', 'world', node)
  t.deepEqual(state.vars, {})
  t.equal(state.locals[2].hello, 'world')
})

test('update global - exists, no node', async ({ t }) => {
  var state = { vars: { hello: 'world' }, locals: {} }
  set(state, 'hello', 'bye')
  t.equal(state.vars.hello, 'bye')
  t.deepEqual(state.locals, {})
})

test('update global - exists, with node', async ({ t }) => {
  var state = { vars: { hello: 'world' }, locals: {} }
  var node = { scopeid: 1 }
  set(state, 'hello', 'bye', node)
  t.equal(state.vars.hello, 'bye')
  t.deepEqual(state.locals, {})
})

test('update current local - exists', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'world' } } }
  var node = { scopeid: 1 }
  set(state, 'hello', 'bye', node)
  t.deepEqual(state.vars, {})
  t.equal(state.locals[1].hello, 'bye')
})

test('update parent - nearest ancestor', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'world' } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  set(state, 'hello', 'bye', node)
  t.deepEqual(state.vars, {})
  t.equal(state.locals[1].hello, 'bye')
  t.strictEqual(state.locals[2], undefined)
})

test('update nearest ancestor - skip parent', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'A' }, 2: {} } }
  var gp = { scopeid: 1 }
  var parent = { scopeid: 2, parent: gp }
  var node = { scopeid: 3, parent }
  set(state, 'hello', 'X', node)
  t.equal(state.locals[1].hello, 'X')
  t.deepEqual(state.locals[2], {})
  t.strictEqual(state.locals[3], undefined)
})

test('global precedence over parent', async ({ t }) => {
  var state = { vars: { hello: 'G' }, locals: { 1: { hello: 'P' } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  set(state, 'hello', 'X', node)
  t.equal(state.vars.hello, 'X')
  t.equal(state.locals[1].hello, 'P')
})

test('global precedence over current', async ({ t }) => {
  var state = { vars: { hello: 'G' }, locals: { 2: { hello: 'C' } } }
  var node = { scopeid: 2 }
  set(state, 'hello', 'X', node)
  t.equal(state.vars.hello, 'X')
  t.equal(state.locals[2].hello, 'C')
})

test('create current - not in ancestors', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { other: 1 } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  set(state, 'hello', 'X', node)
  t.deepEqual(state.vars, {})
  t.equal(state.locals[2].hello, 'X')
})

test('skip create unrelated scopes on update', async ({ t }) => {
  var state = { vars: {}, locals: { 1: { hello: 'P' } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 3, parent }
  set(state, 'hello', 'X', node)
  t.equal(state.locals[1].hello, 'X')
  t.strictEqual(state.locals[2], undefined)
  t.strictEqual(state.locals[3], undefined)
})

test('other keys unaffected', async ({ t }) => {
  var state = { vars: { other: 1 }, locals: { 1: { another: 2 } } }
  var parent = { scopeid: 1 }
  var node = { scopeid: 2, parent }
  set(state, 'hello', 'X', node)
  t.equal(state.vars.other, 1)
  t.equal(state.locals[1].another, 2)
})
