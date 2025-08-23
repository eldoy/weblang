var expand = require('../../lib/expand.js')

test('no match', ({ t }) => {
  var state = {
    vars: {},
  }
  var result = expand(state, '$hello')
  t.equal(result, '')
})

test('escaped', ({ t }) => {
  var state = {
    vars: {},
  }
  var result = expand(state, '\\$hello')
  t.equal(result, '$hello')
})

test('escaped multi', ({ t }) => {
  var state = {
    vars: {},
  }
  var result = expand(state, 'what \\$hello \\$bye')
  t.equal(result, 'what $hello $bye')
})

test('escaped multi mix', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, 'what $hello \\$bye why')
  t.equal(result, 'what world $bye why')
})

test('value', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, '$hello')
  t.equal(result, 'world')
})

test('value - multiple occurrences', ({ t }) => {
  var state = {
    vars: { hello: 'world', bye: 'moon' },
  }
  var result = expand(state, 'say $hello and then $bye')
  t.equal(result, 'say world and then moon')
})

test('value - adjacent occurrences', ({ t }) => {
  var state = {
    vars: { x: '1', y: '2' },
  }
  var result = expand(state, '$x$y')
  t.equal(result, '12')
})

test('array - empty', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [])
  t.deepEqual(result, [])
})

test('array - no match', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [1, 2])
  t.deepEqual(result, [1, 2])
})

test('array - replace', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [1, '$hello'])
  t.deepEqual(result, [1, 'world'])
})

test('object - key', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { $hello: 'a' })
  t.deepEqual(result, { world: 'a' })
})

test('object - value', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { a: '$hello' })
  t.deepEqual(result, { a: 'world' })
})

test('object - deep', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { a: { b: '$hello' } })
  t.deepEqual(result, {
    a: { b: 'world' },
  })
})
