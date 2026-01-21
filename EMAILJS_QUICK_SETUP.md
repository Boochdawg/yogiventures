# EmailJS Quick Setup - Get Your Form Working in 5 Minutes! 🚀

## Step-by-Step Guide

### Step 1: Sign Up for EmailJS (2 minutes)
1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** (Free account = 200 emails/month)
3. Sign up with your email or Google account
4. Verify your email address

### Step 2: Connect Your Gmail (1 minute)
1. In EmailJS dashboard, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Select **"Gmail"**
4. Click **"Connect Account"**
5. Authorize EmailJS to send emails from your Gmail
6. **COPY YOUR SERVICE ID** (looks like: `service_abc123xyz`)
   - It will be displayed on the screen
   - Save it somewhere - you'll need it!

### Step 3: Create Email Template (2 minutes)
1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. **Template Name:** `YogiVentures Contact Form`

**Subject Line:**
```
{{subject}}
```

**Content (Plain Text - easier to start with):**
```
NEW INQUIRY - {{business_type}}

=== CONTACT INFORMATION ===
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

=== BUSINESS INTEREST ===
Business: {{business_type}}

=== MESSAGE ===
{{message}}

---
Submitted: {{date}}
Reply to: {{from_email}}
```

4. Click **"Save"**
5. **COPY YOUR TEMPLATE ID** (looks like: `template_abc123xyz`)
   - It's shown at the top of the template page
   - Save it!

### Step 4: Get Your Public Key (30 seconds)
1. Click **"Account"** (top right) → **"General"**
2. Scroll down to **"API Keys"** section
3. Find **"Public Key"**
4. **COPY YOUR PUBLIC KEY** (looks like: `abcdefghijklmnopqrstuvwxyz123456`)
   - Save it!

### Step 5: Update Your Website Code (1 minute)
Open `script.js` and find these **TWO places** to update:

**Location 1: Line ~7** (near the top)
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
```
Replace `YOUR_PUBLIC_KEY` with your actual public key (from Step 4)

**Location 2: Line ~848** (in the emailjsConfig object)
```javascript
const emailjsConfig = {
    serviceId: 'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'         // Replace with your EmailJS public key
};
```

Replace:
- `YOUR_SERVICE_ID` → Your Service ID from Step 2
- `YOUR_TEMPLATE_ID` → Your Template ID from Step 3
- `YOUR_PUBLIC_KEY` → Your Public Key from Step 4

### Step 6: Test It! 🎉
1. Open your website
2. Fill out the contact form
3. Submit it
4. Check your email at **dross.ross20@gmail.com**
5. You should receive the inquiry email!

## Example of What to Replace

**Before:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```

**After (example):**
```javascript
emailjs.init("abcdefghijklmnopqrstuvwxyz123456");
```

**Before:**
```javascript
const emailjsConfig = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
};
```

**After (example):**
```javascript
const emailjsConfig = {
    serviceId: 'service_abc123xyz',
    templateId: 'template_abc123xyz',
    publicKey: 'abcdefghijklmnopqrstuvwxyz123456'
};
```

## Troubleshooting

**Not receiving emails?**
- Check browser console (F12 → Console) for errors
- Make sure all three IDs are correct (no extra spaces)
- Verify EmailJS service is connected to Gmail
- Check EmailJS dashboard → "Logs" to see if emails are being sent

**Need help?**
- EmailJS Support: https://www.emailjs.com/support/
- Check the detailed guide: `EMAILJS_SETUP.md`

## What Happens When Someone Submits the Form?

1. User fills out form on your website
2. Form data is sent to EmailJS
3. EmailJS formats it and sends to **dross.ross20@gmail.com**
4. You receive a nicely formatted email with all their information
5. You can reply directly to the email to contact them!

**That's it! Your form is now live and working! 🎊**

