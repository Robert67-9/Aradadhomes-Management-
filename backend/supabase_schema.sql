-- ==============================================================================
-- Aradads Home Luxury Residences (Ghana)
-- Complete Supabase PostgreSQL Schema & Storage Setup
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Apartments Table
CREATE TABLE IF NOT EXISTS public.apartments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Ghana',
    neighborhood TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms NUMERIC(3, 1) NOT NULL DEFAULT 1.0,
    max_guests INTEGER NOT NULL DEFAULT 2,
    sqft INTEGER NOT NULL DEFAULT 800,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    property_type TEXT NOT NULL DEFAULT 'Residence',
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    house_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    check_in_time TEXT NOT NULL DEFAULT '14:00',
    check_out_time TEXT NOT NULL DEFAULT '11:00',
    cleaning_fee NUMERIC(10, 2) NOT NULL DEFAULT 80.0,
    service_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 8.0,
    taxes_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    host_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    blocked_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    apartment_id TEXT NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    apartment_title TEXT NOT NULL,
    apartment_image TEXT,
    apartment_city TEXT NOT NULL,
    apartment_address TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    total_nights INTEGER NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    cleaning_fee NUMERIC(10, 2) NOT NULL,
    service_fee NUMERIC(10, 2) NOT NULL,
    taxes NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, completed, cancelled
    payment_method TEXT NOT NULL DEFAULT 'momo', -- momo, card, apple_pay, google_pay
    payment_last4 TEXT NOT NULL DEFAULT '8901',
    invoice_number TEXT NOT NULL,
    access_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    apartment_id TEXT NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_country TEXT NOT NULL DEFAULT 'Ghana',
    author_avatar TEXT,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    categories JSONB NOT NULL DEFAULT '{}'::jsonb,
    date_label TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified_stay BOOLEAN NOT NULL DEFAULT TRUE,
    host_reply JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    preferred_currency TEXT NOT NULL DEFAULT 'GHS',
    language TEXT NOT NULL DEFAULT 'en',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    saved_apartment_ids JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row Level Security (RLS) Configuration
-- Allow public read access to apartments and reviews
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on apartments" ON public.apartments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated or service insert on apartments" ON public.apartments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated or service update on apartments" ON public.apartments FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated or service delete on apartments" ON public.apartments FOR DELETE USING (true);

CREATE POLICY "Allow public read on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reviews" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bookings" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Allow read on user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow write on user_profiles" ON public.user_profiles FOR ALL USING (true);

-- 6. Setup Supabase Storage Bucket for Apartment Photos (replaces Cloudinary)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('residence-photos', 'residence-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read on residence-photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'residence-photos');

CREATE POLICY "Allow upload to residence-photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'residence-photos');

-- 7. Seed Initial Ghana Luxury Residences
INSERT INTO public.apartments (
    id, title, subtitle, description, city, country, neighborhood, 
    lat, lng, price_per_night, currency, rating, review_count, 
    bedrooms, bathrooms, max_guests, sqft, featured, property_type, 
    images, amenities, house_rules, host_info, blocked_dates
) VALUES 
(
    'apt-cantonments-accra',
    'The Cantonments Presidential Sky Villa',
    'Private plunge pool, 24/7 solar standby power, and lush tropical rooftop terrace',
    'An oasis of contemporary West African luxury in prestigious Cantonments, Accra. Features open-plan Italian marble living spaces, floor-to-ceiling tinted UV glass, private rooftop lap plunge pool, backup solar inverter with 24/7 silent power, and bespoke handcrafted teak furniture by local Ghanaian artisans.',
    'Accra', 'Ghana', 'Cantonments',
    5.5840, -0.1770, 340.00, 'GHS', 4.99, 48,
    3, 3.5, 6, 2400, true, 'Villa',
    '["/src/assets/images/apt_accra_luxury_1790379220032.jpg", "/src/assets/images/hero_luxury_apartment_1790378080480.jpg"]'::jsonb,
    '["24/7 Solar & Silent Generator Power Backup", "Private Rooftop Plunge Pool", "24/7 Uniformed Security & Concierge", "High-Speed Fiber Internet (500 Mbps)", "Chef Kitchen with Quartz Island", "Air Conditioning in All Rooms", "Complimentary Airport Chauffeur (Kotoka ACC)"]'::jsonb,
    '["Respectful noise levels after 22:00", "Registered guests only unless prior concierge clearance", "Strictly non-smoking inside residences"]'::jsonb,
    '{"name": "Kwame Mensah", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80", "superhost": true, "responseRate": "100% within 10 min", "joinedYear": 2021}'::jsonb,
    '["2026-10-15", "2026-10-16"]'::jsonb
),
(
    'apt-airport-residential',
    'The Airport Residential Executive Suite',
    '5 minutes from Kotoka Airport with private pool, garden terrace & full generator backup',
    'Premier executive sanctuary nestled in the tranquil, tree-lined Airport Residential Area. Designed for diplomats, executives, and discerning families. Includes dedicated chauffeur pickup from Kotoka International Airport (ACC), private lap pool, high-speed fiber Wi-Fi, and 24/7 uninterrupted solar/generator power.',
    'Accra', 'Ghana', 'Airport Residential',
    5.6045, -0.1870, 290.00, 'GHS', 4.97, 39,
    2, 2.0, 4, 1650, true, 'Penthouse',
    '["/src/assets/images/hero_luxury_apartment_1790378080480.jpg", "/src/assets/images/apt_accra_luxury_1790379220032.jpg"]'::jsonb,
    '["5 Minutes from Kotoka International Airport", "24/7 Standby Generator & Solar Inverter", "Swimming Pool & Sun Deck", "High-Speed Wi-Fi (1 Gbps)", "24/7 Gated Security & Electric Fencing", "Borehole & Treated Water Reservoir"]'::jsonb,
    '["Quiet hours after 22:30", "No commercial events without prior host clearance", "Self check-in via smart keypad lock"]'::jsonb,
    '{"name": "Akosua Darko", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80", "superhost": true, "responseRate": "100% within 15 min", "joinedYear": 2020}'::jsonb,
    '["2026-10-10", "2026-10-11", "2026-10-12"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
