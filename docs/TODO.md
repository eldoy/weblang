# TODO

Keep a bare minimum right now for v1:

- [ ] Remove "ok" changes. Add late.
- [ ] Remove dotted stuff, except for assign?

Syntax tweaks for HTML:

- [ ] esc all tags except @div! (bang), both string and "text" attribute
- [ ] add newline or space to all tags (preseve indentation)
  @span: a
  @span: b

  now renders as <span>a</span><span>b</span> (ab, not a b)

  - [ ] except - (dash) in front: - @div

- [ ] Rename sync / async to "dashed" / "bare"
  - it means sync / async for functions
  - but spaced / squashed for tags
  - "d" and "b" for dashed and bare

- [ ] Rename .html internally to "markup"? or "tags"
  - dashed functions are "tag functions"

- [ ] Test if else with dotted variable
  - $hello.name.eq: nils

- [ ] Test dotted and indexed variable
  - assign
  - expand

- [ ] Parallel processing (mode async)

- [ ] Create Binary Runner and compiler
- [ ] Docs

- [ ] Prevent expand if not needed
  For "each", for example, we pass $numbers, which gets expanded. It should not need to get expanded. We could simplify this by passing args without dollar.

  Same goes for @delete and @if. So the rule becomes that we use $ only when it needs expansion.

- [ ] Update expand to return data
  - `var data = expand(state, node)`

- [ ] Create a replacer function that sets up replacements on the node.value:

```js
replacements: [
  [ ["hello","world"], [ "what is ", ["hello"], " going" ] ],
  [ ["bye"], [ "see you ", ["user","name"] ] ]
]

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

- [ ] @elsif - ext.elsif?

- [ ] @if - empty array is false?
  - or how do we do it? .length?
  - or =arrayLength@len: $array
  - should we support something more advanced here?
  - include a bunch of ext?
