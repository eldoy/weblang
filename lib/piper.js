function piper(val) {
  var [input, ...rest] = val.split('|>').map((s) => s.trim())
  var pipes = rest.map((part) => {
    var [name, ...args] = part.split(/\s+/)
    var parsedArgs = []

    if (args.length) {
      var str = args.join(' ')

      // object form: a=1 b=2
      if (/=/.test(str) && !/,/.test(str)) {
        var obj = {}
        args.forEach((arg) => {
          var [k, v] = arg.split('=')
          if (/^\d+$/.test(v)) v = Number(v)
          else if (v === 'true') v = true
          else if (v === 'false') v = false
          obj[k] = v
        })
        parsedArgs.push(obj)
      }
      // array form: 1,2,3
      else if (/,/.test(str)) {
        parsedArgs.push(
          str.split(',').map((x) => {
            if (/^\d+$/.test(x)) return Number(x)
            if (x === 'true') return true
            if (x === 'false') return false
            return x
          }),
        )
      }
      // single value
      else {
        var v = str
        if (/^\d+$/.test(v)) v = Number(v)
        else if (v === 'true') v = true
        else if (v === 'false') v = false
        parsedArgs.push(v)
      }
    }

    return { name, ...(parsedArgs.length ? { args: parsedArgs } : {}) }
  })

  return [input, pipes]
}

module.exports = piper
