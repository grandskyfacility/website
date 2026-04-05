// GrandSky Facility & Management Services - Express Server
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000

;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Sanitize HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[\d\s\-\+\(\)]{10,}$/).withMessage('Valid phone number required'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),
  body('service')
    .notEmpty().withMessage('Service selection is required')
    .isIn(['security', 'surveillance', 'battery', 'ac', 'consultation']).withMessage('Invalid service selected'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Contact Form Handler
app.post('/api/send-email', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, company, service, message } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      company: escapeHtml(company),
      service: escapeHtml(service),
      message: escapeHtml(message)
    };

    // Admin notification email
    const adminMailOptions = {
      to: process.env.ADMIN_EMAIL || 'info@grandskyfacility.com',
      cc: process.env.ADMIN_CC_EMAIL,
      subject: `[GrandSky] New Contact Form Submission - ${sanitizedData.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse; background: #f9f9f9;">
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 150px;">Name</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${sanitizedData.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${sanitizedData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Company</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${sanitizedData.company}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Service Interest</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${sanitizedData.service}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Message</td>
              <td style="padding: 12px; border: 1px solid #ddd; background: white;">${sanitizedData.message}</td>
            </tr>
          </table>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">GrandSky Facility & Management Services LLP</p>
            <p style="margin: 5px 0 0 0;">Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    // Client confirmation email
    const clientMailOptions = {
      to: sanitizedData.email,
      subject: 'We Received Your Message - GrandSky Facility Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 28px;">GrandSky Facility & Management Services</h2>
            <p style="margin: 5px 0 0 0;">Professional Facility Management</p>
          </div>
          <div style="padding: 30px; background: white; border: 1px solid #ddd;">
            <h3 style="color: #1e3a5f; margin-bottom: 15px;">Thank You for Contacting Us!</h3>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
              Dear ${sanitizedData.name},
            </p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
              Thank you for reaching out to GrandSky Facility & Management Services. We've successfully received your message and appreciate your interest in our services.
            </p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
              Our team will carefully review your inquiry and contact you within 24-48 hours to discuss how we can best serve your facility management needs.
            </p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4a9d6f; margin: 20px 0;">
              <p style="margin: 0; color: #555;"><strong>Your Submission Details:</strong></p>
              <p style="margin: 5px 0; color: #555;">Service Interest: ${sanitizedData.service}</p>
              <p style="margin: 5px 0; color: #555;">Submitted: ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
              In the meantime, if you have any urgent questions, please feel free to reach out directly:
            </p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Call us at <strong>+1 (555) 123-4567</strong><br/>
              or email <strong>info@grandskyfacility.com</strong>
            </p>
            <p style="color: #555; line-height: 1.6;">
              Best regards,<br/>
              <strong>GrandSky Team</strong><br/>
              Professional Facility Management
            </p>
          </div>
          <div style="background: #1e3a5f; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2026 GrandSky Facility & Management Services LLP</p>
            <p style="margin: 5px 0 0 0;">All rights reserved</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Email error:', error);
    
    // If SMTP not configured, show helpful message
    if (error.message.includes('SMTP') || error.message.includes('auth')) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please contact us directly at info@grandskyfacility.com',
        error: 'Email configuration required'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again or contact us directly.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║   GrandSky Facility & Management Services Server         ║
    ╠════════════════════════════════════════════════════════════╣
    ║   Server running at: http://localhost:${PORT}                ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
    ║   Email Service: ${process.env.SMTP_SERVICE || 'Not Configured'}              ║
    ╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
