# Aradads Home (Ghana) - Supabase & Python Backend Setup

This guide shows you how to connect **Aradads Home** to **Supabase** for your **PostgreSQL Database** and **Media Photo Storage (Cloudinary alternative)**, completely on the **$0/month Free Tier**.

---

## Why this setup saves money (No Render, 100% Free):
* **Supabase** provides your **PostgreSQL Database** + **Media/Image Storage** + **Auth** all in one place.
* **Vercel** hosts your frontend + Python backend functions for **$0/month**.
* **Zero monthly bills**: Unlike Render ($7–$15+/mo) or Contabo ($6+/mo), this entire stack is **$0.00/month**.

---

## Step 1: Create your Free Supabase Project (2 Minutes)

1. Go to **[supabase.com](https://supabase.com)** and click **Sign Up** (or log in with GitHub/Google).
2. Click **New Project**.
3. Choose:
   * **Project Name**: `aradads-home`
   * **Database Password**: (Save this in a safe place)
   * **Region**: Choose **West EU (London or Frankfurt)** or **East US** (closest to Ghana for low latency).
   * **Pricing Plan**: Free ($0/month).
4. Click **Create new project**.

---

## Step 2: Create Tables & Storage (10 Seconds)

1. In your Supabase dashboard, click **SQL Editor** on the left menu (the icon with `>_`).
2. Click **New query**.
3. Open the file `backend/supabase_schema.sql` from this codebase, copy all its content, and paste it into the Supabase SQL Editor.
4. Click **Run** (or `Cmd/Ctrl + Enter`).

**What this automatically sets up for you:**
* `apartments` table (pre-seeded with Cantonments, Airport Residential, East Legon, etc.)
* `bookings` table (with MoMo / Card tracking)
* `reviews` table
* `user_profiles` table
* `residence-photos` **Storage Bucket** (replacing Cloudinary for all your apartment pictures!)
* Row Level Security (RLS) policies allowing secure reading & writing.

---

## Step 3: Get Your API Keys

In your Supabase project dashboard:
1. Go to **Project Settings** (gear icon at the bottom left) -> **API**.
2. Copy:
   * **Project URL**: e.g., `https://xyzcompany.supabase.co`
   * **anon public key**: e.g., `eyJhbGciOi...`

Add them to your `.env` or Vercel Environment Variables:
```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_KEY=eyJhbGciOi...
```

---

## Step 4: How Media Photos Work (Supabase Storage)

You do **not** need Cloudinary. Supabase Storage handles all apartment photos:
1. In your Supabase dashboard, click **Storage** -> you will see the `residence-photos` bucket created automatically.
2. You can drag and drop apartment photos directly here, or upload them via the **Aradads Home Host Dashboard**.
3. Every photo uploaded gets a fast, permanent, worldwide CDN URL:
   `https://xyzcompany.supabase.co/storage/v1/object/public/residence-photos/apartments/your-photo.jpg`

---

## Step 5: Running the Python Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 server.py
```
The Python server starts on `http://localhost:8000`:
* Interactive API Documentation (Swagger): `http://localhost:8000/api/docs`
* Health Check: `http://localhost:8000/api/health`
