var func = {}

func.parseName = function (name) {
  var mustCatch = false
  var mustReturn = false

  if (!name) return { fnName: '', mustCatch, mustReturn }

  var match = name.match(/^@?([a-zA-Z]+)([?!]{0,2})$/)

  if (!match) {
    throw new Error(
      'Function name must be: @name, @name?, @name!, @name?!, or @name!?'
    )
  }

  var fnName = match[1]
  var modifiers = match[2].split('')

  for (var char of modifiers) {
    if (char === '?') mustCatch = true
    if (char === '!') mustReturn = true
  }

  return { fnName, mustCatch, mustReturn }
}

func.executeFn = async function ({ fn, parsed, val, ...args }) {
  // get name and marks from @name?!
  var { fnName, mustCatch, mustReturn } = parsed

  var fnReturnsTuple = false
  var fnThrowsError = false

  var result = null
  var err = null

  // get vars assigned on =a,b@name
  var keyParts =
    args.key
      .slice(1)
      .split(',')
      .map((p) => p.trim() ?? null) ?? []

  var firstKey = keyParts?.[0] ?? null
  var secondKey = keyParts?.[1] ?? null

  if (keyParts.length > 2) {
    var errMessage = `Functions cannot be assigned more than 2 variables on "@${fnName}"`
    throw new Error(errMessage)
  }

  if (firstKey === secondKey) {
    var errMessage = `Function cannot have duplicate variable names on "@${fnName}"`
    throw new Error(errMessage)
  }

  // executes function
  try {
    var fnReturn = await fn({ ...args, val })
    fnReturnsTuple = Array.isArray(fnReturn) && fnReturn.length === 2

    if (fnReturnsTuple) {
      result = fnReturn[0]
      err = fnReturn[1]
    }
  } catch (error) {
    var message = error?.message ?? null
    err = { message, code: args.code }

    fnThrowsError = true

    if (process.env.NODE_ENV !== 'test') {
      console.log(`Error on @${fnName}: ${message}`)
    }
  } finally {
    if (!fnReturnsTuple && !fnThrowsError) {
      var errMessage = `Function extentions must return a tuple (not found on "@${fnName}")`
      throw new Error(errMessage)
    }

    // handle =a,b@func
    if (keyParts.length !== 0 && firstKey !== '') {
      if (firstKey) args.set(firstKey, result ?? null)
      if (secondKey) args.set(secondKey, err ?? null)
    }

    // handle @func?
    if (mustCatch) {
      args.set('result', result ?? null)
      args.set('err', err ?? null)
    }

    // handle @func!
    if (mustReturn && err) {
      var returnExt = args.config.ext.return
      await returnExt({ ...args, val: err })
    }
  }
}

module.exports = func
