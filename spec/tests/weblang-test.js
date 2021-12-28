const weblang = require('../../index.js')

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

it('should set variable with array object dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  - name: nils',
    '$bye: $hello[0].name'
  ].join('\n'))
  t.ok(state.vars.bye == 'nils')
})
