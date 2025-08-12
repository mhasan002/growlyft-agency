# Form Mapping Configuration

This document shows how forms on the website map to backend configurations for email notifications.

## Current Form Mappings

### Contact Forms (API: `/api/contact`)
Based on the `type` field in the submission:

1. **Contact Page - Send Message**
   - Form Config: `contact_send_message`
   - Button: "Send Message"
   - Location: "Contact Page"

2. **About Page - Let's Talk**
   - Form Config: `about_lets_talk`
   - Button: "Let's Talk"
   - Location: "About Page"

3. **Services Page - Custom Plan**
   - Form Config: `services_custom_plan`
   - Button: "Get Custom Plan"
   - Location: "Services Page"

4. **Services Page - Package Get Started**
   - Form Config: `services_get_started`
   - Button: "Get Started"
   - Location: "Services Page"

### Discovery Call Forms (API: `/api/discovery-calls`)
- Form Config: `discovery_call`
- Button: "Schedule Discovery Call"
- Location: "Multiple Pages"

### Talk Growth Forms (API: `/api/talk-growth`)
- Form Config: `home_work_with_us`
- Button: "Work With Us"
- Location: "Home Page"

## Admin Dashboard Configuration

In the admin dashboard, forms section:
- Each form config has a **recipient emails** field
- When a form is submitted, emails go to the configured recipients
- No third-party service needed - just add SMTP email settings