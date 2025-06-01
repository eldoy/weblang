## 🌐 Weblang HTML Rendering

Weblang can express full HTML pages using function syntax, making server-rendered HTML composable, programmable, and secure.

---

### ✅ Basic HTML Tags

Each HTML element is represented as a function:

```yaml
@div:
  class: wrapper
  id: main
  @h1: Welcome
  @p: Hello, world!
```

---

### ✅ Text Content

Use inline strings or `@text:` explicitly:

```yaml
@p: This is inline text

@button:
  type: submit
  @text: Save
```

---

### ✅ Attributes

Attributes are passed as key-value pairs alongside the tag:

```yaml
@input:
  type: text
  placeholder: Enter name
  name: username
```

---

### ✅ Conditional Rendering

Use `@if` with optional `@then` and `@else`:

```yaml
@if:
  $user.isLoggedIn.eq: true
@then:
  @p: Welcome back!
@else:
  @p: Please log in.
```

---

### ✅ Loops with `@map`

Weblang supports mapping arrays without special syntax:

```yaml
@ul:
  @map:
    $products:
      @li: "$item.name – $item.price"
```

Variables `$item` and `$index` are available inside the loop automatically.

---

### ✅ Nested HTML in Loop

```yaml
@ul:
  @map:
    $products:
      @li:
        @span: "#$index. $item.name"
        @b: "$item.price"
        @if:
          $item.stock.eq: 0
        @then:
          @em: Out of stock
```

---

### ✅ Template Inclusion

Render shared templates:

```yaml
@render: header
@render: footer
```

Templates are just Weblang files, merged at runtime with access to global variables.

---

### ✅ Summary

Weblang HTML syntax:

* Is fully YAML-compatible
* Avoids angle brackets and tags
* Keeps logic and markup unified
* Works with `@if`, `@map`, and `@render`
* Uses `$item`, `$index` automatically inside loops
* Supports string interpolation in tag content

---

Beautiful, composable, and logic-aware HTML — the Weblang way.
