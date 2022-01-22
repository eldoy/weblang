# Immutable, does not change other variable on change
# Expand means applying vars (immutable) and pipes
# Set and get must always expand before read and write
# Pipes disappear, only piped value is set and get
# Setter is only used when extension returns value
# Create if it doesn't exist, overwrite if exists
# Expand expands inside objects as well
# Full dot notation

* Support literal '$' with \$?
* More default pipes? Better pipes? (support arrays and objects)
  - Object.keys
  - Object.values
  - Array.filter
  - Array.find
  - Array.map
  - Array.slice
  - Array.splice?
  - Date pipe?
  - mutate with pipename! (exclamation mark)
* More default functions? (log)
* Error handling, display name of function that failed?
* Error function passed to extension? Same for log?
* When passing code, specify type?
  - object (don't preprocess)
  - json (string, not yaml)
  - yaml (default for string)
  - or always convert to yaml first?
    - might need auto
