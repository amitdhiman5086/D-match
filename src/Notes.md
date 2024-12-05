# My Notes on Versioning in package.json

This document explains the difference between `~` and `^` in package.json version numbers in simple terms.

## ~ (Tilde)
- **Allows patch-level changes**
- Only updates the last number in the version
- **Example:** `~1.2.3` allows updates to `1.2.4`, `1.2.5`, etc., but not to `1.3.0`
- Good for bug fixes while keeping things stable