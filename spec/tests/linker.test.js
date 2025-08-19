var linker = require('../../lib/linker.js')

test('empty', async ({ t }) => {
  var ast = []
  var result = linker(ast)
  t.deepEqual(result, [])
})

test('no children', async ({ t }) => {
  var ast = [
    {
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
    },
  ]

  var result = linker(ast)

  t.equal(result[0].next, null)
  t.equal(result[0].previous, null)
  t.deepEqual(result[0].siblings, [])
  t.equal(result[0].index, 0)
})

test('single child', async ({ t }) => {
  var ast = [
    {
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
    },
  ]

  var result = linker(ast)

  t.equal(result[0].next, null)
  t.equal(result[0].previous, null)
  t.deepEqual(result[0].siblings, [])
  t.equal(result[0].index, 0)

  var child = result[0].children[0]

  t.equal(child.next, null)
  t.equal(child.previous, null)
  t.deepEqual(child.siblings, result[0].children)
  t.equal(child.siblings[0].id, 's-1-1-2')
  t.equal(child.siblings[0].key, '@span')
  t.equal(child.index, 0)
})

test('siblings children', async ({ t }) => {
  var ast = [
    {
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
    },
  ]

  var result = linker(ast)

  t.equal(result[0].next, null)
  t.equal(result[0].previous, null)
  t.deepEqual(result[0].siblings, [])
  t.equal(result[0].index, 0)

  var child1 = result[0].children[0]

  t.equal(child1.next.id, 's-1-2-2')
  t.equal(child1.next.key, '@span')
  t.equal(child1.previous, null)
  t.deepEqual(child1.siblings, result[0].children)
  t.equal(child1.siblings[0].id, 's-1-1-2')
  t.equal(child1.siblings[1].id, 's-1-2-2')
  t.equal(child1.index, 0)

  var child2 = result[0].children[1]

  t.equal(child2.next, null)
  t.equal(child2.previous.id, 's-1-1-2')
  t.equal(child2.previous.key, '@span')
  t.deepEqual(child2.siblings, result[0].children)
  t.equal(child2.siblings[0].id, 's-1-1-2')
  t.equal(child2.siblings[1].id, 's-1-2-2')
  t.equal(child2.index, 1)
})

test('nested children', async ({ t }) => {
  var ast = [
    {
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
    },
  ]

  var result = linker(ast)

  t.equal(result[0].next, null)
  t.equal(result[0].previous, null)
  t.deepEqual(result[0].siblings, [])
  t.equal(result[0].index, 0)

  var child1 = result[0].children[0]

  t.equal(child1.next.id, 's-1-2-2')
  t.equal(child1.next.key, '@span')
  t.equal(child1.previous, null)
  t.deepEqual(child1.siblings, result[0].children)
  t.equal(child1.siblings[0].id, 's-1-1-2')
  t.equal(child1.siblings[1].id, 's-1-2-2')
  t.equal(child1.index, 0)

  var child2 = result[0].children[1]

  t.equal(child2.next, null)
  t.equal(child2.previous.id, 's-1-1-2')
  t.equal(child2.previous.key, '@span')
  t.deepEqual(child2.siblings, result[0].children)
  t.equal(child2.siblings[0].id, 's-1-1-2')
  t.equal(child2.siblings[1].id, 's-1-2-2')
  t.equal(child2.index, 1)

  var grandchild1 = child2.children[0]

  t.equal(grandchild1.next.id, 's-1-3-3')
  t.equal(grandchild1.next.key, '@a')
  t.equal(grandchild1.previous, null)
  t.deepEqual(grandchild1.siblings, child2.children)
  t.equal(grandchild1.siblings[0].id, 's-1-2-3')
  t.equal(grandchild1.siblings[1].id, 's-1-3-3')
  t.equal(grandchild1.index, 0)

  var grandchild2 = child2.children[1]

  t.equal(grandchild2.next, null)
  t.equal(grandchild2.previous.id, 's-1-2-3')
  t.equal(grandchild2.previous.key, '@a')
  t.deepEqual(grandchild2.siblings, child2.children)
  t.equal(grandchild2.siblings[0].id, 's-1-2-3')
  t.equal(grandchild2.siblings[1].id, 's-1-3-3')
  t.equal(grandchild2.index, 1)
})
