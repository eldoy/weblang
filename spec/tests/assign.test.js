var assign = require('../../lib/assign.js')

test('single', ({ t }) => {
  var state = {
    vars: {},
  }
  assign(state, 'hello', 'world')
  t.equal(state.vars.hello, 'world')
})

test('multi', ({ t }) => {
  var state = {
    vars: {},
  }
  assign(state, 'a,b,c', [1, 2])
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, undefined)
})

test('multi with spaces trimmed', ({ t }) => {
  var state = { vars: {} }
  assign(state, ' a ,  b , c  ', [1, 2])
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, undefined)
})

test('multi non-array value broadcast', ({ t }) => {
  var state = { vars: {} }
  assign(state, 'x,y,z', 'v')
  t.equal(state.vars.x, 'v')
  t.equal(state.vars.y, 'v')
  t.equal(state.vars.z, 'v')
})

test('multi array longer than names ignores extras', ({ t }) => {
  var state = { vars: {} }
  assign(state, 'a,b', [10, 20, 30])
  t.equal(state.vars.a, 10)
  t.equal(state.vars.b, 20)
  t.equal(state.vars.c, undefined)
})

test('empty assigns is no-op (only commas)', ({ t }) => {
  var state = { vars: { q: 1 } }
  assign(state, ' , , ', [1, 2])
  t.equal(state.vars.q, 1)
  t.equal(Object.keys(state.vars).length, 1)
})

test('duplicate names: last wins', ({ t }) => {
  var state = { vars: {} }
  assign(state, 'a,a,b', [1, 2])
  t.equal(state.vars.a, 2)
  t.equal(state.vars.b, undefined)
})

test('sparse array preserves holes as undefined', ({ t }) => {
  var state = { vars: {} }
  var arr = []
  arr[0] = 7
  arr[2] = 9
  assign(state, 'm,n,o', arr)
  t.equal(state.vars.m, 7)
  t.equal(state.vars.n, undefined)
  t.equal(state.vars.o, 9)
})

test('single - undefined and null pass through', ({ t }) => {
  var state = { vars: {} }
  assign(state, 'u', undefined)
  assign(state, 'n', null)
  t.equal(state.vars.u, undefined)
  t.equal(state.vars.n, null)
})

test('assigns as array coerced to string', ({ t }) => {
  var state = { vars: {} }
  assign(state, ['p', 'q'], [1, 2])
  t.equal(state.vars.p, 1)
  t.equal(state.vars.q, 2)
})

test('skips empty names inside list', ({ t }) => {
  var state = { vars: {} }
  assign(state, 'a,,c', [1, 2])
  t.equal(state.vars.a, 1)
  t.equal(state.vars.c, 2)
  t.equal(state.vars[''], undefined)
})

test('overwrites existing vars', ({ t }) => {
  var state = { vars: { a: 0, b: 0 } }
  assign(state, 'a,b', [5])
  t.equal(state.vars.a, 5)
  t.equal(state.vars.b, undefined)
})
