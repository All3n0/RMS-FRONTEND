# Password Reset Frontend - Quick Start

## Setup

```bash
cd RMS-FRONTEND
npm install  # If not already done
cp .env.example .env.local
npm run dev
```

Frontend runs on **http://localhost:3000**

## Three New Pages

### 1️⃣ Forgot Password
**URL:** `http://localhost:3000/(auth)/forgot-password`

- User enters email
- Clicks "Send Reset Link"
- Sees confirmation message

### 2️⃣ Reset Password
**URL:** `http://localhost:3000/(auth)/reset-password?token=<token>`

- Token auto-verified from URL
- User enters new password
- Password strength meter guides input
- Confirm password match required
- Success confirmation on reset

### 3️⃣ Login Updated
**URL:** `http://localhost:3000/(auth)/login`

- "Forgot your password?" link now goes to forgot-password page

---

## Testing Flow (No Email)

**Step 1: Backend - Request Reset**
```bash
# In RMS-BACKEND directory
pipenv run python app.py
```

In another terminal:
```bash
curl -X POST http://127.0.0.1:5000/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Step 2: Copy Token from Backend Console**
```
Debug: Reset token for test@example.com: <copy-this-token>
```

**Step 3: Frontend - Visit Reset Page**
```
http://localhost:3000/(auth)/reset-password?token=<paste-token>
```

**Step 4: Enter New Password & Submit**
- Password strength meter shows: Weak → Fair → Strong
- Confirm password must match
- Click "Reset Password"
- See success message
- Click "Go to Login Now"

**Step 5: Login with New Password**
- Email: `test@example.com`
- Password: `<new-password>`

---

## Email Setup (Optional)

In backend `.env`:
```env
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Gmail app password
```

Then:
1. Request password reset via frontend
2. Check email (or spam folder)
3. Click link in email
4. Reset password

---

## File Locations

```
RMS-FRONTEND/
├── app/(auth)/
│   ├── forgot-password/
│   │   └── page.tsx          # NEW
│   ├── reset-password/
│   │   └── page.tsx          # NEW
│   ├── login/
│   │   └── page.tsx          # UPDATED
│   └── layout.tsx
├── .env.example              # NEW
├── .env.local                # Create from .env.example
└── PASSWORD_RESET_FRONTEND.md # Full docs
```

---

## Environment Variables

**`.env.local`:**
```env
# API URL (where Flask backend runs)
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000

# Frontend URL (for email links - optional)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

---

## Error Messages Handled

| Scenario | Message |
|----------|---------|
| Missing email | Validation error on form |
| Invalid token | "Invalid or expired reset link" |
| Expired token | "Token expired" |
| Passwords don't match | Real-time validation error |
| Weak password | Strength meter shows feedback |
| API error | "Failed to reset password" |

---

## Password Strength Requirements

The strength meter shows progress based on:
- ✓ At least 8 characters
- ✓ Uppercase letters (A-Z)
- ✓ Lowercase letters (a-z)  
- ✓ Numbers (0-9)
- ✓ Special characters (!@#$%)

Colors:
- 🔴 **Weak** (0-2 points)
- 🟡 **Fair** (2-3 points)  
- 🟢 **Strong** (3+ points)

Minimum allowed: **Fair** strength

---

## Component Features

### Forgot Password
- Email input validation
- Loading state with spinner
- Success confirmation (stays on page)
- "Send Another Link" option
- Links to login & forgot-password pages

### Reset Password
- Token verification on load
- Loading spinner while verifying
- Invalid token error state with retry option
- Password with show/hide toggle
- Password strength meter with checklist
- Confirm password field with match validation
- Success state with auto-redirect
- All links to login

### Login
- Updated "Forgot password?" link
- Works with new forgot-password page

---

## Common Issues

### "Cannot GET /reset-password"
**Problem:** Using wrong path format
**Solution:** Use full path: `/(auth)/reset-password?token=...`

### "API connection refused"
**Problem:** Backend not running
**Solution:** Start backend: `cd RMS-BACKEND && pipenv run python app.py`

### "Token invalid" on valid token
**Problem:** Token expired (30 min limit) or already used once
**Solution:** Request new reset link

### Password validation too strict
**Problem:** User can't meet strength requirements
**Solution:** Edit `reset-password/page.tsx` line ~50, change minimum from 8 to preferred value

### Styling looks wrong
**Problem:** Tailwind classes not loaded
**Solution:** `npm install` and restart dev server

---

## Testing Checklist

- [ ] Forgot password form submits
- [ ] Can see token in backend console (dev mode)
- [ ] Reset link loads and verifies token
- [ ] Password strength meter works
- [ ] Password match validation works
- [ ] Can submit reset form
- [ ] Success message appears
- [ ] Redirect to login works
- [ ] Can login with new password
- [ ] Old password doesn't work anymore

---

## Next Steps

1. Start frontend: `npm run dev`
2. Test forgot password flow
3. Test reset password flow (use console token)
4. Set up email (optional)
5. Deploy to production

---

See `PASSWORD_RESET_FRONTEND.md` for complete documentation.
