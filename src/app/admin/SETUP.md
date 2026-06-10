# ─────────────────────────────────────────────────────────────────────────────
# Ubuntu BSF Integration — Setup Guide
# Read this before touching any file
# ─────────────────────────────────────────────────────────────────────────────


## 1. INSTALL NEXT-AUTH

npm install next-auth


## 2. CREATE .env.local IN YOUR PROJECT ROOT

Copy this block exactly — fill in the values marked with < >

```
NEXTAUTH_SECRET=<run this in terminal: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from Google Cloud Console — see step 3>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console — see step 3>
ADMIN_EMAILS=you@gmail.com,colleague@gmail.com
```

For production, change NEXTAUTH_URL to your live domain.
ADMIN_EMAILS is a comma-separated list — only these Google accounts
can sign in to the admin dashboard. Anyone else is blocked.


## 3. GOOGLE CLOUD CONSOLE (5 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project (or use an existing one)
3. APIs & Services → OAuth consent screen
   - User type: External
   - App name: Ubuntu Staff Portal
   - Add your own email as a test user while in development
4. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Name: Ubuntu Staff Portal
   - Authorised redirect URIs:
       http://localhost:3000/api/auth/callback/google   (development)
       https://yourdomain.com/api/auth/callback/google  (production)
5. Copy the Client ID and Client Secret into .env.local above


## 4. FILE PLACEMENT MAP

Place each file exactly where shown — paths matter in App Router.

```
your-project/
├── .env.local                                    ← NEW (never commit to git)
├── middleware.ts                                 ← NEW (project root)
│
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts                      ← NEW
│   │
│   └── admin/
│       ├── login/
│       │   └── page.tsx                          ← NEW
│       │
│       └── bsf/
│           ├── layout.tsx                        ← NEW
│           └── page.tsx                          ← NEW
│
├── components/
│   └── bsf/
│       ├── BsfDashboardClient.tsx                ← NEW (internal only)
│       └── BsfFarmSection.tsx                    ← NEW (public farm page)
│
└── lib/
    └── bsf-admin.data.ts                         ← NEW (confidential data)
```


## 5. ADD TO YOUR PUBLIC FARM PAGE

In whatever component is your farm page, add:

```tsx
import { BsfFarmSection } from '@/components/bsf/BsfFarmSection'

// Inside your page JSX, wherever the ecology/sustainability section belongs:
<BsfFarmSection />
```

BsfFarmSection imports only the public story copy from bsf-admin.data.ts.
It never renders any supply volumes, milestones, or export information.


## 6. ADD TO .gitignore

Make sure .env.local is ignored (it should be by default in Next.js):

```
.env.local
.env*.local
```

Never commit GOOGLE_CLIENT_SECRET or NEXTAUTH_SECRET to git.


## 7. ACCESSING THE DASHBOARD

Development:  http://localhost:3000/admin/bsf
Production:   https://yourdomain.com/admin/bsf

The middleware intercepts every /admin/* request.
Unauthenticated users are redirected to /admin/login.
Only emails listed in ADMIN_EMAILS can sign in.


## 8. UPDATING SUPPLY MILESTONES & ACTIONS

Open lib/bsf-admin.data.ts and:
- Change a milestone status from 'upcoming' to 'active' or 'completed'
- Set action items completed: true once done
- Add entries to SHIPMENT_LOG as weekly exports happen
- Toggle BSF Neonates active: true once client confirms interest

In a future phase, connect this to a database (Supabase recommended)
so the team can update it from the dashboard UI without editing code.


## 9. SECURITY CHECKLIST BEFORE GOING LIVE

□ NEXTAUTH_SECRET is a strong random string (openssl rand -base64 32)
□ NEXTAUTH_URL matches your production domain exactly
□ ADMIN_EMAILS contains only the accounts that should have access
□ .env.local is in .gitignore and has never been committed
□ Google OAuth redirect URI includes your production domain
□ bsf-admin.data.ts is never imported by any file outside app/admin/ or components/bsf/BsfDashboardClient.tsx

─────────────────────────────────────────────────────────────────────────────
Ubuntu | BSF Export Programme | Confidential — For Internal Use Only
─────────────────────────────────────────────────────────────────────────────
