# Schema rules — Page builder project

> Read this before creating or modifying any Sanity schema in this project.

## The constraint we're designing around

Sanity's Content Lake has an **attribute limit** — the total number of unique path + datatype combinations across your entire dataset. Free plans get 2,000; Growth gets 10,000. Every unique path (e.g. `sections[].heading`, `sections[].items[].title`) counts once regardless of how many documents use it. Paths only count when they hold actual content, not just from schema definitions.

You can check your current count at any time:

```
https://<projectId>.api.sanity.io/v1/data/stats/<datasetName>
```

Look at `fields.count.value` (current) and `fields.count.limit` (cap).

---

## Rules for creating new components

### 1. Check the shared object registry first

Before adding any field to a new section component, check if an existing shared object already covers what you need:

| Shared object    | Fields                          | Use when you need…                        |
|------------------|---------------------------------|-------------------------------------------|
| `textItem`       | `title` (string) + `body` (text)| Any repeating title + description pair     |
| `mediaItem`      | `image` + `alt` + `caption`     | Any image with metadata                    |
| `detailRow`      | `label` + `value`               | Any key-value property pair                |
| `linkObject`     | `label` + type + ref/url        | Any internal or external link              |
| `simpleBlockContent` | Portable Text (H2, H3, bold, italic, link, blockquote, lists) | Any body text that needs basic formatting |

**If your field matches one of these patterns, use the shared type. Do not create a new one.**

If you genuinely need a new shared object (e.g. a "video embed" with `url` + `thumbnail` + `caption`), add it to `schemas/objects/shared/` and update this table.

### 2. Use arrays, not Portable Text, for page structure

The `page.sections` array is the page builder. Each section type is a typed object in that array. **Never** add section components as custom block types inside a Portable Text field — that nests every field under Portable Text's deep internal structure (`block → children → spans → marks → markDefs`) and multiplies your attribute paths.

Portable Text is for **body copy within a section** (paragraphs with bold/links), not for page composition.

### 3. Keep sections flat — max 2 levels of nesting

A section should have its own fields plus, at most, one array of sub-objects:

```
✅ Good: section → items[] → { title, body }           (2 levels)
✅ Good: section → cards[] → { image, subtitle, title } (2 levels)
❌ Bad:  section → tabs[] → { panels[] → { blocks[] → { … } } }  (4 levels)
```

If a design demands deeper nesting, rethink it as multiple simpler sections or use references to separate documents.

### 4. No presentation fields in schemas

Do not add fields for:
- Background colours, text colours, or gradients
- Column counts, padding, margins, or gap sizes
- Font sizes, weights, or font family choices
- CSS class names or layout variants like "left-aligned" vs "centered"
- "Show/hide" toggles for visual elements

All layout and styling decisions belong in your Next.js components. If a component needs visual variants (e.g. light vs dark theme), handle it through a single `variant` string field with a controlled list of options — not through individual CSS property fields.

```ts
// ✅ Acceptable — a semantic variant, not a CSS property
defineField({
  name: 'variant',
  type: 'string',
  options: { list: ['default', 'inverted'] },
})

// ❌ Not acceptable — presentation leaking into content
defineField({ name: 'backgroundColor', type: 'color' })
defineField({ name: 'columns', type: 'number' })
defineField({ name: 'paddingTop', type: 'string' })
```

### 5. Name fields consistently

Use these exact field names when the concept matches — this ensures paths are reused across components rather than creating new ones:

| Concept                | Field name      | Type              |
|------------------------|-----------------|-------------------|
| Main heading           | `heading`       | `string` or `text`|
| Section label/caption  | `label`         | `string`          |
| Intro paragraph        | `intro`         | `text`            |
| Body copy (rich)       | `body`          | `simpleBlockContent` |
| Repeating text blocks  | `items`         | `array` of `textItem` |
| Repeating images       | `images`        | `array` of `mediaItem` |
| Key-value properties   | `details`       | `array` of `detailRow` |
| Tag/category list      | `tags`          | `array` of `string` |

If you name a heading field `title` in one component and `heading` in another, those are two separate attribute paths. Pick one and stick with it.

### 6. Avoid Portable Text inside arrays of objects

This is the single biggest attribute multiplier. If you have:

```
sections[] → myComponent → richText (Portable Text)
```

That's fine — one level of Portable Text inside a section. But if you have:

```
sections[] → myComponent → items[] → description (Portable Text)
```

Now every Portable Text internal path (`block`, `children`, `spans`, `marks`, `markDefs`, `text`, `style`, `listItem`, `level`) gets a prefix for both the section and the item array. Use plain `text` fields inside array items wherever possible. Reserve `simpleBlockContent` for top-level body fields where editors genuinely need bold/links.

### 7. Don't create singleton page types — fold into `page`

If you need an "About" page and a "Contact" page with different sections, don't create `aboutPage` and `contactPage` document types with duplicated field structures. Use the single `page` document type and let editors compose each page differently using the sections array. This avoids duplicating every field path under a new document type prefix.

### 8. Clean up after yourself

If you remove a section type from the schema, also delete any existing documents/content that used it. Attribute paths only free up when **no content** exists on that path anywhere in the dataset. Orphaned content from deleted schema types still counts.

### 9. Localisation: duplicate documents, not fields

If you add multi-language support, do **not** wrap fields inside language objects (`{ en: { title: "…" }, fr: { title: "…" } }`). This multiplies every field by the number of languages. Instead, duplicate the document per language and add a `language` field to filter by. The paths stay the same across all language versions.

---

## Design reference files

HTML reference files (used during component development) should **never** be committed to the repo. They contain `<script>` tags and other dev-only code that causes React errors in production.

**Add to `.gitignore`:**
```
**/._design-refs/
**/*.html
```

**Workflow:**
1. Create the HTML reference file locally in `frontend/_design-refs/[component-name].html`
2. Use it while building the component
3. Delete it before committing — or just use the gitignore and never commit it

---

## Component wrapper pattern for block types

Every page builder block requires two files that follow a strict pattern to avoid render failures:

1. **Wrapper component** (`[ComponentName]Block.tsx`): Receives the raw block from the page builder
2. **Main component** (`[ComponentName].tsx`): Receives the block prop and destructures fields from it

### Pattern — do not deviate

**Wrapper:**
```tsx
import MyComponent from '@/app/components/MyComponent'

type MyComponentBlockProps = {
  block: any
}

export default function MyComponentBlock({ block }: MyComponentBlockProps) {
  return <MyComponent block={block} />
}
```

**Main component:**
```tsx
type MyComponentProps = {
  block: {
    heading?: string
    items?: Array<{ title?: string; body?: string }>
  }
}

export default function MyComponent({ block }: MyComponentProps) {
  const { heading, items } = block
  // ... rest of component
}
```

**The critical part:** The main component MUST accept `block` as a single prop and destructure fields from it, **not** spread fields at the top level. This ensures the wrapper can pass the entire block object without modification.

---

## Checklist for new components

Before submitting a PR that adds a new section type:

- [ ] Checked the shared object table — reusing existing types where applicable
- [ ] Section is a flat `object` type registered in `page.sections` array
- [ ] No nesting deeper than 2 levels (section → array → object)
- [ ] No Portable Text inside array items (use plain `text` instead)
- [ ] No presentation/styling fields (colours, sizes, spacing, classes)
- [ ] Field names match the naming conventions table above
- [ ] Preview configured with `prepare()` so editors can identify sections
- [ ] Icon assigned from `@sanity/icons` for the insert menu
- [ ] Updated this README's shared object table if a new shared type was added
- [ ] Tested attribute impact by checking the stats endpoint before and after adding content
- [ ] **Block components ONLY:** Main component accepts `block` prop (not spread fields) and destructures fields from it; wrapper passes the entire block unchanged
- [ ] **Design references:** Deleted all HTML reference files from repo (use gitignore, never commit them)

---

## Current attribute estimate

With all 10 section types, 5 shared objects, and the page document, this project uses approximately **120–180 attributes**. That leaves substantial headroom on the Free plan (2,000) for blog posts, site settings, navigation, and future components.
