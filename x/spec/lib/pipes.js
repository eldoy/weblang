var pipes = {}

pipes.upcase = function ({ val }) {
  if (typeof val != 'string') return val
  return val.toUpperCase()
}

pipes.downcase = function ({ val }) {
  if (typeof val != 'string') return val
  return val.toLowerCase()
}

pipes.capitalize = function ({ val }) {
  if (typeof val != 'string') return val
  return val[0].toUpperCase() + val.slice(1)
}

pipes.join = function ({ val, params = {} }) {
  if (!Array.isArray(val)) return val
  params.delimiter = params.delimiter || ','
  return val.join(params.delimiter)
}

pipes.concat = function ({ val, params = {} }) {
  return val + ' ' + params.a
}

module.exports = pipes
