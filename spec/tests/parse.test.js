var weblang = require('../../index.js')

test('work with value if', async ({ t }) => {
  var code = ['=hello: 1', '@if:', '  $hello: 1', '@then:', '  =hello: 2'].join(
    '\n',
  )
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello == 2)
})

test('work with object if', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  =hello.name: hans',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'hans')
})

test('work with multiple if checks', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '=req:',
    '  pathname: /hello',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '  $req:',
    '    pathname:',
    '      eq: /hello',
    '@then:',
    '  =hello.name: hans',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'hans')
})

test('work with if dot notation', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello.name.eq: nils',
    '@then:',
    '  =hello.name: hans',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'hans')
})

test('work with else', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: hans',
    '@then:',
    '  =hello.name: guri',
    '@else:',
    '  =hello.name: kari',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'kari')
})

test('support double if', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  =hello.name: guri',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: guri',
    '@then:',
    '  =hello.name: sol',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'sol')
})

test('support double if with else', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  =hello.name: guri',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: hans',
    '@then:',
    '  =hello.name: sol',
    '@else:',
    '  =hello.name: maane',
  ].join('\n')
  var state = await weblang.init().run(code)

  t.ok(state.vars.hello.name == 'maane')
})

test('support nested if', async ({ t }) => {
  var code = [
    '=hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  =hello.name: guri',
    '  @if:',
    '    $hello:',
    '      name:',
    '        eq: guri',
    '  @then:',
    '    =hello.name: sol',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.vars.hello.name == 'sol')
})
