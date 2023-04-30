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

pipes.join = function(arr, opt = {}) {
  if (!Array.isArray(arr)) return arr
  opt.delimiter = opt.delimiter || ','
  return arr.join(opt.delimiter)
}

pipes.concat = function(str, opt = {}) {
  return str + ' ' + opt.a
}

module.exports = pipes
