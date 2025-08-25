var operator = require('../../lib/operator.js')

// --- literals ---

test('literal string', ({ t }) => {
  var ops = operator('=hello', 'world')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
})

test('literal number', ({ t }) => {
  var ops = operator('=number', 1)
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'number')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 1)
})

test('literal boolean', ({ t }) => {
  var ops = operator('=hello', true)
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, true)
})

test('literal null', ({ t }) => {
  var ops = operator('=hello', null)
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, null)
})

test('literal object', ({ t }) => {
  var ops = operator('=hello', { a: 1, b: 2 })
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.deepEqual(op.value.data, { a: 1, b: 2 })
})

test('literal array', ({ t }) => {
  var ops = operator('=arr', [1, 2])
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'arr')
  t.equal(op.value.kind, 'literal')
  t.deepEqual(op.value.data, [1, 2])
})

// --- assign with paths ---

test('assign nested dot path', ({ t }) => {
  var ops = operator('=hello.name', 'world')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.deepEqual(op.path, ['hello', 'name'])
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
})

test('assign array index', ({ t }) => {
  var ops = operator('=hello[0]', 3)
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.deepEqual(op.path, ['hello', 0])
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 3)
})

// --- vars ---

test('var assign', ({ t }) => {
  var ops = operator('=bye', '$hello')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'bye')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['hello'])
})

test('var assign with dot path', ({ t }) => {
  var ops = operator('=bye', '$hello.name.deep')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'bye')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['hello', 'name', 'deep'])
})

test('var assign with index and dot path', ({ t }) => {
  var ops = operator('=bye', '$hello[0].name')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'bye')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['hello', 0, 'name'])
})

test('var assign with array index', ({ t }) => {
  var ops = operator('=x', '$arr[1]')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'x')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['arr', 1])
})

test('escaped var is literal', ({ t }) => {
  var ops = operator('=bye', '\\$hello')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'bye')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, '$hello')
})

// --- functions ---

test('func call top-level', ({ t }) => {
  var ops = operator('@log', '$hello')
  var op = ops[0]
  t.equal(op.type, 'func')
  t.equal(op.name, 'log')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['hello'])
})

test('func call on assign', ({ t }) => {
  var ops = operator('=hello@func', { a: 1 })
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'call')
  t.equal(op.value.name, 'func')
  t.equal(op.value.args.kind, 'literal')
  t.deepEqual(op.value.args.data, { a: 1 })
})

test('func call with pipe', ({ t }) => {
  var ops = operator('=hello@func', 'world |> upcase')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'call')
  t.equal(op.value.name, 'func')
  t.equal(op.value.args.kind, 'literal')
  t.equal(op.value.args.data, 'world')
  t.deepEqual(op.value.args.pipes, [{ name: 'upcase', args: [] }])
})

test('func call with pipe and mixed args', ({ t }) => {
  var ops = operator('=result@func', 'input |> transform 1 $x $y=2')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'result')
  t.equal(op.value.kind, 'call')
  t.equal(op.value.name, 'func')
  t.equal(op.value.args.kind, 'literal')
  t.equal(op.value.args.data, 'input')
  t.deepEqual(op.value.args.pipes, [
    {
      name: 'transform',
      args: [
        { kind: 'literal', data: 1 },
        { kind: 'var', path: ['x'] },
        { kind: 'assign', path: ['y'], value: { kind: 'literal', data: 2 } },
      ],
    },
  ])
})

test('func call with pipe arg var key and value', ({ t }) => {
  var ops = operator('=result@func', 'foo |> transform $k=$v')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'result')
  t.equal(op.value.kind, 'call')
  t.equal(op.value.name, 'func')
  t.equal(op.value.args.kind, 'literal')
  t.equal(op.value.args.data, 'foo')
  t.deepEqual(op.value.args.pipes, [
    {
      name: 'transform',
      args: [
        {
          kind: 'assign',
          path: [{ kind: 'var', path: ['k'] }],
          value: { kind: 'var', path: ['v'] },
        },
      ],
    },
  ])
})

// --- pipes ---

test('pipe on literal', ({ t }) => {
  var ops = operator('=hello', 'world |> upcase')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [{ name: 'upcase', args: [] }])
})

test('pipe on var', ({ t }) => {
  var ops = operator('=hello', '$hello |> truncate 5')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'var')
  t.deepEqual(op.value.path, ['hello'])
  t.deepEqual(op.value.pipes, [
    { name: 'truncate', args: [{ kind: 'literal', data: 5 }] },
  ])
})

test('pipe inside object literal', ({ t }) => {
  var ops = operator('=user', { name: 'john |> upcase' })
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'user')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data.name.kind, 'literal')
  t.equal(op.value.data.name.data, 'john')
  t.deepEqual(op.value.data.name.pipes, [{ name: 'upcase', args: [] }])
})

test('pipe inside object var', ({ t }) => {
  var ops = operator('=user', { name: '$user |> upcase' })
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'user')
  t.equal(op.value.kind, 'literal')
  var field = op.value.data.name
  t.equal(field.kind, 'var')
  t.deepEqual(field.path, ['user'])
  t.deepEqual(field.pipes, [{ name: 'upcase', args: [] }])
})

test('pipe inside array literal', ({ t }) => {
  var ops = operator('=list', ['hi |> upcase'])
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'list')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data[0].kind, 'literal')
  t.equal(op.value.data[0].data, 'hi')
  t.deepEqual(op.value.data[0].pipes, [{ name: 'upcase', args: [] }])
})

test('pipe inside array var', ({ t }) => {
  var ops = operator('=list', ['$n |> truncate 5'])
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'list')
  t.equal(op.value.kind, 'literal')
  var elem = op.value.data[0]
  t.equal(elem.kind, 'var')
  t.deepEqual(elem.path, ['n'])
  t.deepEqual(elem.pipes, [
    { name: 'truncate', args: [{ kind: 'literal', data: 5 }] },
  ])
})

test('pipe with var arg', ({ t }) => {
  var ops = operator('=hello', 'world |> truncate $n')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    { name: 'truncate', args: [{ kind: 'var', path: ['n'] }] },
  ])
})

test('pipe with assignment arg literal value', ({ t }) => {
  var ops = operator('=hello', 'world |> replace $name=6')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        { kind: 'assign', path: ['name'], value: { kind: 'literal', data: 6 } },
      ],
    },
  ])
})

test('pipe with assignment arg var value', ({ t }) => {
  var ops = operator('=hello', 'world |> replace a=$name')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        { kind: 'assign', path: ['a'], value: { kind: 'var', path: ['name'] } },
      ],
    },
  ])
})

test('pipe with assignment arg var key and value', ({ t }) => {
  var ops = operator('=hello', 'world |> replace $k=$v')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        {
          kind: 'assign',
          path: [{ kind: 'var', path: ['k'] }],
          value: { kind: 'var', path: ['v'] },
        },
      ],
    },
  ])
})

test('pipe with mixed args', ({ t }) => {
  var ops = operator('=hello', 'world |> format 1 $x $y=2')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'format',
      args: [
        { kind: 'literal', data: 1 },
        { kind: 'var', path: ['x'] },
        { kind: 'assign', path: ['y'], value: { kind: 'literal', data: 2 } },
      ],
    },
  ])
})

test('pipe with array literal args', ({ t }) => {
  var ops = operator('=hello', 'world |> replace 1,2,3')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        {
          kind: 'literal',
          data: [
            { kind: 'literal', data: 1 },
            { kind: 'literal', data: 2 },
            { kind: 'literal', data: 3 },
          ],
        },
      ],
    },
  ])
})

test('pipe with array args containing var', ({ t }) => {
  var ops = operator('=hello', 'world |> replace $n,2,3')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        {
          kind: 'literal',
          data: [
            { kind: 'var', path: ['n'] },
            { kind: 'literal', data: 2 },
            { kind: 'literal', data: 3 },
          ],
        },
      ],
    },
  ])
})

test('pipe with array args containing assignment elements', ({ t }) => {
  var ops = operator('=hello', 'world |> replace a=1,b=2')
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')
  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        {
          kind: 'literal',
          data: [
            {
              kind: 'assign',
              path: ['a'],
              value: { kind: 'literal', data: 1 },
            },
            {
              kind: 'assign',
              path: ['b'],
              value: { kind: 'literal', data: 2 },
            },
          ],
        },
      ],
    },
  ])
})

// --- destructuring ---

test('destructure array - 2 elements', ({ t }) => {
  var ops = operator('=a,b', '$list')
  t.equal(ops.length, 2)
  t.equal(ops[0].path, 'a')
  t.deepEqual(ops[0].value.path, ['list', 0])
  t.equal(ops[1].path, 'b')
  t.deepEqual(ops[1].value.path, ['list', 1])
})

test('destructure array - 3 elements', ({ t }) => {
  var ops = operator('=a,b,c', '$list')
  t.equal(ops.length, 3)
  t.equal(ops[0].path, 'a')
  t.deepEqual(ops[0].value.path, ['list', 0])
  t.equal(ops[1].path, 'b')
  t.deepEqual(ops[1].value.path, ['list', 1])
  t.equal(ops[2].path, 'c')
  t.deepEqual(ops[2].value.path, ['list', 2])
})

// --- dynamic keys ---

test('dynamic object key from var', ({ t }) => {
  var ops = operator('=hello', { $dyn: 'world' })
  var op = ops[0]
  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data.key.kind, 'var')
  t.deepEqual(op.value.data.key.path, ['dyn'])
  t.equal(op.value.data.value.kind, 'literal')
  t.equal(op.value.data.value.data, 'world')
})

test('dynamic object key and value with complex var path', ({ t }) => {
  var ops = operator('=obj', { '$hello.bye[2]': '$world[5]' })
  var op = ops[0]

  t.equal(op.type, 'assign')
  t.equal(op.path, 'obj')
  t.equal(op.value.kind, 'literal')

  var keyNode = op.value.data.key
  var valNode = op.value.data.value

  t.equal(keyNode.kind, 'var')
  t.deepEqual(keyNode.path, ['hello', 'bye', 2])

  t.equal(valNode.kind, 'var')
  t.deepEqual(valNode.path, ['world', 5])
})

test('pipe with assignment arg using complex var paths', ({ t }) => {
  var ops = operator('=hello', 'world |> replace $hello.bye[2]=$world[5]')
  var op = ops[0]

  t.equal(op.type, 'assign')
  t.equal(op.path, 'hello')
  t.equal(op.value.kind, 'literal')
  t.equal(op.value.data, 'world')

  t.deepEqual(op.value.pipes, [
    {
      name: 'replace',
      args: [
        {
          kind: 'assign',
          path: [{ kind: 'var', path: ['hello', 'bye', 2] }],
          value: { kind: 'var', path: ['world', 5] },
        },
      ],
    },
  ])
})
