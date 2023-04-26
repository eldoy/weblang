const pipes = {}

pipes.upcase = function(str) {
  if (typeof str != 'string') return str
  return str.toUpperCase()
}

pipes.downcase = function(str) {
  if (typeof str != 'string') return str
  return str.toLowerCase()
}

pipes.capitalize = function(str) {
  if (typeof str != 'string') return str
  return str[0].toUpperCase() + str.slice(1)
}

module.exports = pipes
