# Navigation Config

## Tabs

- `tabs.ts` is the only source for bottom-tab membership, order, icons, and translation keys.
- Keep tab names aligned with Expo Router route files under `app/(tabs)/`.
- Add matching i18n keys when adding or renaming tabs.

## Screen Headers

- The native tab header is intentionally hidden. Screen files render their own in-page titles.
