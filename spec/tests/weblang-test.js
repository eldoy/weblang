const weblang = require('../../index.js')

/* SET *
 *******/

it('should set string variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: world'
  ].join('\n'))
  t.ok(state.vars.hello == 'world')
})

it('should set object variable', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  n: 0'
  ].join('\n'))
  t.ok(state.vars.hello.n == 0)
})

it('should set array variable', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - 1',
    '  - 2'
  ].join('\n'))
  t.ok(state.vars.hello[0] == 1)
  t.ok(state.vars.hello[1] == 2)
})

it('should set bool variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: true'
  ].join('\n'))
  t.ok(state.vars.hello === true)
})

it('should set variable from other variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: world',
    '$bye: $hello'
  ].join('\n'))
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye == 'world')
})

it('should set object value from other variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: world',
    '$bye:',
    '  name: $hello'
  ].join('\n'))
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye.name == 'world')
})

it('should set array index from other variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: world',
    '$bye:',
    '  - $hello'
  ].join('\n'))
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye[0] == 'world')
})

it('should set variable with object dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name:',
    '    deep: 1',
    '$bye: $hello.name.deep'
  ].join('\n'))
  t.ok(state.vars.bye == 1)
})

it('should set variable with array dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - 1',
    '  - 2',
    '$bye: $hello[0]'
  ].join('\n'))
  t.ok(state.vars.bye == 1)
})

it('should set object field variable, dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello.name: nils'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'nils')
})

it('should set object field variable deep, dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello.name.deep: nils'
  ].join('\n'))
  t.ok(state.vars.hello.name.deep == 'nils')
})

it('should update object field variable, dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello.name: nils',
    '$hello.name: kari'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'kari')
})

it('should set variable with array object dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - name: nils',
    '$bye: $hello[0].name'
  ].join('\n'))
  t.ok(state.vars.bye == 'nils')
})

it('should set empty string if variable does not exist', async ({ t }) => {
  const state = await weblang()([
    '$bye: $hello'
  ].join('\n'))
  t.ok(state.vars.bye == '')
})

it('should delete a variable', async ({ t }) => {
  const state = await weblang()([
    '$hello@1: world',
    '$hello@2: null'
  ].join('\n'))
  t.ok(typeof state.vars.hello == 'undefined')
})

it('should delete a value from object', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: world',
    '  email: a@world.no',
    '$hello.email: null'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'world')
  t.ok(typeof state.vars.hello.email == 'undefined')
})

it('should delete a value from object', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: world',
    '  email: a@world.no',
    '$hello.email: null'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'world')
  t.ok(typeof state.vars.hello.email == 'undefined')
})

it('should delete an array index', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - a',
    '  - b',
    '$hello[0]: null'
  ].join('\n'))
  t.ok(state.vars.hello.length == 1)
  t.ok(state.vars.hello[0] == 'b')
})

/* IF-THEN-ELSE *
*****************/

it('should work with simple if', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    'if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    'then:',
    '  $hello.name: hans'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hans')
})

it('should work with multiple if checks', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '$req:',
    '  pathname: /hello',
    'if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '  $req:',
    '    pathname:',
    '      eq: /hello',
    'then:',
    '  $hello.name: hans'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hans')
})

it('should work with if dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    'if:',
    '  $hello.name.eq: nils',
    'then:',
    '  $hello.name: hans'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hans')
})

it('should work with else', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    'if:',
    '  $hello:',
    '    name:',
    '      eq: hans',
    'then:',
    '  $hello.name: guri',
    'else:',
    '  $hello.name: kari'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'kari')
})

/* RETURN *
***********/

it('should return a string', async ({ t }) => {
  const state = await weblang()([
    'return: hello'
  ].join('\n'))
  t.ok(state.return == 'hello')
})

it('should return a string variable', async ({ t }) => {
  const state = await weblang()([
    '$hello: world',
    'return: $hello'
  ].join('\n'))
  t.ok(state.return == 'world')
})

it('should return an object variable', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: world',
    'return: $hello'
  ].join('\n'))
  t.ok(state.return.name == 'world')
})

it('should return an array variable', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - 1',
    '  - 2',
    'return: $hello'
  ].join('\n'))
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a variable dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name:',
    '    baner: 1',
    'return: $hello.name'
  ].join('\n'))
  t.ok(state.return.baner == 1)
})

/* VARS *
*********/

it('should support custom vars', async ({ t }) => {
  const req = { pathname: '/hello' }
  const state = await weblang({
    vars: { req }
  })([
    '$req.pathname: /bye',
    'return: $req.pathname'
  ].join('\n'))
  t.ok(req.pathname == '/bye')
  t.ok(state.return == '/bye')
})

/* PIPES *
**********/

it('should support pipes with set', async ({ t }) => {
  const state = await weblang()([
    '$hello: hello | upcase'
  ].join('\n'))
  t.ok(state.vars.hello == 'HELLO')
})

it('should support pipes with set variables', async ({ t }) => {
  const state = await weblang()([
    '$hello: hello',
    '$bye: $hello | upcase'
  ].join('\n'))
  t.ok(state.vars.hello == 'hello')
  t.ok(state.vars.bye == 'HELLO')
})

it('should support pipes with return', async ({ t }) => {
  const state = await weblang()([
    'return: hello | upcase'
  ].join('\n'))
  t.ok(state.return == 'HELLO')
})

it('should strip pipes with return', async ({ t }) => {
  const state = await weblang()([
    'return: hello | unknown'
  ].join('\n'))
  t.ok(state.return == 'hello')
})

it('should work with multiple pipes', async ({ t }) => {
  const state = await weblang()([
    'return: hello | upcase | downcase | capitalize'
  ].join('\n'))
  t.ok(state.return == 'Hello')
})

/* EXTENSIONS *
*************/

const db = function({ state, key, val, set, get }) {
  set('$internal', 'hello')
  return { id: '1' }
}

it('should support custom extensions', async ({ t }) => {
  const state = await weblang({
    ext: { db }
  })([
    'db: user/create'
  ].join('\n'))
  t.ok(state.vars.internal == 'hello')
})

it('should set variable with extensions', async ({ t }) => {
  const state = await weblang({
    ext: { db }
  })([
    'db$result: user/create',
    'return: $result'
  ].join('\n'))
  t.ok(state.vars.result.id == '1')
  t.ok(state.return.id == '1')
})