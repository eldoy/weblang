# Refactor

- [√] Feature tests instead of file tests
  - build
  - expand
  - parse
- [√] Move core to ext.js
- [√] Move parse into build
- [√] Move build into expand
- [ ] Move expand into index

- [ ] Split into pure function files?
- [ ] Export every single file?
  - might require we do weblang.init({}) instead

- [ ] No need for pipes data, just replace val in-place

- [ ] Get rid of node and leaf
  - they are really key and val?
  - expand key with undot
  - expand val with vars
  - expand val with pipes
  - expand val with renderers
  - expand val with extensions
  - write val to state

# TODO

- [ ] Need to send all of the ext stuff into pipes and renderers as well
  - Need big refactor?
  - Everything in one file?
  - Everything into one object?

- [ ] Rename renderer to something shorter
  - transformers
  - morphs
  - traps
  - tweaks
  - converters
  - doors

- [ ] Ext, renderers and pipes must be async

- [ ] Update documentation with new features
- [ ] Add examples of use / what's possible

