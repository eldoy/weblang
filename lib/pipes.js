const pipes = {}

pipes.upcase = function(str) {
  if (typeof str != 'string') {
    return str
  }
  return str.toUpperCase()
}

module.exports = pipes
