function clean(obj) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] == 'object') {
      clean(obj[key])
    } else {
      const newKey = key.split('@')[0]
      obj[newKey] = obj[key]
      delete obj[key]
    }
  }
}

const obj = {
  'hello@1': 1,
  'hello@2': 2
}

clean(obj)

console.log({ obj })