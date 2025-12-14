var shape = require('../../lib/shape.js')

test('object', async ({ t }) => {
  var node = { hello: 'user' }
  var result = shape(node)
  t.equal(result, null)
})

test('assign', async ({ t }) => {
  var node = { '=hello_ID_s-1-1-1-1_ID_': 'user' }
  var result = shape(node)

  t.equal(result.id, 's-1-1-1-1')
  t.equal(result.key, 'hello')
  t.equal(result.value, 'user')
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.hit, 1)
  t.equal(result.mode, 'sync')
  t.equal(result.parent, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.operation, {
    assigns: ['hello'],
    ext: null,
    bang: false,
    elemental: false
  })
})

test('assign - async', async ({ t }) => {
  var node = { '=hello_ID_a-1-1-1-1_ID_': 'user' }
  var result = shape(node)

  t.equal(result.id, 'a-1-1-1-1')
  t.equal(result.key, 'hello')
  t.equal(result.value, 'user')
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.hit, 1)
  t.equal(result.mode, 'async')
  t.equal(result.parent, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.operation, {
    assigns: ['hello'],
    ext: null,
    bang: false,
    elemental: false
  })
})

test('assign func', async ({ t }) => {
  var node = { '=hello@func_ID_s-1-1-1-1_ID_': 'user' }
  var result = shape(node)

  t.equal(result.id, 's-1-1-1-1')
  t.equal(result.key, 'hello@func')
  t.equal(result.value, 'user')
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'sync')
  t.equal(result.parent, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.operation, {
    assigns: ['hello'],
    ext: 'func',
    bang: false,
    elemental: false
  })
})

test('assign func - async', async ({ t }) => {
  var node = { '=hello@func_ID_a-1-1-1-1_ID_': 'user' }
  var result = shape(node)

  t.equal(result.id, 'a-1-1-1-1')
  t.equal(result.key, 'hello@func')
  t.equal(result.value, 'user')
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'async')
  t.equal(result.parent, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.operation, {
    assigns: ['hello'],
    ext: 'func',
    bang: false,
    elemental: false
  })
})

test('assign deep', async ({ t }) => {
  var node = { '=hello_ID_s-1-1-1-1_ID_': { '=bye_ID_s-1-1-1-2_ID_': 'a' } }
  var result = shape(node)

  t.equal(result.id, 's-1-1-1-1')
  t.equal(result.key, 'hello')
  t.deepEqual(result.value, {})
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'sync')
  t.equal(result.parent, null)
  t.deepEqual(result.operation, {
    assigns: ['hello'],
    ext: null,
    bang: false,
    elemental: false
  })

  var child = result.children[0]

  t.equal(child.key, 'bye')
  t.equal(child.id, 's-1-1-1-2')
  t.equal(child.value, 'a')
  t.equal(child.block, 1)
  t.equal(child.line, 1)
  t.equal(child.column, 1)
  t.equal(child.mode, 'sync')
  t.equal(child.parent.id, 's-1-1-1-1')
  t.equal(child.parent.key, 'hello')
  t.deepEqual(child.operation, {
    assigns: ['bye'],
    ext: null,
    bang: false,
    elemental: false
  })
})

test('func - one', async ({ t }) => {
  var node = { '@db_ID_s-1-1-1-1_ID_': {} }
  var result = shape(node)

  t.equal(result.id, 's-1-1-1-1')
  t.equal(result.key, '@db')
  t.deepEqual(result.value, {})
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'sync')
  t.equal(result.parent, null)
  t.deepEqual(result.children, [])
  t.deepEqual(result.operation, {
    assigns: [],
    ext: 'db',
    bang: false,
    elemental: false
  })
})

test('func - multiple', async ({ t }) => {
  var node = { '@p_ID_s-1-1-1-1_ID_': { '@span_ID_s-1-1-2-2_ID_': 'a' } }
  var result = shape(node)

  t.equal(result.id, 's-1-1-1-1')
  t.equal(result.key, '@p')
  t.deepEqual(result.value, {})
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'sync')
  t.equal(result.parent, null)
  t.deepEqual(result.operation, {
    assigns: [],
    ext: 'p',
    bang: false,
    elemental: true
  })

  var child = result.children[0]

  t.equal(child.key, '@span')
  t.equal(child.id, 's-1-1-2-2')
  t.equal(child.value, 'a')
  t.equal(child.block, 1)
  t.equal(child.line, 1)
  t.equal(child.column, 2)
  t.equal(child.mode, 'sync')
  t.equal(child.parent.id, 's-1-1-1-1')
  t.equal(child.parent.key, '@p')
  t.deepEqual(child.operation, {
    assigns: [],
    ext: 'span',
    bang: false,
    elemental: true
  })
})

test('func - async single', async ({ t }) => {
  var node = { '@p_ID_a-1-1-1-1_ID_': { '@span_ID_a-1-1-2-2_ID_': 'a' } }
  var result = shape(node)

  t.equal(result.id, 'a-1-1-1-1')
  t.equal(result.key, '@p')
  t.deepEqual(result.value, {})
  t.equal(result.block, 1)
  t.equal(result.line, 1)
  t.equal(result.column, 1)
  t.equal(result.mode, 'async')
  t.equal(result.parent, null)
  t.deepEqual(result.operation, {
    assigns: [],
    ext: 'p',
    bang: false,
    elemental: true
  })

  var child = result.children[0]

  t.equal(child.key, '@span')
  t.equal(child.id, 'a-1-1-2-2')
  t.equal(child.value, 'a')
  t.equal(child.block, 1)
  t.equal(child.line, 1)
  t.equal(child.column, 2)
  t.equal(child.mode, 'async')
  t.equal(child.parent.id, 'a-1-1-1-1')
  t.equal(child.parent.key, '@p')
  t.deepEqual(child.operation, {
    assigns: [],
    ext: 'span',
    bang: false,
    elemental: true
  })
})
