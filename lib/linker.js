function linker(ast) {
  if (!Array.isArray(ast) || !ast.length) {
    return []
  }

  for (var node of ast) {
    node.parent ||= null
    node.children ||= []

    if (node.children.length > 0) {
      var children = node.children

      for (var i = 0; i < children.length; i++) {
        var child = children[i]

        child.siblings = children
        child.index = i
        child.previous = children[i - 1] || null
        child.next = children[i + 1] || null

        linker([child])
      }
    }

    if (!node.siblings) node.siblings = []
    if (node.index === undefined) node.index = 0
    if (node.previous === undefined) node.previous = null
    if (node.next === undefined) node.next = null
  }

  return ast
}

module.exports = linker
