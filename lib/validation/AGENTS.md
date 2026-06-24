# Validation

## Schema Rules

- Zod schemas validate form input at the UI boundary.
- Validation messages should be i18n keys from `validationKeys`, not rendered English/Spanish strings.
- Reuse shared schemas from `common.ts` for names, positive numbers, ISO dates, and units.

## Domain Boundaries

- Validation prevents bad form submissions, but domain modules still enforce critical invariants such as compatible units and positive quantities.
- Do not encode user-facing formatting decisions in schemas.

## Forms

- Keep schema output types aligned with repository input types where practical.
- When adding fields, update the matching form, translations, and tests together.
