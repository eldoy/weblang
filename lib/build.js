function build(irt, shape = () => {}) {
  for (var key in irt) {
    irt[key] = shape(irt[key])
  }
  return irt
}

module.exports = build
