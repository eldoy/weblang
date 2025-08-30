function operator(key) {
  var [assigns, ext] = key.split('@').map((x) => x.trim())

  if (assigns) {
    assigns = assigns.split(',').map((x) => x.trim())
  } else {
    assigns = []
  }

  if (!ext) {
    ext = null
  }

  var bang = false

  if (ext && ext.endsWith('!')) {
    bang = true
    ext = ext.slice(0, -1)
  }

  if (!ext && assigns.length) {
    assigns = assigns[0] ? assigns.slice(0, 1) : []
  }

  return { assigns, ext, bang }
}

module.exports = operator
