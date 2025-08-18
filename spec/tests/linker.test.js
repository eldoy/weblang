var linker = require('../../lib/linker.js')

test('object', async ({ t }) => {
  var node = null
  var result = linker(node)
  t.equal(result, null)
})

test('no children', async ({ t }) => {
  var node = {
    id: 's-1-1-1',
    key: 'hello',
    value: 'user',
    mode: 'sync',
    block: 1,
    line: 1,
    hit: 1,
    level: 1,
    parent: null,
    children: [],
  }
  var result = linker(node)

  // New linked data
  t.equal(result.next, null)
  t.equal(result.previous, null)
  t.deepEqual(result.siblings, [])
  t.equal(result.index, 0)
})

test('single child', async ({ t }) => {
  var node = {
    id: 's-1-1-1',
    key: '@p',
    value: {},
    mode: 'sync',
    block: 1,
    line: 1,
    hit: 1,
    level: 1,
    parent: null,
    children: [
      {
        id: 's-1-1-2',
        key: '@span',
        value: 'a',
        mode: 'sync',
        block: 1,
        line: 1,
        hit: 2,
        level: 1,
        children: [],
      },
    ],
  }
  var result = linker(node)

  // New linked data
  t.equal(result.next, null)
  t.equal(result.previous, null)
  t.deepEqual(result.siblings, [])
  t.equal(result.index, 0)

  var child = result.children[0]

  t.equal(child.next, null)
  t.equal(child.previous, null)
  t.deepEqual(child.siblings, result.children)
  t.equal(child.siblings[0].id, 's-1-1-2')
  t.equal(child.siblings[0].key, '@span')
  t.equal(child.index, 0)
})

test('siblings children', async ({ t }) => {
  var node = {
    id: 's-1-1-1',
    key: '@p',
    value: {},
    mode: 'sync',
    block: 1,
    line: 1,
    hit: 1,
    level: 1,
    parent: null,
    children: [
      {
        id: 's-1-1-2',
        key: '@span',
        value: 'a',
        mode: 'sync',
        block: 1,
        line: 1,
        hit: 2,
        level: 1,
        children: [],
      },
      {
        id: 's-1-2-2',
        key: '@span',
        value: 'a',
        mode: 'sync',
        block: 1,
        line: 2,
        hit: 2,
        level: 1,
        children: [],
      },
    ],
  }
  var result = linker(node)

  // New linked data
  t.equal(result.next, null)
  t.equal(result.previous, null)
  t.deepEqual(result.siblings, [])
  t.equal(result.index, 0)

  var fstChild = result.children[0]

  t.equal(fstChild.next.id, 's-1-2-2')
  t.equal(fstChild.next.key, '@span')
  t.equal(fstChild.previous, null)
  t.deepEqual(fstChild.siblings, result.children)
  t.equal(fstChild.siblings[0].id, 's-1-1-2')
  t.equal(fstChild.siblings[1].id, 's-1-2-2')
  t.equal(fstChild.index, 0)

  var sndChild = result.children[1]

  t.equal(sndChild.next, null)
  t.equal(sndChild.previous.id, 's-1-1-2')
  t.equal(sndChild.previous.key, '@span')
  t.deepEqual(sndChild.siblings, result.children)
  t.equal(sndChild.siblings[0].id, 's-1-1-2')
  t.equal(sndChild.siblings[1].id, 's-1-2-2')
  t.equal(sndChild.index, 1)
})

test('nested children', async ({ t }) => {
  var node = {
    id: 's-1-1-1',
    key: '@p',
    value: {},
    mode: 'sync',
    block: 1,
    line: 1,
    hit: 1,
    level: 1,
    parent: null,
    children: [
      {
        id: 's-1-1-2',
        key: '@span',
        value: 'a',
        mode: 'sync',
        block: 1,
        line: 1,
        hit: 2,
        level: 1,
        children: [],
      },
      {
        id: 's-1-2-2',
        key: '@span',
        value: 'a',
        mode: 'sync',
        block: 1,
        line: 2,
        hit: 2,
        level: 1,
        children: [
          {
            id: 's-1-2-3',
            key: '@a',
            value: 'a',
            mode: 'sync',
            block: 1,
            line: 1,
            hit: 2,
            level: 3,
            children: [],
          },
          {
            id: 's-1-3-3',
            key: '@a',
            value: 'a',
            mode: 'sync',
            block: 1,
            line: 1,
            hit: 2,
            level: 1,
            children: [],
          },
        ],
      },
    ],
  }
  var result = linker(node)

  // New linked data
  t.equal(result.next, null)
  t.equal(result.previous, null)
  t.deepEqual(result.siblings, [])
  t.equal(result.index, 0)

  var fstChild = result.children[0]

  t.equal(fstChild.next.id, 's-1-2-2')
  t.equal(fstChild.next.key, '@span')
  t.equal(fstChild.previous, null)
  t.deepEqual(fstChild.siblings, result.children)
  t.equal(fstChild.siblings[0].id, 's-1-1-2')
  t.equal(fstChild.siblings[1].id, 's-1-2-2')
  t.equal(fstChild.index, 0)

  var sndChild = result.children[1]

  t.equal(sndChild.next, null)
  t.equal(sndChild.previous.id, 's-1-1-2')
  t.equal(sndChild.previous.key, '@span')
  t.deepEqual(sndChild.siblings, result.children)
  t.equal(sndChild.siblings[0].id, 's-1-1-2')
  t.equal(sndChild.siblings[1].id, 's-1-2-2')
  t.equal(sndChild.index, 1)

  var fstGrandchild = sndChild.children[0]

  t.equal(fstGrandchild.next.id, 's-1-3-3')
  t.equal(fstGrandchild.next.key, '@a')
  t.equal(fstGrandchild.previous, null)
  t.deepEqual(fstGrandchild.siblings, sndChild.children)
  t.equal(fstGrandchild.siblings[0].id, 's-1-2-3')
  t.equal(fstGrandchild.siblings[1].id, 's-1-3-3')
  t.equal(fstGrandchild.index, 0)

  var sndGrandchild = sndChild.children[1]

  t.equal(sndGrandchild.next, null)
  t.equal(sndGrandchild.previous.id, 's-1-2-3')
  t.equal(sndGrandchild.previous.key, '@a')
  t.deepEqual(sndGrandchild.siblings, sndChild.children)
  t.equal(sndGrandchild.siblings[0].id, 's-1-2-3')
  t.equal(sndGrandchild.siblings[1].id, 's-1-3-3')
  t.equal(sndGrandchild.index, 1)
})
