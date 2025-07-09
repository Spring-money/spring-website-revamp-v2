# Advisor Profiles Management

This directory contains the advisor profile data and templates for easy scaling.

## Files Structure

- `advisors.tsx` - Main file containing original 7 advisors + bulk advisors
- `advisor-template.ts` - Template function for creating consistent advisor profiles
- `bulk-advisors.ts` - Contains bulk advisor data (currently 5 sample profiles)

## How to Add New Advisor Profiles

### Method 1: Quick Addition (Recommended)

1. Open `bulk-advisors.ts`
2. Copy the `advisorTemplate` at the bottom of the file
3. Paste it into the `bulkAdvisorData` array
4. Modify the values:
   - Change `id` to the next sequential number
   - Update all the advisor details
   - Save the file

### Method 2: Batch Addition

Create multiple profiles at once by copying the template multiple times and modifying each one.

## Required Fields

- `id`: Sequential number as string ("13", "14", etc.)
- `firmName`: Name of the advisory firm
- `advisorName`: Name of the advisor
- `principalAdvisor`: Principal advisor name
- `sebiReg`: SEBI registration number (format: INA000XXXXXX)
- `location`: Must match one of the predefined locations
- `specializations`: Array of specializations (must match predefined types)
- `audience`: Array of target audience (must match predefined types)

## Available Options

### Locations
- "Mumbai, Maharashtra"
- "Delhi" 
- "Bengaluru, Karnataka"
- "Hyderabad, Telangana"
- "Chennai, Tamil Nadu"
- "Pune, Maharashtra"
- "Kolkata, West Bengal"
- "Remote/Virtual"
- "Noida, Uttar Pradesh"

### Specializations
- "Retirement Planning"
- "Tax Planning"
- "NRI Services"
- "Custom Smallcase"
- "Estate Planning"
- "Mutual Funds"
- "Insurance"
- "Stock Investments"
- "Financial Planning"
- "Wealth Management"
- "Small Cap Investing"
- "Mid Cap Investing"
- "Debt Management"

### Audience Types
- "Salaried"
- "Business Owners"
- "Retired"
- "HNI"
- "NRIs"
- "Young Professionals"

## Example: Adding a New Profile

```typescript
{
  id: "13",
  firmName: "Money Masters",
  advisorName: "Rahul Agarwal",
  principalAdvisor: "Rahul Agarwal",
  sebiReg: "INA000020006",
  location: "Delhi",
  tagline: "Mastering your financial future",
  specializations: ["Financial Planning", "Mutual Funds"],
  audience: ["Salaried", "Young Professionals"],
  about: "Expert financial advisor with 10+ years experience",
  description: "Money Masters provides comprehensive financial planning...",
  services: [
    {
      name: "Financial Planning",
      description: "Complete financial planning services"
    }
  ],
  feeStructure: [
    { service: "Planning", amount: "₹15,000 – ₹20,000" }
  ],
  ctaLinks: [
    { text: "Book Meeting", href: "https://calendly.com/rahul", variant: "primary" }
  ],
  clientTypePills: ["Young Professionals"],
  idealClientDescription: "Young professionals starting their investment journey"
}
```

## Tips for Scaling to 100+ Profiles

1. **Use consistent naming**: Keep IDs sequential (8, 9, 10, ...)
2. **Batch creation**: Create 10-20 profiles at a time
3. **Copy & modify**: Use the template and modify only necessary fields
4. **Validate data**: Ensure all required fields are filled
5. **Test incrementally**: Add a few profiles, test, then add more

## Adding New Locations/Specializations

If you need new options:

1. Open `advisors.tsx`
2. Add to the respective type definition (Location, Specialization, AudienceType)
3. Add to the export arrays at the bottom of the file

## No Code Changes Needed

The marketplace page and all components automatically pick up new advisors - no additional coding required! 