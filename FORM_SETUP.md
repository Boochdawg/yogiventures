# Form Setup Guide for YogiVentures Website

## Overview
The contact form is now set up with business-specific fields and automated responses. Here's how to configure it to actually send emails to you.

## Current Features

### ✅ What's Working Now:
1. **Conditional Fields**: Different fields appear based on business selection
   - **Barbering**: Service type, preferred date/time, location
   - **Engineering**: Project type, company size
   - **Real Estate**: Property interest, location
   - **Boutique**: Interest type, size preferences

2. **Business-Specific Confirmation Messages**: Each business type gets a tailored response
3. **Form Validation**: All required fields are validated
4. **Loading States**: Visual feedback during submission

### ⚙️ What Needs Setup:
The form currently simulates sending emails. You need to configure EmailJS to actually receive submissions.

## Step-by-Step EmailJS Setup

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

### Step 2: Create an Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection steps
5. **Copy your Service ID** (you'll need this)

### Step 3: Create an Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this template structure:

**Subject:**
```
New {{business_type}} Inquiry from {{from_name}}
```

**Content:**
```
NEW INQUIRY - {{business_type}}

=== CONTACT INFORMATION ===
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

=== BUSINESS INTEREST ===
Business: {{business_type}}

{{message}}

---
Submitted: {{date}}
```

4. **Copy your Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### Step 5: Update script.js
Open `script.js` and find this section (around line 100):

```javascript
const emailjsConfig = {
    serviceId: 'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'         // Replace with your EmailJS public key
};
```

Replace the placeholders with your actual values:
- `YOUR_SERVICE_ID` → Your EmailJS Service ID
- `YOUR_TEMPLATE_ID` → Your EmailJS Template ID  
- `YOUR_PUBLIC_KEY` → Your EmailJS Public Key

### Step 6: Uncomment EmailJS Code
Find this section in `script.js` (around line 120):

```javascript
// TODO: Uncomment and configure this when EmailJS is set up:
/*
await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.templateId,
    {
        to_email: 'info@yogiventures.com', // Your email
        from_name: data.name,
        from_email: data.email,
        subject: `New ${businessType} Inquiry from ${data.name}`,
        message: emailContent,
        business_type: businessType,
        phone: data.phone || 'Not provided'
    },
    emailjsConfig.publicKey
);
*/
```

Remove the `/*` and `*/` to uncomment it, and update `to_email` with your actual email address.

### Step 7: Initialize EmailJS
Find this line near the top of `script.js`:

```javascript
// emailjs.init("YOUR_PUBLIC_KEY"); // Uncomment and add your public key after EmailJS setup
```

Uncomment it and add your public key:
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```

## How It Works

### For You (Business Owner):
1. **Email Format**: You'll receive emails with clear sections:
   - Contact information at the top
   - Business type clearly labeled
   - Business-specific details (service type, date/time for barbering, etc.)
   - Customer's message
   - Timestamp

2. **Subject Line**: Easy to identify business type
   - "New barbering Inquiry from John Doe"
   - "New engineering Inquiry from Jane Smith"
   - etc.

3. **Organization**: Each inquiry is clearly separated by business type, making it easy to prioritize and respond appropriately.

### For Customers:
1. **Barbering Customers** get:
   - "Thank You for Your Barbering Inquiry!"
- Message: "We've received your appointment request and will contact you within 24 hours to confirm your preferred date and time. We're committed to delivering a premium grooming experience and making sure you look your best!"

2. **Engineering Clients** get:
   - "Thank You for Your Engineering Inquiry!"
   - Message: "We've received your system engineering consultation request. Our team will review your project details and contact you within 48 hours..."

3. **Real Estate Clients** get:
   - "Thank You for Your Real Estate Inquiry!"
   - Message: "We've received your real estate inquiry and will contact you within 24-48 hours..."

4. **Boutique Customers** get:
   - "Thank You for Your Boutique Inquiry!"
   - Message: "We've received your inquiry about our sneaker and clothing collection..."

5. **General Inquiries** get:
   - "Thank You for Contacting YogiVentures!"
   - Generic message

## Testing

After setup:
1. Fill out the form with a test submission
2. Check your email inbox
3. Verify the email format and information
4. Test each business type to ensure conditional fields work

## Alternative: Use Formspree or Netlify Forms

If you prefer not to use EmailJS:

### Formspree:
- Sign up at https://formspree.io/
- Get your form endpoint
- Update the form action in HTML

### Netlify Forms:
- If hosting on Netlify, add `netlify` attribute to form
- No additional setup needed

## Need Help?

The form is fully functional on the frontend. You just need to connect it to an email service. EmailJS is recommended because:
- Free tier (200 emails/month)
- Easy setup
- Works with static sites
- No backend required

Once configured, all form submissions will come directly to your email inbox, clearly organized by business type!

