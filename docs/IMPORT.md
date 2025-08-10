You can import functions with @import:

@import: file.w
@import: https://weblang.org/file.w

Or with options:

@import: {
  name: file
  url: file.w
}

Then immediately call it:

@file: {}


Imported external files will be cached on disk unless you use the cache: false option:

@import: { name: file, url: file.w, cache: false }
