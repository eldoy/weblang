# TODO

- [ ] Scope for children nodes

- [ ] Tests for dot-notation in run.test.js
  - func dot                       @db.insert: {}
  - assign index access            =result: hello[0]
  - assign indirect index access   =result: $hello[0]
  - assign dot access              =result: $hello.name

- [ ] Parallel processing: [@func1, @func2, @func3]

- [ ] Test ok.js with dot notation

- [ ] Test dot notation on functions: @db.insert -> @insert or @db_insert
  - add to shape.js as subfunction?

- [ ] Need a CLI that runs weblang

- [ ] Implement core extensions
  - [ ] @if
  - [ ] @else
  - [ ] @each
  - [ ] @return
  - [ ] @delete
