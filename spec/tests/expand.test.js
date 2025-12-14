var expand = require('../../lib/expand.js')

test('plain string', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, 'hello')
  t.equal(result, 'hello')
})

test('no match', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, '$hello')
  t.equal(result, '')
})

test('escaped', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, '\\$hello')
  t.equal(result, '$hello')
})

test('escaped multi', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, 'what \\$hello \\$bye')
  t.equal(result, 'what $hello $bye')
})

test('escaped multi mix', ({ t }) => {
  var state = {
    vars: { hello: 'world' }
  }
  var result = expand(state, 'what $hello \\$bye why')
  t.equal(result, 'what world $bye why')
})

test('string', ({ t }) => {
  var state = {
    vars: { hello: 'world' }
  }
  var result = expand(state, '$hello')
  t.equal(result, 'world')
})

test('string - multiple', ({ t }) => {
  var state = {
    vars: { hello: 'world', bye: 'moon' }
  }
  var result = expand(state, 'say $hello and then $bye')
  t.equal(result, 'say world and then moon')
})

test('string - adjacent', ({ t }) => {
  var state = {
    vars: { x: '1', y: '2' }
  }
  var result = expand(state, '$x$y')
  t.equal(result, '12')
})

test('array', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, [1, 2, 3])
  t.deepEqual(result, [1, 2, 3])
})

test('object', ({ t }) => {
  var state = {
    vars: {}
  }
  var result = expand(state, { hello: 'world' })
  t.deepEqual(result, { hello: 'world' })
})
