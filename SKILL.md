# Sanity schema skill

> Claude: read this file before creating or modifying any Sanity schema in this project.

## Context

This project uses Sanity as a headless CMS with a Next.js frontend. Pages are built using a **page builder pattern** — a typed array of section objects on the `page` document. The Sanity Content Lake has an attribute limit (unique path + datatype combinations) that we must stay under.

## Before writing any schema code

1. Read `schemas/SCHEMA_RULES.md` for the full set of project conventions.
2. Check `schemas/objects/shared/` for existing reusable types before creating new fields.
3. Review the existing section schemas in `schemas/objects/sections/` to understand the patterns in use.

## Shared objects available

| Type                 | Fields                     | Use for                          |
|----------------------|----------------------------|----------------------------------|
| `textItem`           | title, body                | Any repeating title + body pair  |
| `mediaItem`          | image, alt, caption        | Any image with metadata          |
| `detailRow`          | label, value               | Any key-value property pair      |
| `linkObject`         | label, linkType, ref/url   | Any internal or external link    |
| `simpleBlockContent` | Portable Text (basic)      | Body text needing bold/links     |

Always prefer these over creating new inline objects with the same field shapes.

## Hard rules

- New sections go in `schemas/objects/sections/` as `object` types and are added to the `page.sections` array
- Never use Portable Text as a page-building container — only for body copy within a section
- Never put Portable Text inside array items — use plain `text` fields there
- Never add presentation fields (colours, spacing, column counts, CSS classes)
- Max nesting: section → array → object (2 levels)
- Use consistent field names: `heading`, `label`, `intro`, `body`, `items`, `images`, `details`, `tags`
- Always include `icon` and `preview` on section types
- If a new shared object is needed, create it in `schemas/objects/shared/` and update SCHEMA_RULES.md

## When the user asks to add a new component

1. Identify what editable content fields the component needs (ignore all styling/layout)
2. Map those fields to existing shared types where possible
3. Write the schema following the patterns in the existing section files
4. Add it to the `page.sections` array in `pageType.ts`
5. Note any new shared objects created and suggest updating SCHEMA_RULES.md
