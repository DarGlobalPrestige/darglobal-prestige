# DarGlobal Prestige

Luxury real estate investment platform for DarGlobal. Built with Next.js 14, Tailwind CSS, and Wix Headless CMS.

## Features

- **Homepage** – Hero, cities, featured properties, mission teaser
- **Mission** – Philosophy, pillars, values
- **Investment Opportunities** – Full vs fractional paths, property grid
- **Cities** – Destinations with property listings per city
- **Properties** – Individual pages with advanced calculator, fractional investor preview
- **4-Step Application** – Path → Cities/Properties → Preferences → Account
- **User Dashboard** – KYC, documents, investments (backoffice)
- **Admin Panel** – Analytics, applications, properties (tag-based access)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Wix Headless CMS (`@wix/sdk`)
- bcryptjs for password hashing

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and add Wix credentials
3. `npm run dev`

## Wix CMS Collections (to create)

- **Members**: fullName, email, phone, country, passwordHash, tags (e.g. "Admin")
- **Applications**: memberEmail, fullName, path, properties, cities, budgetRange, shareRange, status, kycStatus

Admin access: Members with tag `Admin` get access to `/admin` pages.
