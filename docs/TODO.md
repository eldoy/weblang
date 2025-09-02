# TODO

- [ ] Test dotted and indexed variable
  - assign
  - expand

- [ ] Parallel processing (mode async)

- [ ] Create Binary Runner and compiler
- [ ] Docs
- [ ] Merge and release

- [ ] Prevent expand if not needed
  For "each", for example, we pass $numbers, which gets expanded. It should not need to get expanded. We could simplify this by passing args without dollar.

  Same goes for @delete and @if. So the rule becomes that we use $ only when it needs expansion.


- [ ] Create a replacer function that sets up replacements on the node.value:

```js
replacements: [
  [ ["hello","world"], [ "what is ", ["hello"], " going" ] ],
  [ ["bye"], [ "see you ", ["user","name"] ] ]
]
```

- [ ] Update expand to `var data = expand(state, node)`

```js
for (let [path, parts] of replacements) {
  let s = ''
  for (let p of parts) {
    s += Array.isArray(p) ? get(p) : p
  }
  set(path, s)
}
```

- [ ] Expand should support objects, arrays, keys and values
  - could this be part of the replacers?
  - or does it go in assign?

  Support expanding arrays and object keys as well:

  [$hello, 2, 3]

  $hello: something

  and any kind of variant of this:

  $hello: [$bye, 2, 3]

  this should also work with dot-lookup:

  =hello.world: $t.projects[5].title

=hello@set:


- [ ] Switch node.data and node.value meaning?
  - value is the unexpanded
  - data is the expanded
  - isn't the opposite more intuitive?
