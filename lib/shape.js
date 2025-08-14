function shape(tree) {
  var key = Object.keys(tree)[0]
  var value = tree[key]
  var match = key.match(/^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)_ID_$/)
  if (!match) return null

  var [, prefix, rawKeyPart, concurrencyFlag, block, line, occurrence] = match
  var rawKey = prefix === '@' ? prefix + rawKeyPart : rawKeyPart
  var concurrency = concurrencyFlag === 'a' ? 'async' : 'sync'
  var result = {
    id: `${concurrencyFlag}-${block}-${line}-${occurrence}`,
    key: rawKey,
    value: value,
    level: parseInt(line, 10),
    block: parseInt(block, 10),
    line: parseInt(line, 10),
    occurrence: parseInt(occurrence, 10),
    path: '',
    concurrency: concurrency,
    type: 'assign',
    parent: null,
    next: null,
    previous: null,
    children: [],
    attributes: [],
    group: [],
    index: 0,
    siblings: [],
  }
  result.siblings.push(result)
  return result
}

module.exports = shape
