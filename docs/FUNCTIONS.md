### ✅ **Core & Safe (Always Enabled)**

#### 🔁 Logic & Flow (`@`)

* `if` @
* `then` @
* `else` @
* `return` @
* `yield` @
* `noop` @

---

#### 🔢 Math

* `math_add` ✅ both
* `math_subtract` ✅ both
* `math_multiply` ✅ both
* `math_divide` ✅ both
* `math_mod` ✅ both
* `math_round` ✅ both
* `math_floor` ✅ both
* `math_ceil` ✅ both
* `math_abs` ✅ both
* `math_random` @
* `math_max` ✅ both
* `math_min` ✅ both

---

#### 🔤 Strings

* `string_concat` ✅ both
* `string_split` ✅ both
* `string_join` ✅ both
* `string_replace` ✅ both
* `string_trim` ✅ both
* `string_slice` ✅ both
* `string_lower` ✅ both
* `string_upper` ✅ both
* `string_capitalize` ✅ both
* `string_starts_with` ✅ both
* `string_ends_with` ✅ both
* `string_match` ✅ both
* `string_length` ✅ both

---

#### 🧱 Arrays

* `array_length` ✅ both
* `array_push` @
* `array_pop` @
* `array_shift` @
* `array_unshift` @
* `array_sort` ✅ both
* `array_filter` @
* `array_map` @
* `array_find` ✅ both
* `array_join` ✅ both
* `array_slice` ✅ both
* `array_merge` ✅ both
* `array_unique` ✅ both

---

#### 🧾 Objects

* `object_keys` ✅ both
* `object_values` ✅ both
* `object_merge` ✅ both
* `object_clone` ✅ both
* `object_get` ✅ both
* `object_set` @
* `object_has` ✅ both

---

#### ✅ Validation / Type Checks

* `validate` @
* `is_string`, `is_number`, `is_boolean`, `is_array`, `is_object`, `is_date`, `is_email`, `is_url`, `is_id`, `is_null`, `is_undefined` ✅ both
* `typeof` ✅ both

---

#### ⏱ Dates

* `date_now` @
* `date_parse` ✅ both
* `date_format` ✅ both
* `date_diff` ✅ both
* `date_add` ✅ both
* `date_subtract` ✅ both

---

#### 🛠 Utility

* `log` @
* `sleep` @
* `debug` @
* `uuid` @
* `cuid` @

---

#### 🔧 Casting

* `<int>`, `<float>`, `<string>`, `<boolean>`, `<json>`, `<date>`, `<object>` ✅ all are filters

---

### 🔐 **Privileged / RBAC Controlled**

#### 🌐 Network

* `fetch` @
* `fetch_json` @
* `url_encode`, `url_decode` ✅ both

---

#### 💾 Filesystem

* `fs_read`, `fs_write`, `fs_exists`, `fs_delete`, `fs_mkdir`, `fs_stat` @

---

#### 🔐 Auth & Crypto

* `auth_login`, `auth_verify`, `auth_role`, `auth_token` @
* `hash_sha256` ✅ both
* `jwt_encode`, `jwt_decode` ✅ both
* `crypto_random` @

---

✅ = usable as both `@func:` and as a filter
@ = only callable (side effects, async, etc.)

