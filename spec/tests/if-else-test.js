const weblang = require('../../index.js')

it('should work with value if', async ({ t }) => {
  const state = await weblang()([
    '$hello: 1',
    '@if:',
    '  $hello: 1',
    '@then:',
    '  $hello: 2'
  ].join('\n'))
  t.ok(state.vars.hello == 2)
})

it('should work with object if', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
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
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '  $req:',
    '    pathname:',
    '      eq: /hello',
    '@then:',
    '  $hello.name: hans'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hans')
})

it('should work with if dot notation', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello.name.eq: nils',
    '@then:',
    '  $hello.name: hans'
  ].join('\n'))
  t.ok(state.vars.hello.name == 'hans')
})

it('should work with else', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: hans',
    '@then:',
    '  $hello.name: guri',
    '@else:',
    '  $hello.name: kari'
  ].join('\n'))

  t.ok(state.vars.hello.name == 'kari')
})

it('should support double if', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  $hello.name: guri',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: guri',
    '@then:',
    '  $hello.name: sol'
  ].join('\n'))

  t.ok(state.vars.hello.name == 'sol')
})

it('should support double if with else', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  $hello.name: guri',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: hans',
    '@then:',
    '  $hello.name: sol',
    '@else:',
    '  $hello.name: maane'
  ].join('\n'))

  t.ok(state.vars.hello.name == 'maane')
})

it('should support nested if', async ({ t }) => {
  const state = await weblang()([
    '$hello:',
    '  name: nils',
    '@if:',
    '  $hello:',
    '    name:',
    '      eq: nils',
    '@then:',
    '  $hello.name: guri',
    '  @if:',
    '    $hello:',
    '      name:',
    '        eq: guri',
    '  @then:',
    '    $hello.name: sol'
  ].join('\n'))

  t.ok(state.vars.hello.name == 'sol')
})
