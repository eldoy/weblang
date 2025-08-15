var build = require('./build.js')

// Create a shaped object from a key and value, optionally linking to a parent
function createShapedKey(key, value, parent = null) {
  var match = key.match(/^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)_ID_$/)
  if (!match) return null

  var [, prefix, rawKeyPart, concurrencyFlag, block, line, occurrence] = match
  var rawKey = prefix === '@' ? prefix + rawKeyPart : rawKeyPart
  var concurrency = concurrencyFlag === 'a' ? 'async' : 'sync'
  var result = {
    id: `${concurrencyFlag}-${block}-${line}-${occurrence}`,
    key: rawKey,
    value: typeof value === 'string' ? value : '',
    level: parseInt(line, 10),
    block: parseInt(block, 10),
    line: parseInt(line, 10),
    occurrence: parseInt(occurrence, 10),
    path: '',
    concurrency: concurrency,
    type: 'assign',
    parent: parent,
    next: null,
    previous: null,
    children: [],
    attributes: [],
    group: [],
    index: 0,
    siblings: [],
  }

  // Self-reference in siblings array
  result.siblings.push(result)
  return result
}

function shape(node) {
  return build(node, (key, value) => {
    // Create root shaped object
    var shaped = createShapedKey(key, value)
    if (!shaped) return null

    var current = shaped
    var currentValue = value

    // Traverse nested @ keys iteratively
    while (typeof currentValue === 'object' && currentValue !== null) {
      var childKey = Object.keys(currentValue)[0]

      // If no more shaped keys, assign remaining object as value
      if (!childKey || !/^@/.test(childKey)) {
        current.value = currentValue
        break
      }

      var childValue = currentValue[childKey]
      var childShaped = createShapedKey(childKey, childValue, current)

      // Link parent and child
      current.children.push(childShaped)
      current = childShaped
      currentValue = childValue
    }

    // Assign value for leaf nodes
    if (typeof value === 'string') shaped.value = value

    return shaped
  })
}

module.exports = shape
