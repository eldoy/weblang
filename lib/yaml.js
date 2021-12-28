const yaml = require('js-yaml')

module.exports = function(code) {

  // Add unique identifier for each key to allow duplicate keys
  let count = 0
  code = code
    .replace(/\t/g, '  ')
    // .split('\n').map(line => {
    //  return line.replace(/(^.+):/, `$1@${count++}:`)
    //})
    // .join('\n')

  return yaml.load(code)
}
