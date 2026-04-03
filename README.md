# GrandSky Facility & Management Services - Website

Professional, high-converting website for GrandSky Facility & Management Services LLP featuring responsive design, scroll animations, and comprehensive service information.

## 🌐 Website Structure

### Pages
- **index.html** - Homepage with hero, services overview, testimonials, and CTA
- **about.html** - Company information, mission, vision, core values
- **services.html** - Detailed service pages for all 4 core services
- **contact.html** - Contact form, FAQ, and contact information

### Services Offered
1. **Security Guarding** - Professional protection with trained personnel (24/7)
2. **Surveillance & Security** - CCTV, access control, real-time monitoring
3. **Battery & UPS Services** - Commercial UPS and backup power solutions (99.9% uptime)
4. **Air Conditioning** - HVAC installation, maintenance, repairs (365-day support)

## 🎨 Design Features

- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Color Palette**: Professional navy, blue, green, and gold colors
- **Animations**: Smooth scroll animations using Intersection Observer
- **Modern Styling**: Clean, professional UI with consistent typography

## 📋 Files Structure

```
GFMS NEW WEB/
├── index.html           # Homepage
├── about.html           # About Us
├── services.html        # Services Page
├── contact.html         # Contact & Form
├── css/
│   └── styles.css       # Complete stylesheet (2000+ lines)
├── js/
│   └── main.js          # JavaScript functionality
├── server.js            # Node.js Express backend
├── package.json         # Node dependencies
├── .env.example         # Environment configuration template
└── README.md            # This file
```

## 🚀 Quick Start

### Option 1: Static Hosting (Netlify, Vercel)
1. Upload HTML, CSS, and JS files to your hosting platform
2. Point your domain to the hosting service
3. No backend setup needed for static version

### Option 2: With Email Functionality (Node.js)

#### Prerequisites
- Node.js installed (v14 or higher)
- Email account (Gmail, SendGrid, Office 365, etc.)

#### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Email**
   - Copy `.env.example` to `.env`
   - Fill in your SMTP credentials

   **For Gmail:**
   - Go to https://myaccount.google.com/apppasswords
   - Generate an App Password
   - Use that password in `.env`

   **For Other Providers:**
   - SendGrid: Get SMTP credentials from dashboard
   - Office 365: Use your corporate email credentials
   - Others: Contact your email provider for SMTP details

3. **Start the Server**
   ```bash
   npm start
   ```
   Server runs on http://localhost:3000

4. **Test the Form**
   - Navigate to http://localhost:3000/contact.html
   - Fill out and submit the contact form
   - Check email for confirmation

## 🔐 Security Features

- Input validation (client-side and server-side)
- Email sanitization to prevent XSS attacks
- CSRF protection ready
- Express validator middleware
- Secure form handling

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Go to App Passwords: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Generate password and use in `.env` file
5. Test by sending a form

### SendGrid Setup
1. Get API key from SendGrid dashboard
2. Use email: `apikey`
3. Use password: `SG.your_api_key`

### Office 365 Setup
1. Use your corporate email credentials
2. SMTP Host: `smtp.office365.com`
3. Port: `587`
4. No App Password needed

## 🎯 Customization Checklist

- [ ] Update company address in footer and contact page
- [ ] Update phone numbers (+1 (555) 123-4567)
- [ ] Update email addresses (info@grandskyfacility.com)
- [ ] Update business hours
- [ ] Configure email credentials in `.env`
- [ ] Update service descriptions as needed
- [ ] Add company logo (replace logo reference)
- [ ] Update SEO meta tags
- [ ] Add Google Analytics (optional)

## 📱 Responsive Breakpoints

- Mobile: 320px - 767px
- Tablet: 768px - 1199px
- Desktop: 1200px+

## 🎬 Animation Details

- **Fade In**: Fades element into view (0.6s)
- **Slide Up**: Slides from bottom into view (0.6s)
- **Slide Left**: Slides from left into view (0.6s)
- **Slide Right**: Slides from right into view (0.6s)
- **Scale In**: Scales up into view (0.6s)

All animations triggered when element enters viewport using Intersection Observer.

## 📊 Form Fields

1. **Name** - Required, minimum 2 characters
2. **Email** - Required, valid email format
3. **Phone** - Required, valid phone format (10+ digits)
4. **Company** - Required
5. **Service** - Required dropdown selection
6. **Message** - Required, minimum 10 characters
7. **Privacy Checkbox** - Required acceptance

## 🐛 Troubleshooting

### Email Not Sending
- Check `.env` file exists and .gitignore doesn't exclude it
- Verify SMTP credentials are correct
- Check email provider's security settings
- Gmail: Enable "Less secure apps" or use App Password
- Check server console for error messages

### Form Validation
- Check browser console for errors
- Verify all required fields are filled
- Check email format: `user@example.com`
- Check phone format includes numbers and valid separators

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS file is in `css/` folder
- Check JS file is in `js/` folder
- Verify all link paths are correct

## 📞 Support

For issues or questions:
- Email: info@grandskyfacility.com
- Phone: +1 (555) 123-4567

## 📄 License

© 2026 GrandSky Facility & Management Services LLP. All rights reserved.

## 🔗 Additional Resources

- **Netlify Deployment**: https://www.netlify.com
- **Vercel Deployment**: https://vercel.com
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **SendGrid**: https://sendgrid.com
- **Nodemailer**: https://nodemailer.com

---

Last Updated: April 3, 2026
