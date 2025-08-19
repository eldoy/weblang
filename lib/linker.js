function linker(ast) {
  if (!Array.isArray(ast) || !ast.length) {
    return []
  }

  for (var i = 0; i < ast.length; i++) {
    var node = ast[i]
    node.index = i
    node.siblings = ast
    node.next = ast[i + 1] || null
    node.previous = ast[i - 1] || null

    if (node.children.length) {
      linker(node.children)
    }
  }

  return ast
}

module.exports = linker
