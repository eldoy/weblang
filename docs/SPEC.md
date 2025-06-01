# Weblang Specification

## Overview

Weblang is a minimal, safe, portable, and declarative scripting language designed for executing logic in a controlled and structured environment. It uses YAML (or JSON) as its primary syntax format, allowing both human readability and machine interoperability. Weblang is intended for server-side logic execution with strict control over logic, data flow, and function invocation.

---

## 1. Syntax Fundamentals

### 1.1 Assignment

All assignments begin with `=` and assign a value or function result to a variable:

```yaml
=var: value
```

### 1.2 Function Invocation

Functions are prefixed with `@` and may return a value:

```yaml
=result@function_name: args
```

### 1.3 Variables

Variables are accessed using `$`:

```yaml
=copy: $var
```

---

## 2. Structure

### 2.1 Top-Level Format

Weblang programs are structured as a sequence of YAML nodes executed in order:

```yaml
=message: Hello world!
@log: $message
```

### 2.2 Conditional Logic

```yaml
@if:
  $value:
    eq: 1
@then:
  @log: Equal to one
@else:
  @log: Not equal
```

---

## 3. Data Types

* String
* Number (integer, float)
* Boolean
* Null
* Object (map)
* Array (list)

---

## 4. Functions

### 4.1 Assignment Functions

```yaml
=variable@function: args
```

### 4.2 Standalone Functions

```yaml
@function: args
```

### 4.3 Pipes

Values can be transformed via pipes:

```yaml
=result: $input | upcase | trim
```

---

## 5. Control Flow

### 5.1 if/then/else

Supports basic branching:

```yaml
@if:
  $age:
    gt: 18
@then:
  @return: Welcome
@else:
  @return: Denied
```

### 5.2 return / yield / noop

```yaml
@noop
@yield
@return: result
```

---

## 6. Error Handling

* All core functions may throw an error.
* Functions that do not throw are explicitly documented.
* Errors are caught and stored in `$err` if not thrown.
* `@try`, `@catch`, `@finally` blocks may be added.

---

## 7. Security Model

* All logic executes in a sandbox.
* Only whitelisted functions can be called.
* RBAC (role-based access control) may restrict function access.

---

## 8. Extensibility

* All functions are user-definable.
* Functions follow a defined interface with access to state, variables, and parameters.
* Filters can be added or overridden.

---

## 9. Examples

### Insert and validate user

```yaml
@validate:
  $params.email:
    required: true
    is: email
  $params.name:
    required: true
    min: 2

=result@db_insert:
  collection: users
  values:
    email: $params.email
    name: $params.name

@if:
  $result.id:
    is: string
@then:
  @return:
    id: $result.id
@else:
  @return:
    error: Could not insert
```

---

## 10. Standard Library (Sample)

* `log`, `return`, `noop`, `yield`
* `math_add`, `math_subtract`, `math_multiply`, etc.
* `string_upper`, `string_trim`, `string_split`, etc.
* `array_length`, `array_sort`, `array_unique`, etc.
* `validate`, `is_string`, `is_email`, etc.
* `fetch`, `db_insert`, `auth_login`, `jwt_encode`

---

## 11. Formats

* Default: YAML
* Optional: JSON / JSON5 / HJSON (read-only)

---

## 12. Execution

* Engines may be implemented in any language
* Execution state includes `vars`, `return`, and `err`
* Pure functions are deterministic and context-isolated

---

## 13. Reserved Prefixes

* `=`: Assignment
* `@`: Function call
* `$`: Variable lookup

---

## 14. Conventions

* Functions use snake\_case
* Logic flows top-down
* Structure is minimal and readable

---

## 15. Licensing

MIT — use, extend, and embed freely
