# Current flow

- init
  - run
    - execute
      - compile
      - run
        - parse
        - expand
        - set

index.js file has a run function, and inside of execute there is also a run function...

# New flow

var weblang = require('weblang')
var tree = weblang.compile(source, opt)
var state = weblang.run(tree)

This allows us to run a cached tree directly without compile.

# Strategy

- Start with compile.test.js, it contains most of the functions.
  - Compile needs a better id for @=$
    - type (get set func)
    - line number
    - level
    - parent (id)
    - block number?
    - siblings?
    - next?
    - previous?
    - children?
    - maintain a separate id map to go directly to node?
    - or a "db" of nodes which is searchable? (array find)
    - we want to be able to say:
      - error in file
      - node signature (@db)
      - line number of yaml
  - Ext should not have access to run?
  - Simplify what is sent to ext

- Map each function to a test

- `run` mostly just runs extensions
- `result.test.js` is like `render.test.js`, the general integration tests

- [x] Rename parse to extract
- [x] Rename compile to parse
- [x] Create new function compile (based on execute?)

- Built in extensions
  # logic
  - if
  - elsif
  - else
  - then
  - each
  - delete
  - return

  # files
  - import?
  - read?
  - write?
  - stream?

  # terminal
  - list
  - move
  - copy

  # converters
  - tojson


`then` should act as promise then to await all promise-based functions:

```yaml
@stream: https://example.com/file.json
@then:
  # do something
```
