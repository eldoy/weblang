const weblang = require('../../index.js')

it('should set number variable', async ({ t }) => {
  const code = [
    '=hello: 1'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello == 1)
})

it('should set string variable', async ({ t }) => {
  const code = [
    '=hello: world'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello == 'world')
})

it('should set object variable', async ({ t }) => {
  const code = [
    '=hello:',
    '  n: 0'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.n == 0)
})

it('should set array variable', async ({ t }) => {
  const code = [
    '=hello:',
    '  - 1',
    '  - 2'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello[0] == 1)
  t.ok(state.vars.hello[1] == 2)
})

it('should set bool variable', async ({ t }) => {
  const code = [
    '=hello: true'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello === true)
})

it('should set variable from other variable', async ({ t }) => {
  const code = [
    '=hello: world',
    '=bye: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye == 'world')
})

it('should set object value from other variable', async ({ t }) => {
  const code = [
    '=hello: world',
    '=bye:',
    '  name: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye.name == 'world')
})

it('should set array index from other variable', async ({ t }) => {
  const code = [
    '=hello: world',
    '=bye:',
    '  - $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello == 'world')
  t.ok(state.vars.bye[0] == 'world')
})

it('should set array index inline', async ({ t }) => {
  const code = [
    '=hello: [1, 2, 3]',
    '=hello[0]: 4'
  ].join('\n')

  const state = await weblang.init().run(code)
  t.ok(state.vars.hello[0] == 4)
})

it('should set variable with object dot notation', async ({ t }) => {
  const code = [
    '=hello:',
    '  name:',
    '    deep: 1',
    '=bye: $hello.name.deep'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.bye == 1)
})

it('should set variable with array dot notation', async ({ t }) => {
  const code = [
    '=hello:',
    '  - 1',
    '  - 2',
    '=bye: $hello[0]'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.bye == 1)
})

it('should set object field variable, dot notation', async ({ t }) => {
  const code = [
    '=hello.name: nils'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'nils')
})

it('should set object field variable deep, dot notation', async ({ t }) => {
  const code = [
    '=hello.name.deep: nils'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name.deep == 'nils')
})

it('should update object field variable, dot notation', async ({ t }) => {
  const code = [
    '=hello.name: nils',
    '=hello.name: kari'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'kari')
})

it('should set variable with array object dot notation', async ({ t }) => {
  const code = [
    '=hello:',
    '  - name: nils',
    '=bye: $hello[0].name'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.bye == 'nils')
})

it('should set to undefined if variable does not exist', async ({ t }) => {
  const code = [
    '=bye: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(typeof state.vars.bye == 'undefined')
})

it('should delete a variable', async ({ t }) => {
  const code = [
    '=hello: world',
    '=hello: null'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(typeof state.vars.hello == 'undefined')
})

it('should delete a value from object', async ({ t }) => {
  const code = [
    '=hello:',
    '  name: world',
    '  email: a@world.no',
    '=hello.email: null'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'world')
  t.ok(typeof state.vars.hello.email == 'undefined')
})

it('should delete a value from object', async ({ t }) => {
  const code = [
    '=hello:',
    '  name: world',
    '  email: a@world.no',
    '=hello.email: null'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'world')
  t.ok(typeof state.vars.hello.email == 'undefined')
})

it('should delete an array index', async ({ t }) => {
  const code = [
    '=hello:',
    '  - a',
    '  - b',
    '=hello[0]: null'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.length == 1)
  t.ok(state.vars.hello[0] == 'b')
})

it('should not mutate existing var', async ({ t }) => {
  const code = [
    '=hello:',
    '  name: nisse',
    '=bye: $hello',
    '=bye.name: baner'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'nisse')
  t.ok(state.vars.bye.name == 'baner')
})

it('should overwrite duplicate keys', async ({ t }) => {
  const code = [
    '=hello:',
    '  name: nisse',
    '  name: alv'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'alv')
})

it('should allow set object on same dotted key with if', async ({ t }) => {
  const code = [
    '@if:',
    '  $translation:',
    '    is: undefined',
    '@then:',
    '  =translation.key: eq',
    '  =translation.value: must'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.translation.key == 'eq')
  t.ok(state.vars.translation.value == 'must')
})

it('should set object with many keys', async ({ t }) => {
  const code = [
    '=translation:',
    '  id: 1234',
    '  name: hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.translation.id == 1234)
  t.ok(state.vars.translation.name == 'hello')
})

it('should merge objects', async ({ t }) => {
  const code = [
    '=translation:',
    '  id: 1234',
    '=translation:',
    '  name: hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.translation.id === 1234)
  t.ok(state.vars.translation.name == 'hello')
})

it('should reset objects', async ({ t }) => {
  const code = [
    '=translation:',
    '  data:',
    '    a: 1',
    '=translation:',
    '  data:',
    '    a: null'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.translation.data.a === undefined)
})

it('should reset objects deeply', async ({ t }) => {
  const code = [
    '=translation:',
    '  data:',
    '=translation: null',
    '=translation:',
    '  name: hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.vars.translation.id === undefined)
  t.ok(state.vars.translation.name == 'hello')
})