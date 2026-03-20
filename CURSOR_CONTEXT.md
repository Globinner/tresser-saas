# BLADE - Barber SaaS Platform

## Project Overview

BLADE is a full-stack SaaS platform for barbershops built with Next.js 15, Supabase, and Vercel Blob. It provides barbershop owners with tools to manage appointments, clients, inventory, walk-in queues, and more.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| File Storage | Vercel Blob (private) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Charts | Recharts |
| Deployment | Vercel |

## Environment Variables

```env
# Supabase (auto-configured via Vercel integration)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vercel Blob (auto-configured via Vercel integration)
BLOB_READ_WRITE_TOKEN=

# Optional: For SMS reminders
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Database Schema

### Core Tables

```sql
-- shops: Barbershop profiles
shops (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,  -- Used for public booking URL
  email TEXT,
  phone TEXT,
  address TEXT,
  business_hours JSONB,  -- {"monday": {"open": "09:00", "close": "18:00"}, ...}
  created_at TIMESTAMPTZ
)

-- profiles: User profiles (auto-created on signup via trigger)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  shop_id UUID REFERENCES shops(id),
  full_name TEXT,
  role TEXT DEFAULT 'owner',  -- owner, barber, receptionist
  avatar_url TEXT,
  created_at TIMESTAMPTZ
)

-- services: Service menu
services (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration INTEGER,  -- in minutes
  is_active BOOLEAN DEFAULT true
)

-- clients: Client CRM
clients (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)

-- appointments: Booking system
appointments (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  barber_id UUID REFERENCES profiles(id),
  appointment_date DATE,
  start_time TIME,
  end_time TIME,
  status TEXT DEFAULT 'scheduled',  -- scheduled, confirmed, in-progress, completed, cancelled, no-show
  notes TEXT,
  created_at TIMESTAMPTZ
)

-- transactions: Revenue tracking
transactions (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  appointment_id UUID REFERENCES appointments(id),
  amount DECIMAL(10,2),
  payment_method TEXT,
  created_at TIMESTAMPTZ
)
```

### Feature Tables

```sql
-- client_chemistry: Chemical treatment records
client_chemistry (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  client_id UUID REFERENCES clients(id),
  treatment_type TEXT,  -- color, highlights, balayage, bleach, relaxer, perm, keratin, etc.
  brand TEXT,
  product_line TEXT,
  color_code TEXT,
  developer_volume INTEGER,  -- 10, 20, 30, 40
  mix_ratio TEXT,  -- "1:1", "1:2", etc.
  processing_time INTEGER,  -- minutes
  heat_applied BOOLEAN,
  formula_notes TEXT,
  result_rating INTEGER,  -- 1-5
  patch_test_date DATE,
  patch_test_result TEXT,  -- passed, failed, pending
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ
)

-- client_photos: Before/after photos
client_photos (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  client_id UUID REFERENCES clients(id),
  photo_type TEXT,  -- before, after
  blob_pathname TEXT,  -- Vercel Blob pathname (NOT public URL)
  notes TEXT,
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- walkin_queue: Walk-in management
walkin_queue (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  client_name TEXT,
  client_phone TEXT,
  service_id UUID REFERENCES services(id),
  barber_id UUID REFERENCES profiles(id),
  position INTEGER,
  status TEXT DEFAULT 'waiting',  -- waiting, in-service, completed, no-show
  estimated_wait INTEGER,  -- minutes
  check_in_time TIMESTAMPTZ,
  service_start_time TIMESTAMPTZ,
  service_end_time TIMESTAMPTZ
)

-- booking_settings: Public booking page config
booking_settings (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  is_enabled BOOLEAN DEFAULT false,
  advance_booking_days INTEGER DEFAULT 30,
  min_notice_hours INTEGER DEFAULT 2,
  allow_cancellation BOOLEAN DEFAULT true,
  cancellation_notice_hours INTEGER DEFAULT 24,
  booking_message TEXT
)

-- reminder_settings: Email/SMS reminder config
reminder_settings (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  email_enabled BOOLEAN DEFAULT true,
  email_hours_before INTEGER DEFAULT 24,
  email_template TEXT,
  sms_enabled BOOLEAN DEFAULT false,
  sms_hours_before INTEGER DEFAULT 2,
  sms_template TEXT,
  followup_enabled BOOLEAN DEFAULT false,
  followup_hours_after INTEGER DEFAULT 24
)

-- inventory_categories: Product categories
inventory_categories (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  name TEXT NOT NULL,
  description TEXT
)

-- inventory_items: Product inventory
inventory_items (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  category_id UUID REFERENCES inventory_categories(id),
  name TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,  -- Low stock alert threshold
  unit_cost DECIMAL(10,2),
  unit_price DECIMAL(10,2)
)

-- inventory_transactions: Stock movements
inventory_transactions (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  item_id UUID REFERENCES inventory_items(id),
  type TEXT,  -- stock_in, stock_out, adjustment
  quantity INTEGER,
  notes TEXT,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ
)
```

### Row Level Security (RLS)

All tables have RLS enabled. Policies ensure users can only access data belonging to their shop:

```sql
-- Example pattern used on all tables:
CREATE POLICY "Users can view own shop data" ON table_name
  FOR SELECT USING (
    shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
  );
```

## File Structure

```
/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Theme tokens, custom utilities
│   │
│   ├── auth/
│   │   ├── login/page.tsx          # Login form
│   │   ├── sign-up/page.tsx        # Registration (creates shop + profile)
│   │   ├── sign-up-success/page.tsx
│   │   └── error/page.tsx
│   │
│   ├── book/
│   │   └── [slug]/page.tsx         # Public booking page (no auth required)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell (sidebar, header)
│   │   ├── page.tsx                # Overview with stats
│   │   ├── appointments/page.tsx   # Appointment management
│   │   ├── clients/
│   │   │   ├── page.tsx            # Client list
│   │   │   └── [id]/page.tsx       # Client detail (photos, chemistry)
│   │   ├── services/page.tsx       # Service menu management
│   │   ├── team/page.tsx           # Team member management
│   │   ├── queue/page.tsx          # Walk-in queue
│   │   ├── inventory/page.tsx      # Inventory management
│   │   ├── analytics/page.tsx      # Revenue & performance charts
│   │   ├── billing/page.tsx        # Subscription management
│   │   └── settings/page.tsx       # Profile, shop, booking, reminders
│   │
│   └── api/
│       └── photos/
│           ├── upload/route.ts     # Upload to Vercel Blob
│           └── [pathname]/route.ts # Serve private blob files
│
├── components/
│   ├── navigation.tsx              # Landing page nav
│   ├── hero-section.tsx            # Landing hero
│   ├── features-grid.tsx           # Landing features
│   ├── pricing-section.tsx         # Landing pricing
│   ├── footer.tsx                  # Landing footer
│   │
│   ├── ui/                         # shadcn/ui components (pre-installed)
│   │
│   └── dashboard/
│       ├── sidebar.tsx             # Dashboard navigation
│       ├── header.tsx              # Top bar with user menu
│       ├── stats.tsx               # KPI cards
│       ├── revenue-chart.tsx       # Weekly revenue chart
│       ├── today-appointments.tsx  # Today's schedule
│       ├── appointments-list.tsx   # Full appointment list
│       ├── new-appointment-modal.tsx
│       ├── clients-list.tsx        # Client grid
│       ├── client-detail-view.tsx  # Client profile page
│       ├── new-client-modal.tsx
│       ├── client-chemistry.tsx    # Chemistry records list
│       ├── new-chemistry-modal.tsx # Add chemistry form
│       ├── client-photos.tsx       # Before/after gallery
│       ├── services-list.tsx
│       ├── new-service-modal.tsx
│       ├── team-list.tsx
│       ├── invite-team-modal.tsx
│       ├── walk-in-queue.tsx       # Queue management
│       ├── inventory-management.tsx
│       ├── analytics-overview.tsx
│       ├── settings-tabs.tsx       # Settings navigation
│       ├── profile-settings.tsx
│       ├── shop-settings.tsx
│       ├── booking-settings.tsx    # Public booking config
│       └── reminder-settings.tsx   # Email/SMS config
│
├── lib/
│   ├── utils.ts                    # cn() helper
│   └── supabase/
│       ├── client.ts               # Browser client (createBrowserClient)
│       ├── server.ts               # Server client (createServerClient)
│       └── middleware.ts           # Session refresh
│
├── middleware.ts                   # Auth middleware, protects /dashboard/*
│
└── scripts/                        # SQL migrations (already executed)
    ├── 001_create_tables.sql
    ├── 002_profile_trigger.sql
    ├── 003_seed_sample_data.sql
    ├── 004_client_chemistry.sql
    └── 005_additional_features.sql
```

## Authentication Flow

1. **Sign Up** (`/auth/sign-up`):
   - User enters email, password, shop name, full name
   - Supabase creates auth user
   - Database trigger auto-creates profile
   - User creates shop after email confirmation
   - Redirect to `/dashboard`

2. **Login** (`/auth/login`):
   - Email/password → Supabase auth
   - Middleware refreshes session cookies
   - Redirect to `/dashboard`

3. **Protected Routes**:
   - `middleware.ts` checks auth on `/dashboard/*`
   - Unauthenticated users → `/auth/login`
   - Supabase client fetches user's `shop_id` from profiles table

4. **Public Routes**:
   - `/` (landing), `/book/[slug]`, `/auth/*` are public

## Key Patterns

### Supabase Client Usage

```typescript
// Client Component
'use client'
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server Component / Route Handler
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Fetching Shop Data

All dashboard components fetch user's shop_id first:

```typescript
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles')
  .select('shop_id')
  .eq('id', user.id)
  .single()

// Then fetch shop-specific data
const { data } = await supabase
  .from('appointments')
  .select('*')
  .eq('shop_id', profile.shop_id)
```

### Private Blob Storage

Photos are stored privately and served through API:

```typescript
// Upload: POST /api/photos/upload
const blob = await put(file.name, file, { access: 'private' })
// Store blob.pathname in database (NOT the URL)

// Serve: GET /api/photos/[pathname]
const result = await get(pathname, { access: 'private' })
return new NextResponse(result.stream, { headers: {...} })

// Display in component
<img src={`/api/photos/${encodeURIComponent(pathname)}`} />
```

## Design System

### Theme (globals.css)

- Dark theme with obsidian black background
- Electric amber/gold primary color (`oklch(0.78 0.18 75)`)
- Custom utilities: `.glass`, `.glow-amber`, `.text-gradient`, `.grain`

### Fonts

- Headings: Space Grotesk
- Mono: JetBrains Mono

## What's Working

- [x] Landing page with full marketing site
- [x] Auth (signup, login, logout, email confirmation)
- [x] Dashboard overview with stats
- [x] Appointment management (CRUD, status updates)
- [x] Client management (CRUD, detail view)
- [x] Client chemistry tracking (formulas, developer %, results)
- [x] Before/after photo gallery (private blob storage)
- [x] Services management
- [x] Team management
- [x] Walk-in queue (real-time with Supabase subscriptions)
- [x] Inventory management (categories, items, stock tracking)
- [x] Public booking page (`/book/[slug]`)
- [x] Settings (profile, shop, booking, reminders)
- [x] Analytics charts

## What Could Be Added

- [ ] Stripe integration for real payments
- [ ] Actual SMS sending (Twilio integration)
- [ ] Email sending for reminders (Resend/SendGrid)
- [ ] Real-time appointment notifications
- [ ] Calendar sync (Google Calendar)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Export data (CSV/PDF reports)

## Running Locally

```bash
# Clone repo
git clone <repo-url>
cd blade

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and Blob tokens

# Run development server
pnpm dev
```

## Deployment

Already deployed on Vercel. Any push to main branch auto-deploys.

To redeploy manually: `vercel --prod`
