#  Umbu Houses — Villa Booking Web Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)

**A modern, full-stack villa booking platform built with Next.js 16 App Router.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Database](#-database-schema) · [Project Structure](#-project-structure) · [Application Flow](#-application-flow)

</div>

---

##  Features

###  Guest (No Login Required)
-  **Landing Page** — Hero section, about us, recommended villas, reviews, and footer
-  **Villa Catalog** — Browse all available villas with search functionality
-  **Villa Detail** — View villa photos, amenities, capacity, and pricing

###  Authenticated User
-  **Date Picker Booking** — Select check-in/check-out dates with availability validation
-  **Double Booking Prevention** — System automatically blocks dates already reserved
-  **Online Payment** — Secure checkout via Midtrans payment gateway
-  **My Reservations** — Track booking history and payment status
-  **Complete Payment** — Resume unpaid bookings directly from reservation list

###  Admin Dashboard
-  **Dashboard Overview** — Statistics with interactive charts (Recharts)
-  **Villa CRUD** — Create, read, update, and delete villas with image uploads
-  **Multi-Image Gallery** — Upload multiple photos per villa
-  **Reservation Management** — View all bookings, update status (Confirm/Cancel)
-  **Role-Based Access** — Only admin accounts can access the dashboard

###  Security & Authentication
-  **Google OAuth** — Sign in with Google via NextAuth v5 (Auth.js)
-  **JWT Strategy** — Secure session management with role embedded in token
-  **Route Protection** — Middleware (proxy.ts) protects admin and user-only routes
-  **Auto Redirect** — Admins are redirected to dashboard after login

---

##  Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Button, Calendar, Popover) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) |
| **Authentication** | [NextAuth v5 (Auth.js)](https://authjs.dev/) with Google Provider |
| **Payment Gateway** | [Midtrans](https://midtrans.com/) (Snap) |
| **Date Handling** | [date-fns](https://date-fns.org/) + [React Day Picker](https://react-day-picker.js.org/) |
| **Linting** | [ESLint 9](https://eslint.org/) |

---

##  Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/liv-lauflove/booking-villa.git
cd booking-villa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (or `.env.local`) with the following variables:

```env
# === Authentication (NextAuth v5) ===
AUTH_SECRET="your-random-secret-key-here"
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# === Database (Supabase PostgreSQL) ===
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# === Payment Gateway (Midtrans Sandbox) ===
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-xxxxxxxxxxxx"
MIDTRANS_SERVER_KEY="Mid-server-xxxxxxxxxxxx"
```

#### How to Get These Keys:

| Key | Where to Get It |
|---|---|
| `AUTH_SECRET` | Run `npx auth secret` or generate a random string |
| `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client IDs |
| `DATABASE_URL` & `DIRECT_URL` | [Supabase Dashboard](https://supabase.com/) → Project Settings → Database → Connection String |
| `MIDTRANS_CLIENT_KEY` & `MIDTRANS_SERVER_KEY` | [Midtrans Dashboard](https://dashboard.midtrans.com/) → Settings → Access Keys (switch to Sandbox mode) |

> **Note:** For Google OAuth, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in your Google Cloud Console.

### 4. Set Up the Database

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. (Optional) Set Up Admin Account

After signing in with Google for the first time, manually update your user role in the database:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

Or use Prisma Studio:

```bash
npx prisma studio
```

Navigate to the `User` table and change the `role` field from `user` to `admin`.

---

##  Database Schema

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Account : "has"
    User ||--o{ Reservation : "makes"
    Villa ||--o{ Reservation : "booked in"
    Villa ||--o{ VillaImage : "has"
    Villa ||--o{ VillaAmenities : "has"
    Amenity ||--o{ VillaAmenities : "belongs to"
    Reservation ||--o| Payment : "paid via"

    User {
        string id PK
        string name
        string email UK
        datetime emailVerified
        string image
        string role
        string phone
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string provider PK
        string providerAccountId PK
        string userId FK
        string type
        string refresh_token
        string access_token
        int expires_at
        string token_type
        string scope
        string id_token
        string session_state
    }

    Villa {
        string id PK
        string name
        string description
        int price
        int capacity
        datetime createdAt
        datetime updatedAt
    }

    VillaImage {
        string id PK
        string url
        string title
        string villaId FK
        datetime createdAt
    }

    Amenity {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }

    VillaAmenities {
        string id PK
        string villaId FK
        string amenityId FK
    }

    Reservation {
        string id PK
        datetime startDate
        datetime endDate
        int price
        string userId FK
        string villaId FK
        string status
        string guestName
        string guestPhone
        string guestEmail
        int guestCount
        string notes
        datetime createdAt
        datetime updatedAt
    }

    Payment {
        string id PK
        string method
        int amount
        string status
        string reservationId FK
        datetime createdAt
        datetime updatedAt
    }
```

### Enums

| Enum | Values |
|---|---|
| `ReservationStatus` | `PENDING` · `CONFIRMED` · `CANCELLED` · `COMPLETED` |
| `PaymentMethod` | `CREDIT_CARD` · `BANK_TRANSFER` · `E_WALLET` |
| `PaymentStatus` | `UNPAID` · `PENDING` · `PAID` · `FAILED` · `REFUNDED` |

---

##  Project Structure

```
booking-villa/
├── app/                              # App Router (pages & routes)
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page (/)
│   ├── globals.css                   # Global styles & design tokens
│   │
│   ├── signin/                       # Sign in page
│   ├── auth-redirect/                # Role-based redirect after login
│   ├── villas/                       # Villa catalog & detail
│   │   ├── page.tsx                  #   /villas
│   │   └── [id]/page.tsx             #   /villas/:id
│   ├── checkout/[id]/                # Checkout & payment
│   ├── reservations/                 # User booking history
│   │
│   ├── admin/                        # Admin dashboard (protected)
│   │   ├── layout.tsx                #   Admin layout (sidebar)
│   │   ├── page.tsx                  #   Dashboard overview
│   │   ├── villas/                   #   Villa management
│   │   │   ├── page.tsx              #     Villa list
│   │   │   ├── create/page.tsx       #     Create villa
│   │   │   └── [id]/edit/page.tsx    #     Edit villa
│   │   └── reservations/page.tsx     #   Reservation management
│   │
│   └── api/                          # API routes
│       ├── auth/[...nextauth]/       #   NextAuth handlers
│       └── webhook/midtrans/         #   Payment webhook
│
├── components/                       # Reusable React components
│   ├── ui/                           #   shadcn/ui primitives
│   ├── admin/                        #   Admin-specific components
│   ├── villa/                        #   Villa-related components
│   ├── Navbar.tsx                    #   Navigation bar
│   ├── Hero.tsx                      #   Hero section
│   ├── AboutUs.tsx                   #   About us section
│   ├── RecommendedVillas.tsx         #   Recommended villas
│   ├── Reviews.tsx                   #   Testimonials
│   ├── Footer.tsx                    #   Footer
│   └── LoginButton.tsx               #   Google sign-in button
│
├── lib/                              # Utilities & server logic
│   ├── prisma.ts                     #   Prisma client singleton
│   ├── utils.ts                      #   Utility functions
│   ├── midtrans.ts                   #   Midtrans Snap client
│   └── actions/                      #   Server Actions
│       ├── villa.ts                  #     Villa CRUD
│       ├── reservation.ts            #     Booking logic
│       └── payment.ts                #     Payment processing
│
├── types/                            # TypeScript definitions
│   ├── next-auth.d.ts                #   NextAuth type augmentation
│   └── midtrans-client.d.ts          #   Midtrans type declaration
│
├── prisma/                           # Database
│   ├── schema.prisma                 #   Database schema
│   └── migrations/                   #   Migration files
│
├── auth.ts                           # NextAuth configuration
├── auth.config.ts                    # NextAuth Edge-compatible config
├── proxy.ts                          # Route protection middleware
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

---

##  Application Flow

### User Booking Flow

```mermaid
flowchart TD
    A[Visit Landing Page] --> B[Browse Villa Catalog]
    B --> C[View Villa Detail]
    C --> D{Want to Book?}
    D -->|No| B
    D -->|Yes| E{Logged In?}
    E -->|No| F[Sign In with Google]
    F --> G[Redirect Back]
    E -->|Yes| G[Select Dates]
    G --> H{Dates Available?}
    H -->|No| I[Show Error - Pick Other Dates]
    I --> G
    H -->|Yes| J[Fill Guest Details]
    J --> K[System Calculates Price]
    K --> L[Checkout Page]
    L --> M[Pay via Midtrans]
    M --> N{Payment Successful?}
    N -->|No| O[Retry Payment]
    O --> M
    N -->|Yes| P[Booking Confirmed!]
    P --> Q[View in My Reservations]
```

### Admin Management Flow

```mermaid
flowchart TD
    A[Sign In with Google] --> B{Role = Admin?}
    B -->|No| C[Redirect to Homepage]
    B -->|Yes| D[Admin Dashboard]
    D --> E{Choose Action}

    E -->|Manage Villas| F[Villa List]
    F --> G{Action?}
    G -->|Create| H[Fill Villa Form + Upload Photos]
    H --> I[Save to Database]
    I --> F
    G -->|Edit| J[Update Villa Data]
    J --> I
    G -->|Delete| K[Confirm & Delete]
    K --> F

    E -->|Manage Reservations| L[Reservation Table]
    L --> M{Action?}
    M -->|Confirm| N[Update Status to CONFIRMED]
    N --> L
    M -->|Cancel| O[Update Status to CANCELLED]
    O --> L

    E -->|View Stats| P[Dashboard Charts]
```

### Authentication & Route Protection

```mermaid
flowchart LR
    A[Any Request] --> B[proxy.ts Middleware]
    B --> C{Route Type?}

    C -->|Public| D[Allow Access]
    C -->|/signin| E{Already Logged In?}
    E -->|Yes| F[Redirect to Home]
    E -->|No| D

    C -->|/reservations /checkout| G{Logged In?}
    G -->|No| H[Redirect to Sign In]
    G -->|Yes| D

    C -->|/admin/*| I{Logged In?}
    I -->|No| H
    I -->|Yes| J{Role = Admin?}
    J -->|No| K[Redirect to Home]
    J -->|Yes| D
```

---

##  Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start development server with Turbopack |
| **Build** | `npm run build` | Create production build |
| **Start** | `npm start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint |
| **Prisma Studio** | `npx prisma studio` | Open database GUI |
| **Prisma Generate** | `npx prisma generate` | Generate Prisma client |
| **Prisma Push** | `npx prisma db push` | Sync schema to database |

---

##  Deployment

This application is designed to be deployed on **[Vercel](https://vercel.com/)**:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables from `.env` to Vercel's project settings
4. Deploy!

> **Important:** Make sure to update `AUTH_GOOGLE_ID` redirect URIs in Google Cloud Console to include your production URL: `https://your-domain.vercel.app/api/auth/callback/google`

---

##  License

This project is private and developed as part of a learning project.

---

<div align="center">

**Built with ❤️. by Liv's the greatest**

</div>
