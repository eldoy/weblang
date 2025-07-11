var weblang = require('../../index.js')
var { sum, log } = require('../lib/ext.js')

function sumError() {
  throw new Error('throwed error')
}

var sumErrResult = sum({
  current: { a: 1 },
  get: () => {}
})[1]

var errResult = (code) => ({
  message: 'throwed error',
  code
})

// 1. test functions with different marks

test('should throw error:   @func{', async ({ t }) => {
  var codes = [
    ['@sum{:', ' a: 2', ' b: 3'],
    ['@sum[:', ' a: 2', ' b: 3']
  ]

  for (var codeLines of codes) {
    var code = codeLines.join('\n')
    var hasError = false

    await weblang
      .init({ ext: { sum } })
      .run(code)
      .catch(() => (hasError = true))

    t.equal(hasError, true)
  }
})

test('should be silent:     @func', async ({ t }) => {
  // Sum returns a value
  var code = ['@sum:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, { vars: {} })

  // Sum returns an error
  var code = ['@sum:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, { vars: {} })
})

test('should assign vars:   @func?', async ({ t }) => {
  // Sum returns a value
  var code = ['@sum?:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      result: 5,
      err: null
    }
  })

  // Sum returns an error
  var code = ['@sum?:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      result: null,
      err: sumErrResult
    }
  })

  // Sum throws an error
  var code = ['@sum?:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    vars: {
      result: null,
      err: errResult(code)
    }
  })
})

test('should return error:  @func!', async ({ t }) => {
  // Sum returns a value
  var code = ['@sum!:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, { vars: {} })

  // Sum returns an error
  var code = ['@sum!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: sumErrResult,
    vars: {}
  })

  // Sum throws an error
  var code = ['@sum!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    return: errResult(code),
    vars: {}
  })
})

test('should assign/return: @func?!', async ({ t }) => {
  // Sum returns a value
  var code = ['@sum?!:', ' a: 2', ' b: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: 'late',
    vars: {
      result: 5,
      err: null
    }
  })

  // Sum returns an error
  var code = ['@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: sumErrResult,
    vars: {
      result: null,
      err: sumErrResult
    }
  })

  // Sum throws an error
  var code = ['@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    return: errResult(code),
    vars: {
      result: null,
      err: errResult(code)
    }
  })
})

// 2. Test functions explicitly assigning vars

test('should assign, be silent:   =a,b@func', async ({ t }) => {
  // Sum returns a value
  var code = ['=var1,var2@sum:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: 5,
      var2: null
    }
  })

  // Sum returns an error
  var code = ['=var1,var2@sum:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: null,
      var2: sumErrResult
    }
  })
})

test('should assign twice:        =a,b@func?', async ({ t }) => {
  // Sum returns a value
  var code = ['=var1,var2@sum?:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: 5,
      result: 5,
      var2: null,
      err: null
    }
  })

  // Sum returns an error
  var code = ['=var1,var2@sum?:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: null,
      result: null,
      var2: sumErrResult,
      err: sumErrResult
    }
  })

  // Sum throws an error
  var code = ['=var1,var2@sum?:', ' a: 2', ' c: 3'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: null,
      result: null,
      var2: errResult(code),
      err: errResult(code)
    }
  })
})

test('should assgn,return error:  =a,b@func!', async ({ t }) => {
  // Sum returns a value
  var code = ['=var1,var2@sum!:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: 5,
      var2: null
    }
  })

  // Sum returns an error
  var code = ['=var1,var2@sum!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: sumErrResult,
    vars: {
      var1: null,
      var2: sumErrResult
    }
  })

  // Sum throws an error
  var code = ['=var1,var2@sum!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    return: errResult(code),
    vars: {
      var1: null,
      var2: errResult(code)
    }
  })
})

test('should assign twice,return: =a,b@func?!', async ({ t }) => {
  // Sum returns a value
  var code = ['=var1,var2@sum?!:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      var1: 5,
      var2: null,
      result: 5,
      err: null
    }
  })

  // Sum returns an error
  var code = ['=var1,var2@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: sumErrResult,
    vars: {
      var1: null,
      var2: sumErrResult,
      result: null,
      err: sumErrResult
    }
  })

  // Sum throws an error
  var code = ['=var1,var2@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    return: errResult(code),
    vars: {
      var1: null,
      var2: errResult(code),
      result: null,
      err: errResult(code)
    }
  })
})

test('should assign twice,return: =result,err@func?!', async ({ t }) => {
  // Sum returns a value
  var code = ['=result,err@sum?!:', ' a: 2', ' b: 3'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    vars: {
      result: 5,
      err: null
    }
  })

  // Sum returns an error
  // prettier-ignore
  var code = ['=result,err@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum } }).run(code)

  t.deepEqual(state, {
    return: sumErrResult,
    vars: {
      result: null,
      err: sumErrResult
    }
  })

  // Sum throws an error
  // prettier-ignore
  var code = ['=result,err@sum?!:', ' a: 2', ' c: 3', '@return: late'].join('\n')
  var state = await weblang.init({ ext: { sum: sumError } }).run(code)

  t.deepEqual(state, {
    return: errResult(code),
    vars: {
      result: null,
      err: errResult(code)
    }
  })
})
