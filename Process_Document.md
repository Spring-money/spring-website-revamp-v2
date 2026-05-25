# Spring Money RIA Partner Onboarding Process Guide

This document outlines the step-by-step process for onboarding new SEBI-registered Investment Advisors (RIAs) onto the Spring Money Advisor Marketplace. It serves as a standardized workflow reference for developers and content managers.

---

## Step 1: Add or Prepare Visual Assets (Advisor Photos)
Before modifying any configuration files, obtain high-quality, professional photographs of the new advisors.
1. Save the advisor's photo inside the public assets directory:
   - Path: `public/advisors/`
2. Rename the image to follow a clean, lowercase name-based hyphenated pattern:
   - Format: `[advisor-name].[extension]`
   - Examples: `palnika-hemnani.png`, `viral-parekh.jpg`
3. If no custom image is available, use the default placeholder SVG:
   - Path: `/advisors/placeholder.svg`

---

## Step 2: Register Advisor in the Unified Model
The unified data registry for advisors is located in `app/services/data/advisors.tsx`. Open this file and append a new advisor profile object at the end of the `advisors` array.

### Schema Fields Reference
Each advisor profile is defined as an `Advisor` interface with the following properties:

| Property Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The next sequential numerical ID (e.g., `"12"`, `"13"`). |
| `firmName` | `string` | The official name of the advisory firm. |
| `advisorName` | `string` | The principal advisor's full name. |
| `principalAdvisor`| `string` | Same as `advisorName`. |
| `reg` | `string` | Registration string: `"SEBI RIA REG NO: INAxxxxxxxx"` |
| `photo` | `string` | Public URL to the visual asset (e.g., `"/advisors/palnika-hemnani.png"`). |
| `location` | `Location` | Mapped to one of the strict types in `Location` (e.g., `"Delhi"`, `"Mumbai, Maharashtra"`). |
| `tagline` | `string` | A strong, reader-friendly one-liner tagline. |
| `specializations` | `Specialization[]` | Strict union array (e.g., `"Comprehensive Financial Planning"`, `"Retirement Planning"`). |
| `audience` | `AudienceType[]` | Strict union array (e.g., `"Professionals"`, `"Families"`, `"HNI"`). |
| `about` | `string` | A brief, 2-3 sentence overview of the practice. |
| `description` | `string` | A detailed description of the firm, philosophy, and history (supports multi-line template strings). |
| `services` | `Service[]` | Array of `{ name: string, description: string }` for offered services. |
| `feeStructure` | `FeeItem[]` | Array of `{ service: string, amount: string }`. |
| `testimonials` | `Testimonial[]` | Optional array of `{ text: string, author: string, designation?: string }`. |
| `sebiRegistrationNumber`| `string` | The SEBI registration code (e.g., `"INA000021605"`). |
| `verifiedBySpring` | `boolean` | Set to `true` to display the "Verified by Spring" green badge on the UI. |
| `grievanceOfficer` | `object` | `{ name: string, email: string }` matching SEBI-registered contact info. |
| `cta` | `CustomCTA[]` | Buttons to render on the hero area: primary (e.g., WhatsApp, Calendly) and secondary (e.g., Website). |
| `faqs` | `QA[]` | Array of customized `{ question: string, answer: string }` about their practice. |
| `clientTypePills` | `string[]` | Visual badges highlighting target clients. |
| `idealClientDescription`| `string` | Text describing their ideal client fit. |

---

## Step 3: Configure Custom Credentials & Badges
To display custom, high-profile badges on the advisor's detail page:
1. Open the dynamic advisor route page:
   - Path: `app/services/[advisorSlug]/page.tsx`
2. Locate the helper function `getAdvisorCredentials(advisorId: string)`.
3. Add a special case return statement for the new advisor ID to output customized tags (e.g., MBA, CFA®, former investment banker) alongside standard SEBI credentials:
   ```typescript
   // Special case for Advisor X
   if (advisorId === "X") {
     return ["SEBI Registered Investment Advisor", "CFA® Charterholder", "MBA - Finance"];
   }
   ```

---

## Step 3.5: Configure Layout Without Video
If the onboarding advisor does not have an introduction video URL (similar to MyGuide2Wealth, Phi Wealth, or Redwoods Wealth):
1. Open the page file: `app/services/[advisorSlug]/page.tsx`
2. Locate the layout flag assignment `isSpecial`:
   `const isSpecial = advisor.id === "1" || advisor.id === "7" || ...;`
3. Append the new advisor ID (e.g. `|| advisor.id === "12" || advisor.id === "13"`). This instructs the application to render using the clean `InfoCardsGrid()` layout, presenting the Credentials, Fee Structure, and Ideal Client details in a beautiful grid instead of displaying a blank video section.

---

## Step 4: Verify Dynamic Slug Generation & Render
Spring Money automatically constructs browser-friendly slugs based on the advisor's name and firm name:
- Expected URL: `/services/[advisor-name]-[firm-name]`
- Example 1: `/services/palnika-hemnani-phi-wealth`
- Example 2: `/services/viral-parekh-redwoods-wealth`

### Verification Checklist:
1. Run `npm run dev` in terminal.
2. Visit the `/services` catalog and check that the new advisor cards render perfectly with their taglines, tags, and location.
3. Click the card to open their dynamic slug detail page.
4. Verify:
   - Image displays cleanly at standard aspect ratio.
   - Verified checkmark and custom badges/credentials load.
   - Description, CTAs, and FAQs render perfectly without markdown syntax errors.
