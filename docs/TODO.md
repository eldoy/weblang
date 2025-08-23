# TODO

See OPERATE.md:

- [ ] Adjust pipes args to { kind: "var", path: ["n"] }   // $n

- [ ] Create operator.test.js
  - add support for assigns
  - remove expand, or rename operator to expand (move to compile)

- [ ] Update execute to use node shape operators instead of value

--------------------

- [ ] Tests for dot-notation in run.test.js
  - func dot                       @db.insert: {}
  - assign index access            =result: hello[0]
  - assign indirect index access   =result: $hello[0]
  - assign dot access              =result: $hello.name

- [ ] Test ok.js with dot notation

- [ ] Test dot notation on functions: @db.insert -> @insert or @db_insert
  - add to shape.js as subfunction?

- [ ] Parallel processing: [@func1, @func2, @func3]

### CLI

- [ ] Need a CLI that runs weblang

### Website

- [ ] Design: black and white, nicer theme for code
- [ ] Blow up logo or new Logo?
