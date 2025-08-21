function column(line, col = 0) {
  var index = line.indexOf('=')
  if (index > col) col = index

  index = line.indexOf('@', col)
  if (index > col) col = index

  return col + 1
}

module.exports = column
