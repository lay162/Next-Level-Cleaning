# Deployment Notes - Custom Domain Setup

## Important: DNS Configuration Required

To use the custom domain (`nextlevelcleaningltd.co.uk`) in QR codes without showing the old cached template, you **MUST** configure your DNS to point to GitHub Pages.

### Current Issue
- QR codes use custom domain: `https://nextlevelcleaningltd.co.uk/id/director/lauren-moore/`
- If DNS still points to Netlify → Shows old cached template
- If DNS points to GitHub Pages → Shows latest version ✅

### Solution: Point DNS to GitHub Pages

1. **Go to your domain registrar** (where you bought `nextlevelcleaningltd.co.uk`)

2. **Update DNS records:**
   - **Option A: CNAME Record (Recommended)**
     - Type: `CNAME`
     - Name: `@` (or leave blank for root domain)
     - Value: `lay162.github.io`
   
   - **Option B: A Records**
     - Type: `A`
     - Name: `@`
     - Value: GitHub Pages IP addresses:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`

3. **Configure GitHub Pages Custom Domain:**
   - Go to your GitHub repository
   - Settings → Pages
   - Under "Custom domain", enter: `nextlevelcleaningltd.co.uk`
   - Check "Enforce HTTPS"

4. **Wait for DNS propagation:**
   - Can take 24-48 hours
   - Check with: `nslookup nextlevelcleaningltd.co.uk`

### After DNS is Configured

✅ QR codes will use: `https://nextlevelcleaningltd.co.uk/id/director/lauren-moore/`  
✅ Will show latest version from GitHub Pages (not old Netlify cache)  
✅ All employee cards will work correctly

### Template System

**All employee cards now use shared template files:**
- `id/template/style.css` - Shared styles (update once, applies to all)
- `id/template/script.js` - Shared functionality (update once, applies to all)

**To make changes that apply to ALL cards:**
1. Edit `id/template/style.css` or `id/template/script.js`
2. Update version number in employee `index.html` files (e.g., `?v=3.0` → `?v=4.0`)
3. Deploy to GitHub

**Employee-specific files:**
- `index.html` - Individual card structure
- `profile.jpg` - Employee photo
- `contact.vcf` - Contact card
- `data/[name].json` - Employee data

