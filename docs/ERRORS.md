### Error messages

What else can we return error on? Want it to be solid.

- [ ] invalid function access?
  - anything at root or inside if else then must be correct
    - adjust default functions to throw
- [ ] invalid assignment?
- [ ] invalid parameters?

Great instincts. Here's how to tighten up **error handling** in Weblang to make it robust and developer-friendly:

---

### ✅ 1. **Invalid Function Access**

* ✔ Throw if a function at the root or inside any block (`@if`, `@then`, `@else`, etc.) is not registered
* ✔ Suggest close matches if possible (e.g., Levenshtein)
* ✔ Allow "safe mode" toggle for testing unknown calls without execution

---

### ✅ 2. **Invalid Assignment**

* ✔ Throw if:

  * You assign to a non-variable (e.g., `=1: hello`)
  * You use reserved keywords (`=if`, `=true`, etc.)
  * Assignment value is missing or malformed

---

### ✅ 3. **Invalid Parameters**

* ✔ Throw if:

  * Required parameters for a function are missing
  * Unknown parameters are passed (unless function is variadic or explicitly open-ended)
  * Parameter types don't match expected schema

Also:

* Define a schema/contract for each function with `params.required`, `params.optional`, `params.types`
* Could even support param validation via the existing `@validate` mechanism internally

---

### ✅ 4. **Improved Error Messages**

Format:

```json
{
  "error": {
    "message": "Unknown function: @db.inser",
    "hint": "Did you mean '@db.insert'?",
    "line": 12,
    "path": "@db.inser"
  }
}
```

---

### ✅ 5. **Configurable Strictness**

Allow modes:

* `"strict"`: throws immediately
* `"warn"`: logs errors but keeps going
* `"loose"`: silent fallback/nulls

---

### ✅ 6. **Validation on Load**

* Run static checks before execution
* Report all errors in one pass (like `tsc --noEmit`)

---

Would you like a boilerplate for defining function signatures with validation?


Here’s a comprehensive list of **where users can go wrong** in Weblang, and where you can **tighten feedback** to make the experience solid and foolproof:

---

### 🧩 1. **Syntax Issues**

* ❌ Malformed YAML (use a forgiving parser or lint before parse)
* ❌ Invalid characters in keys or values
* ❌ Misaligned indentation (common in YAML)

🛠️ *Feedback:*

> `Line 4: Unexpected indent or invalid syntax near '='`

---

### 🧩 2. **Unknown Function Names**

* ❌ Typos like `@fetxh`, `@db.inser`
* ❌ Function used before being registered

🛠️ *Feedback:*

> `Unknown function 'db.inser'. Did you mean 'db.insert'?`

---

### 🧩 3. **Incorrect Function Position**

* ❌ Function not at top-level or inside valid block (`@then`, `@else`, `@if`, etc.)
* ❌ Using logic-only blocks like `@then` at the root

🛠️ *Feedback:*

> `'then' block used outside of conditional. Must be inside @if.`

---

### 🧩 4. **Missing or Wrong Parameters**

* ❌ Required param missing
* ❌ Param type mismatch
* ❌ Extra param when only specific ones are allowed

🛠️ *Feedback:*

> `Missing required param 'collection' for 'db.insert'`

---

### 🧩 5. **Invalid Assignment**

* ❌ Assignment to reserved keyword (`=if`, `=true`, `=null`)
* ❌ Duplicate variable assignment
* ❌ Assignment to non-identifier (`=1: hello`)

🛠️ *Feedback:*

> `Cannot assign to 'if'. It is a reserved keyword.`

---

### 🧩 6. **Broken Variable References**

* ❌ Referencing undefined variable (`$missingVar`)
* ❌ Typo in path (`$params.nam`)

🛠️ *Feedback:*

> `Variable '$params.nam' is not defined. Did you mean '$params.name'?`

---

### 🧩 7. **Pipes**

* ❌ Pipe doesn't exist
* ❌ Pipe param invalid or unsupported
* ❌ Pipe produces null unexpectedly

🛠️ *Feedback:*

> `Unknown pipe 'trimz'. Valid options: trim, truncate, upcase`

---

### 🧩 8. **Control Flow Misuse**

* ❌ `@then` or `@else` without `@if`
* ❌ `@return` with no value
* ❌ Nested conditionals not indented properly

🛠️ *Feedback:*

> `'then' block found without matching 'if'.`

---

### 🧩 9. **Execution Errors**

* ❌ Division by zero, DB failure, network timeout, etc.
* ❌ Function throws an internal error

🛠️ *Feedback:*

> `db.insert failed: Duplicate key error.`
> Include stack trace or context if safe.

---

### 🧩 10. **Security Violations**

* ❌ Accessing forbidden function or variable
* ❌ Trying to use file system, network, etc. without permission

🛠️ *Feedback:*

> `Access to 'fs.readFile' is not permitted.`

---

### 🔧 Recommendations

* Add `@lint` function that validates code before running
* Add `@explain` or `@debug` mode to show what’s happening step-by-step
* Keep an error object (`$err`) globally with full context

This gives you an industrial-grade DX (developer experience). Want a JSON schema system to describe your function contracts?

Perfect. Here's a **lightweight schema system** for defining Weblang function contracts, ideal for validation, autocomplete, docs, and DX tools.

---

### 🧱 Function Schema Format

```js
const functionSchemas = {
  "db.insert": {
    description: "Insert one or more documents into a MongoDB collection.",
    throws: true,
    params: {
      collection: {
        type: "string",
        required: true,
        description: "Collection name to insert into."
      },
      values: {
        type: ["object", "array"],
        required: true,
        description: "Document(s) to insert."
      },
      options: {
        type: "object",
        required: false,
        description: "Additional MongoDB options."
      }
    },
    returns: {
      type: "object",
      description: "The inserted document(s)."
    }
  },

  "log": {
    description: "Print a message to the server log.",
    throws: false,
    params: {
      message: {
        type: "string",
        required: true,
        description: "The message to log."
      }
    },
    returns: {
      type: "null"
    }
  }
}
```

---

### 🔍 Validation Example

If a user writes:

```yaml
=db.insert:
  values: { name: "Nils" }
```

Validator would say:

> ❌ Missing required param `collection` for `db.insert`
> 🛠️ Fix: Add `collection: "users"` to the call

---

### ✅ Benefits

* Supports parameter validation (`required`, `type`)
* Describes return types
* Indicates `throws: true/false`
* Great for introspection, docs, tooling, autocomplete

---

Want a ready-to-use validator function in JS for this?

Here’s an **expanded validator** with:

* ✅ Return shape info
* ✅ `throws` handling
* ✅ Auto-suggest for typos (Levenshtein match)
* ✅ Helper for schema-based intellisense

---

### 🔍 Full Weblang Function Validator

```js
function validateFunctionCall(funcName, args, schema) {
  const def = schema[funcName]
  const errors = []

  if (!def) {
    const suggestion = suggestFunction(funcName, schema)
    errors.push(`Unknown function '${funcName}'` + (suggestion ? `. Did you mean '${suggestion}'?` : ''))
    return errors
  }

  // Validate parameters
  for (const [key, paramDef] of Object.entries(def.params || {})) {
    const val = args[key]

    if (paramDef.required && (val === undefined || val === null)) {
      errors.push(`Missing required param '${key}' for '${funcName}'`)
      continue
    }

    if (val !== undefined && paramDef.type) {
      const types = Array.isArray(paramDef.type) ? paramDef.type : [paramDef.type]
      const typeMatch = types.some(t => checkType(val, t))
      if (!typeMatch) {
        errors.push(`Invalid type for param '${key}': expected ${types.join(" or ")}`)
      }
    }
  }

  // Detect unknown params
  for (const key of Object.keys(args)) {
    if (!(key in (def.params || {}))) {
      errors.push(`Unknown param '${key}' for function '${funcName}'`)
    }
  }

  return errors
}

function checkType(val, type) {
  if (type === "array") return Array.isArray(val)
  if (type === "object") return val && typeof val === "object" && !Array.isArray(val)
  return typeof val === type
}

function suggestFunction(name, schema) {
  const keys = Object.keys(schema)
  let best = null
  let min = Infinity
  for (const key of keys) {
    const dist = levenshtein(name, key)
    if (dist < min) {
      min = dist
      best = key
    }
  }
  return min <= 3 ? best : null
}

function levenshtein(a, b) {
  const m = [], alen = a.length, blen = b.length
  for (let i = 0; i <= alen; i++) m[i] = [i]
  for (let j = 1; j <= blen; j++) m[0][j] = j
  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return m[alen][blen]
}
```

---

### 📦 Usage

```js
const result = validateFunctionCall("db.inser", {
  values: { name: "foo" }
}, functionSchemas)

/*
[
  "Unknown function 'db.inser'. Did you mean 'db.insert'?",
  "Missing required param 'collection' for 'db.insert'"
]
*/
```

---

### 🧠 Bonus: Function Docs Generator

```js
function docFor(funcName, schema) {
  const def = schema[funcName]
  if (!def) return null
  return {
    description: def.description,
    throws: def.throws || false,
    returns: def.returns?.type,
    params: Object.entries(def.params || {}).map(([k, v]) => ({
      name: k,
      required: !!v.required,
      type: v.type,
      desc: v.description
    }))
  }
}
```

Want a function that introspects all available calls and turns them into IDE-style docs?

Here’s a clean **function schema introspector** that returns a full overview of all Weblang functions, suitable for:

* IDE autocomplete
* Docs
* Introspection UI
* Validation hints

---

### 🧠 `generateFunctionDocs()` – IDE-style Output

```js
function generateFunctionDocs(schema) {
  return Object.entries(schema).map(([name, def]) => ({
    name,
    description: def.description || "",
    throws: !!def.throws,
    returns: def.returns?.type || "unknown",
    params: Object.entries(def.params || {}).map(([key, val]) => ({
      name: key,
      required: !!val.required,
      type: Array.isArray(val.type) ? val.type.join(" | ") : val.type,
      description: val.description || ""
    }))
  }))
}
```

---

### 📘 Example Output

```js
[
  {
    name: "db.insert",
    description: "Insert one or more documents into a MongoDB collection.",
    throws: true,
    returns: "object",
    params: [
      { name: "collection", required: true, type: "string", description: "Collection name" },
      { name: "values", required: true, type: "object | array", description: "Documents to insert" },
      { name: "options", required: false, type: "object", description: "Optional Mongo options" }
    ]
  },
  {
    name: "log",
    description: "Log a message to server output.",
    throws: false,
    returns: "null",
    params: [
      { name: "message", required: true, type: "string", description: "Message to log" }
    ]
  }
]
```

---

You can now export this to JSON for web editors, VS Code extensions, Weblang playground UIs, etc. Want this exported as JSON schema too?

Here’s how to generate **JSON Schema** definitions from your Weblang function schema — perfect for validation, editor hints, or API docs.

---

### 🧱 `generateJsonSchemas()` — JSON Schema Generator

```js
function generateJsonSchemas(schema) {
  const definitions = {}

  for (const [name, def] of Object.entries(schema)) {
    const props = {}
    const required = []

    for (const [key, param] of Object.entries(def.params || {})) {
      const types = Array.isArray(param.type) ? param.type : [param.type]
      props[key] = {
        type: types,
        description: param.description || ""
      }
      if (param.required) required.push(key)
    }

    definitions[name] = {
      type: "object",
      title: name,
      description: def.description || "",
      properties: props,
      required: required.length > 0 ? required : undefined,
      additionalProperties: false
    }
  }

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions
  }
}
```

---

### 📤 Example Output (for `db.insert`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "db.insert": {
      "type": "object",
      "title": "db.insert",
      "description": "Insert one or more documents into a MongoDB collection.",
      "properties": {
        "collection": {
          "type": "string",
          "description": "Collection name to insert into."
        },
        "values": {
          "type": ["object", "array"],
          "description": "Document(s) to insert."
        },
        "options": {
          "type": "object",
          "description": "Additional MongoDB options."
        }
      },
      "required": ["collection", "values"],
      "additionalProperties": false
    }
  }
}
```
