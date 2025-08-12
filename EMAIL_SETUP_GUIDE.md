# Simple Email Setup Guide

You're absolutely right! You shouldn't need SendGrid to receive form submissions. This guide shows how to set up simple email notifications like WordPress does.

## Option 1: Gmail SMTP (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Select "Security" → "2-Step Verification" → "App passwords"
   - Generate an app password for "Mail"
   - Copy the 16-character password

3. **Add these environment variables** in your Replit secrets:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   ```

## Option 2: Other Email Providers

### Yahoo Mail
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_EMAIL=your-email@yahoo.com
SMTP_PASSWORD=your-yahoo-password
```

### Outlook/Hotmail
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
```

## How it Works

- Form submissions will be automatically sent to your email
- No third-party service verification required
- Works just like WordPress contact forms
- Fallback to SendGrid only if SMTP fails

## Testing

After adding the SMTP settings:
1. Restart your application
2. Submit a form on your website
3. Check your email inbox for notifications

That's it! Much simpler than SendGrid setup.