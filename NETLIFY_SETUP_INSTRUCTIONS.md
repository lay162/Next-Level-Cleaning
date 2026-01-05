# Netlify Forms Setup Instructions

## To Configure Form Submissions to quotes@ Email

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com
2. Select your site: **nextlevelcleaningltd.co.uk**

### Step 2: Configure Form Notifications
1. Go to **Site settings** → **Forms** → **Form notifications**
2. Click **Add notification**
3. Select **Email notifications**
4. Configure:
   - **Notification name**: Quote Requests
   - **Send to**: `quotes@nextlevelcleaning.co.uk`
   - **Subject**: `New Quote Request - {{form-name}}`
   - **From email**: `noreply@nextlevelcleaningltd.co.uk` (or your domain email)
   - **Form name**: `quote-request`

### Step 3: Email Template (Optional but Recommended)
You can customize the email template to include all form fields:

```
New Quote Request Received

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Location: {{location}}
Service Type: {{service-type}}
Property Type: {{property-type}}
Frequency: {{frequency}}

Additional Details:
{{message}}

Submitted: {{submitted_at}}
```

### Step 4: Zoho Mail Folder Organization
To automatically organize emails in Zoho:
1. Log into Zoho Mail
2. Go to **Settings** → **Filters**
3. Create a new filter:
   - **Condition**: Subject contains "New Quote Request"
   - **Action**: Move to folder "Quotes" (create folder if needed)
   - **Also apply label**: "Website Leads" (optional)

### Step 5: Test the Form
1. Submit a test quote request from your website
2. Check that email arrives at quotes@nextlevelcleaning.co.uk
3. Verify it's organized in the correct folder

## Alternative: Using EmailJS (More Direct Control)

If you prefer more control, you can use EmailJS:

1. Sign up at https://www.emailjs.com (free tier available)
2. Create an email service (connect your Zoho email)
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update `script.js` with your credentials (see comments in code)

EmailJS allows you to:
- Send directly to quotes@
- Customize subject lines for folder organization
- Send auto-reply to customer
- More control over email formatting

## Current Setup
The form is currently configured to use **Netlify Forms**, which is the simplest option since you're already on Netlify.


