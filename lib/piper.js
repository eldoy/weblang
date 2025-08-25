function piper(str) {
  var [head, ...pipeParts] = str.split('|>').map((s) => s.trim())
  return {
    head,
    pipes: pipeParts.map((expr) => {
      var [name, ...argsRaw] = expr.split(/\s+/).filter(Boolean)
      return { name, argsRaw }
    }),
  }
}

module.exports = piper
