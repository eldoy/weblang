var func = {}

func.parseName = function (name) {
  var mustCatch = name?.includes('?') ?? false
  var mustReturn = name?.includes('!') ?? false

  if (!name) return { fnName: '', mustCatch, mustReturn }

  var match = name.match(/^@?([a-zA-Z]+)([?!]{0,2})$/)
  if (!match) {
    throw new Error(
      'Function name must be: @name, @name?, @name!, @name?!, or @name!?'
    )
  }

  var fnName = match[1]
  return { fnName, mustCatch, mustReturn }
}

func.executeFn = async function ({ fn, parsed, val, ...args }) {
  var fnName = parsed.fnName
  var mustCatch = parsed.mustCatch
  var mustReturn = parsed.mustReturn

  var keyParts =
    args.key
      ?.slice(1)
      .split(',')
      .map((p) => p.trim()) ?? []
  var firstKey = keyParts[0] ?? null
  var secondKey = keyParts[1] ?? null

  if (keyParts.length > 2) {
    throw new Error(
      `Functions cannot be assigned more than 2 variables on "@${fnName}"`
    )
  }

  if (firstKey && firstKey === secondKey) {
    throw new Error(
      `Function cannot have duplicate variable names on "@${fnName}"`
    )
  }

  var fnReturnsTuple = false
  var fnThrowsError = false
  var result = null
  var err = null

  try {
    var fnReturn = await fn({ ...args, val })
    fnReturnsTuple = Array.isArray(fnReturn) && fnReturn.length === 2
    if (fnReturnsTuple) {
      result = fnReturn[0]
      err = fnReturn[1]
    }
  } catch (error) {
    fnThrowsError = true
    err = { message: error?.message ?? null, code: args.code }

    if (process.env.NODE_ENV !== 'test') {
      console.log(`Error on @${fnName}: ${err.message}`)
    }
  } finally {
    if (!fnReturnsTuple && !fnThrowsError) {
      throw new Error(
        `Function extensions must return a tuple (not found on "@${fnName}")`
      )
    }

    if (firstKey) args.set(firstKey, result ?? null)
    if (secondKey) args.set(secondKey, err ?? null)

    if (mustCatch) {
      args.set('result', result ?? null)
      args.set('err', err ?? null)
    }

    if (mustReturn && err) {
      await args.config.ext.return({ ...args, val: err })
    }
  }
}

module.exports = func
