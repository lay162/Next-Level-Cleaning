# Employee Digital Business Cards

This directory contains all employee digital business cards, organized by job category.

## Folder Structure

```
id/
├── director/          # Directors (Lauren, Jenny, etc.)
├── manager/           # Managers
├── cleaner/           # Cleaners
└── template/          # Template for creating new cards (development only)
```

## Current Employees

### Directors
- **Lauren Moore** - `/id/director/lauren-moore/`
- **Jenny Roscoe** - `/id/director/jenny-roscoe/`

### Managers
- (None yet)

### Cleaners
- (None yet)

## Adding a New Employee

### Step 1: Create Employee Folder
Create a new folder in the appropriate category:
```
id/[category]/[firstname-lastname]/
```

**Example:**
- Director: `id/director/john-smith/`
- Manager: `id/manager/sarah-jones/`
- Cleaner: `id/cleaner/mike-williams/`

### Step 2: Copy Template Files
Copy all files from `id/template/` to the new employee folder:
- `index.html`
- `script.js`
- `style.css`
- `contact.vcf`
- `logo.png`
- `profile.jpg` (replace with employee photo)

### Step 3: Create JSON Data File
Create a JSON file in `data/` folder:
```
data/[firstname-lastname].json
```

**Example:** `data/john-smith.json`

```json
{
  "name": "John Smith",
  "role": "Director",
  "company": "Next Level Cleaning Ltd",
  "email": "john@nextlevelcleaningltd.co.uk",
  "phone": "+447700900003",
  "website": "https://nextlevelcleaningltd.co.uk",
  "profileImage": "profile.jpg",
  "contactVcf": "contact.vcf",
  "theme": "blue",
  "description": "Professional commercial cleaning services",
  "social": {
    "facebook": "https://www.facebook.com/NextLevelCleaningWirral",
    "instagram": "https://www.instagram.com/NextLevelCleaningWirral",
    "tiktok": "https://www.tiktok.com/@nextlevelcleaningwirral",
    "linkedin": "https://www.linkedin.com/company/nextlevelcleaningwirral"
  },
  "contentStream": []
}
```

### Step 4: Update Contact VCF
Edit `contact.vcf` in the employee folder:
- Update `N:` (last name, first name)
- Update `FN:` (full name)
- Update `TITLE:` (job title)
- Update `TEL:` (phone number)
- Update `EMAIL:` (email address)
- Update `URL:` to: `https://lay162.github.io/Next-Level-Cleaning/id/[category]/[firstname-lastname]/`

### Step 5: Update HTML Placeholder
The `index.html` file will automatically load data from the JSON file. No changes needed!

### Step 6: Test Locally
1. Open `id/[category]/[firstname-lastname]/index.html` in a browser
2. Verify all information displays correctly
3. Test QR code generation

### Step 7: Deploy
1. Commit all new files to GitHub
2. GitHub Pages will automatically deploy
3. QR code will automatically work: `https://lay162.github.io/Next-Level-Cleaning/id/[category]/[firstname-lastname]/`

## Categories

### Director
- Senior leadership roles
- Example: Lauren Moore, Jenny Roscoe

### Manager
- Management positions
- Example: (Add managers here)

### Cleaner
- Cleaning staff
- Example: (Add cleaners here)

## Notes

- **QR Codes**: Automatically generated and point to GitHub Pages URL
- **Data Loading**: All cards load data from JSON files in `data/` folder
- **Responsive**: All cards are mobile-responsive
- **Template**: Never use the template folder in production - it's for development only

## URL Structure

All employee cards follow this pattern:
```
https://lay162.github.io/Next-Level-Cleaning/id/[category]/[firstname-lastname]/
```

**Examples:**
- Director: `https://lay162.github.io/Next-Level-Cleaning/id/director/lauren-moore/`
- Manager: `https://lay162.github.io/Next-Level-Cleaning/id/manager/john-smith/`
- Cleaner: `https://lay162.github.io/Next-Level-Cleaning/id/cleaner/jane-doe/`

