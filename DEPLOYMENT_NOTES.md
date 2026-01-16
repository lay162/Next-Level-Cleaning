# Deployment Notes - Custom Domain Setup

## ✅ CNAME File Created

A `CNAME` file has been created in the repository root. This tells GitHub Pages to use your custom domain.

## Important: DNS Configuration Required (One-Time Setup)

To use the custom domain (`nextlevelcleaningltd.co.uk`) in QR codes without showing the old cached template, you **MUST** configure your DNS to point to GitHub Pages.

**This is a ONE-TIME change that won't break anything** - it just tells your domain to point to GitHub Pages instead of Netlify.

### Current Issue
- QR codes use custom domain: `https://nextlevelcleaningltd.co.uk/id/director/lauren-moore/`
- If DNS still points to Netlify → Shows old cached template ❌
- If DNS points to GitHub Pages → Shows latest version ✅

### Step-by-Step Solution

#### Step 1: Configure GitHub Pages Custom Domain
1. Go to your GitHub repository: `https://github.com/lay162/Next-Level-Cleaning`
2. Click **Settings** → **Pages** (left sidebar)
3. Under **"Custom domain"**, enter: `nextlevelcleaningltd.co.uk`
4. Click **Save**
5. Check **"Enforce HTTPS"** (if available)
6. Wait 5-10 minutes for GitHub to verify the domain

#### Step 2: Update DNS at Your Domain Registrar
1. **Go to your domain registrar** (where you bought `nextlevelcleaningltd.co.uk`)
   - This might be Netlify, GoDaddy, Namecheap, or another registrar

2. **Find DNS Management / DNS Settings**

3. **Update DNS records:**
   - **Option A: CNAME Record (Recommended - Easiest)**
     - Type: `CNAME`
     - Name/Host: `@` (or leave blank for root domain)
     - Value/Target: `lay162.github.io`
     - TTL: `3600` (or default)
   
   - **Option B: A Records** (If CNAME not supported)
     - Type: `A`
     - Name/Host: `@`
     - Value: `185.199.108.153`
     - Add 3 more A records with:
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`

4. **Save the DNS changes**

#### Step 3: Wait for DNS Propagation
- Can take 5 minutes to 24 hours (usually 1-2 hours)
- GitHub will show a green checkmark when DNS is configured correctly
- Check status: Go to GitHub → Settings → Pages → Custom domain

#### Step 4: Verify It's Working
1. Visit: `https://nextlevelcleaningltd.co.uk/id/director/lauren-moore/`
2. Should show Lauren's card (not template)
3. Scan QR code - should show company domain with correct employee card

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

