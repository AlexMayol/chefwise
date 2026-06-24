# Images

## Storage Contract

- SQLite stores only relative image paths like `images/products/<id>.jpg` and `images/recipes/<id>.jpg`.
- Use `buildEntityImagePath`, `assertRelativeImagePath`, and `resolveImageUri`; do not hand-roll path strings in UI.
- `saveEntityImage` copies from the picker source URI into the app document image directory.
- Create image directories before copying.

## Expo FileSystem

- Read Expo SDK 56 FileSystem docs before changing this module.
- With the SDK 56 `File` API, call `source.copy(destination)`, not destination-to-source.
- Guard document-directory access for web compatibility.

## Backup Interaction

- Backup export collects files under the relative `images/` tree.
- Backup import restores image files from a staged location and only then replaces current data.
