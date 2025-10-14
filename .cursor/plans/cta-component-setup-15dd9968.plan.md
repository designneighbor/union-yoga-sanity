<!-- 15dd9968-2ad1-4290-8de7-5ff62c42cfb5 f1ba29c4-389b-4149-8883-81badc5e1eba -->
# Create Call to Action Component

## Files to Create

### 1. Component File

**Create:** `src/components/blocks/CallToAction.tsx`

- React component with TypeScript
- Props: title (string), text (blockContent), button (object with text/url/newTab), image (optional Sanity image)
- Layout: Full-width section with neutral-100 background (bg-neutral-100), two-column grid with text left and image right
- Image handling: Conditional rendering - if no image, text content takes full width
- Responsive: Stack vertically on mobile (image below text), side-by-side on lg breakpoint
- WCAG compliance: 
  - Semantic HTML with proper heading hierarchy (h2 for title)
  - Sufficient color contrast (primary-950 text on neutral-100 background)
  - Focus visible states on button
  - Proper link attributes with aria-labels if needed
- Styling: Container padding (px-4 sm:px-6 md:px-8 xl:px-10 py-12), rounded images, primary button variant

### 2. Schema Type File

**Create:** `src/sanity/schemaTypes/blocks/callToActionType.ts`

- Define Sanity schema type "callToAction"
- Fields:
  - title (string, required)
  - text (blockContent, required)
  - button (object with text/url/newTab fields)
  - image (image type with hotspot: true, optional)
- Button validation: Allow relative URLs with scheme validation
- Icon: Use `BlockContentIcon` from @sanity/icons
- Preview: Display title as main text, "Call to Action" as subtitle, image as thumbnail

## Files to Update

### 3. Schema Index

**Update:** `src/sanity/schemaTypes/index.ts`

```typescript
import { callToActionType } from "./blocks/callToActionType";
```

Add `callToActionType` to the types array (after splitImageType)

### 4. Page Builder Type

**Update:** `src/sanity/schemaTypes/pageBuilderType.ts`

Add to the pageBuilder array:

```typescript
defineArrayMember({ type: "callToAction" })
```

### 5. PageBuilder Component

**Update:** `src/components/PageBuilder.tsx`

- Import: `import { CallToAction } from "@/components/blocks/CallToAction"`
- Add switch case:
```typescript
case "callToAction":
  return <CallToAction key={block._key} {...block} />;
```


## Preview Image

Using existing `splitImage.png` as temporary preview image for Sanity Studio grid view. User will create custom preview image later.

## Implementation Details

**Component Layout:**

```
<section> [neutral-100 bg, full width]
  <div> [container with padding]
    <div> [grid: 1 col mobile, 2 cols lg+]
      <div> [text content - left column]
        <h2>Title</h2>
        <PortableText>Content</PortableText>
        <Button>CTA</Button>
      </div>
      {image && (
        <div> [image - right column]
          <Image />
        </div>
      )}
    </div>
  </div>
</section>
```

**Responsive Typography:**

- Title: text-3xl md:text-4xl lg:text-5xl
- Text: text-lg sm:text-xl lg:text-2xl
- Spacing: mb-4 between title and text, mt-6 for button

**Image Specifications:**

- Next.js Image component with width={944} height={600}
- Object-cover with rounded-md corners
- Optimized with quality={80}, dpr={2}, auto="format"
- Responsive sizes attribute

**Color Palette (from globals.css):**

- Background: bg-neutral-100 (#f8f6f3)
- Text: text-primary-950 (#001d21)
- Button: primary variant (uses secondary-700 #cf3904)