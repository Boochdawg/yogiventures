# EmailJS Setup Guide for YogiVentures Website

## Quick Setup Steps

Your form is ready to send emails to **dross.ross20@gmail.com**. Follow these steps to activate it:

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (it's free - 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (since you're using Gmail)
4. Click **Connect Account** and authorize EmailJS to send emails from your Gmail
5. **Copy your Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this template:

**Template Name:** `YogiVentures Contact Form`

**Subject:**
```
{{subject}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #d4af37; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #ddd; }
        .section { margin-bottom: 25px; padding: 15px; background: white; border-left: 4px solid #d4af37; border-radius: 5px; }
        .section-title { font-size: 18px; font-weight: bold; color: #d4af37; margin-bottom: 10px; }
        .field { margin: 8px 0; }
        .field-label { font-weight: bold; color: #333; }
        .field-value { color: #666; margin-left: 10px; }
        .footer { background: #1a1a1a; color: #d4af37; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        pre { white-space: pre-wrap; font-family: 'Courier New', monospace; background: #f0f0f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>YogiVentures, LLC</h1>
            <p>New Business Inquiry</p>
        </div>
        <div class="content">
            <div class="section">
                <div class="section-title">📧 Contact Information</div>
                <div class="field">
                    <span class="field-label">Name:</span>
                    <span class="field-value">{{from_name}}</span>
                </div>
                <div class="field">
                    <span class="field-label">Email:</span>
                    <span class="field-value">{{from_email}}</span>
                </div>
                <div class="field">
                    <span class="field-label">Phone:</span>
                    <span class="field-value">{{phone}}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💼 Business Interest</div>
                <div class="field">
                    <span class="field-label">Business Type:</span>
                    <span class="field-value">{{business_type}}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📝 Inquiry Details</div>
                <pre>{{message}}</pre>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the YogiVentures website contact form.</p>
            <p>Reply directly to this email to respond to {{from_name}} at {{from_email}}</p>
        </div>
    </div>
</body>
</html>
```

**Or use Plain Text version:**
```
NEW INQUIRY - {{business_type}}

=== CONTACT INFORMATION ===
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

=== BUSINESS INTEREST ===
Business Type: {{business_type}}

=== INQUIRY DETAILS ===
{{message}}

---
This email was sent from the YogiVentures website.
Reply to: {{from_email}}
```

4. **Copy your Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** → **General** (or **API Keys**)
2. Find your **Public Key**
3. **Copy it** (looks like: `xxxxxxxxxxxxxxxxxxxxx`)

### Step 5: Update script.js
Open `script.js` and find these three places to update:

**1. Near the top (around line 3):**
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
```
Replace `YOUR_PUBLIC_KEY` with your actual public key.

**2. In the emailjsConfig object (around line 520):**
```javascript
const emailjsConfig = {
    serviceId: 'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'         // Replace with your EmailJS public key
};
```
Replace all three placeholders with your actual values.

### Step 6: Test It!
1. Fill out the form on your website
2. Submit it
3. Check your email at **dross.ross20@gmail.com**
4. You should receive a beautifully formatted email!

## Email Format

The emails you'll receive will be formatted like this:

**Subject:** `New Barbering Services Inquiry - John Doe`

**Body:**
- Contact Information (Name, Email, Phone)
- Business Interest (which business they selected)
- All business-specific details (service type, preferences, etc.)
- Consultation details (if requested)
- Their message
- Timestamp

## Troubleshooting

**Email not sending?**
- Check browser console for errors (F12 → Console)
- Verify all three IDs are correct in script.js
- Make sure EmailJS service is connected to your Gmail
- Check EmailJS dashboard for delivery status

**Need help?**
- EmailJS documentation: https://www.emailjs.com/docs/
- Check EmailJS dashboard logs for delivery issues

## Next Steps (Future App Integration)

Once you're ready to build the scheduling app, we can:
- Create a database to store appointments
- Build a calendar view
- Set up automated reminders
- Integrate with the form submissions
- Create an admin dashboard

For now, all form submissions will come directly to your email inbox at **dross.ross20@gmail.com**!

