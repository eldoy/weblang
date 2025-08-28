function operator(key) {
  var [assigns, ext] = key.split('@').map((x) => x.trim())
  var bang = false

  if (ext) {
    bang = ext.endsWith('!')
    if (bang) ext = ext.slice(0, -1)
  } else {
    ext = null
  }

  if (assigns) {
    assigns = assigns.split(',').map((x) => x.trim())
    if (assigns[0] == '') {
      assigns = ext == null ? [] : assigns.slice(1)
    }
    if (ext == null) {
      assigns = [assigns[0]]
    }
    assigns = assigns.filter(Boolean)
  } else {
    assigns = []
  }

  return { assigns, ext, bang }
}

module.exports = operator
