const matcher = /#([a-z0-9]{24})/

// Extract key, name and id
module.exports = function parse(str) {
  let id = ''
  const match = str.match(matcher)
  if (match) {
    str = str.replace(match[0], '')
    id = match[1]
  }
  const [key, ext = ''] = str.trim().split('@')
  return [key, ext, id]
}
