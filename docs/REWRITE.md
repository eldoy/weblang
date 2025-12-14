Here’s a compact, implementable core that meets your latest design:

### Constructs

* `@if: <predicate>` → `@then: <block>` → zero+ `@else: <block>`
* `@each:` arrays only

  ```yaml
  @each:
    source: $arr
    as: item        # required
    index: i        # optional
  @then: <block>    # runs once per element with $item, $i bound
  @else: <block>    # runs once if source length === 0
  ```
* `@entries:` objects only

  ```yaml
  @entries:
    source: $obj
    key: k          # required
    value: v        # required
  @then: <block>    # runs once per key with $k, $v bound
  @else: <block>    # runs once if no keys
  ```

### Variables, assignment, and transforms

* Assignment anywhere (top-level or inside objects): `=name@ext: <input>` or `=name: <value>`
* Inside objects, `=` entries are executed in document order before later keys consume them (runtime enforces ordered evaluation).
* No pipes.

### Scope model

* Internal state: `{ globals: {}, stack: [] }`
* `pushScope(frame)` on control open; `popScope()` on block end.
* Resolution order: top frame → parent frames (from top down) → globals.
* Assignment writes to top frame if present; otherwise to globals.

### Control-group consumption

* A control opener (`@if`, `@each`, `@entries`) consumes its immediately following sibling control keys until another opener or end-of-block.
* For `@if`: `(@if → @then) [@else]`
* For `@each/@entries`: `(@then) [@else]`

### Predicates (same validator set you already had)

`required, eq, ne, gt, lt, gte, lte, in, nin, length, min, max, match, is, isnt, …` (object form or dot-notation).

---

### Minimal executor skeleton (JS)

```js
function pushScope(s, f={}) { s.stack.push(f) }
function popScope(s)        { s.stack.pop() }
function getVar(s, k) {
  for (let i=s.stack.length-1; i>=0; i--) if (k in s.stack[i]) return s.stack[i][k]
  return s.globals[k]
}
function setVar(s, k, v) {
  if (s.stack.length) s.stack[s.stack.length-1][k] = v
  else s.globals[k] = v
}
```

---

### Example: DB → HTML (arrays) with inline transforms (no pipes)

```yaml
=data@db: user/list

=html@html:
  @div:
    class: header
    text: "User List"

  @each:
    source: $data
    as: user
    index: i
  @then:
    =displayName@upcase: $user.name
    @div:
      class: user
      text: "[$i] $displayName"
  @else:
    @div:
      class: empty
      text: "No users found"

@return: $html
```

### Example: Settings (objects)

```yaml
=settings@db: settings/get

=html@html:
  @div:
    class: header
    text: "Settings"

  @entries:
    source: $settings
    key: k
    value: v
  @then:
    =kv@formatSetting:
      key: $k
      value: $v
    @div:
      class: setting
      text: $kv
  @else:
    @div:
      class: empty
      text: "No settings"

@return: $html
```

### Example: `@if / @else`

```yaml
@if:
  $req.pathname:
    eq: /admin
@then:
  @div: { text: "Admin" }
@else:
  @div: { text: "Home" }
```

### Notes (succinct)

* No hidden `$.` scope. All bindings are explicit (`as/index` or `key/value`).
* `=` entries inside objects are allowed and ordered.
* Any extension may `pushScope` to expose locals to its children; children see parent frames automatically.
* This set (`@if/@else/@then`, `@each`, `@entries`, `=…@ext`) is functionally complete.
