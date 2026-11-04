# BOUJEELUX — Cloudflare Pages + Supabase starter

This is a migration starter based on the current BOUJEELUX pages and supplied current logo/property photos. It is not connected to the live domain and does not change the existing AppDeploy site.

## Included
- Home, About, Apartments, Contact and Admin pages
- Two starting apartment blocks at ₦150,000 and ₦230,000 per night
- 10% weekly discount display for stays of 7+ nights
- Booking enquiry opens the official WhatsApp conversation; no online payment is taken
- Supabase database, email-link admin login and image storage
- Admin allowlist is `Boujeelux24@gmail.com`
- Admin can edit listings, rates, labels, upload/remove photos and add apartments

## Before deployment
1. Create a `.env` file from `.env.example` with the Supabase Project URL and publishable key.
2. In Supabase SQL Editor, run `supabase/setup.sql`.
3. In Supabase Authentication, add/confirm `Boujeelux24@gmail.com` as the admin user and configure the allowed redirect URL for the Cloudflare Pages site.
4. Test admin login and public listing reads on a preview deployment before connecting `boujee.ng`.

Never put a Supabase secret/service-role key in this project. The publishable key is designed for browser use; database access is protected by the SQL row-level security policies.

## Run locally
`npm install`
`npm run dev`

## Cloudflare Pages
Build command: `npm run build`
Build output directory: `dist`
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables.

The original AppDeploy site and DNS should remain unchanged until the Cloudflare preview is verified.
