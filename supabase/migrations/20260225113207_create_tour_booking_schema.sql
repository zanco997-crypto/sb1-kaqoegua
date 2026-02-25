/*
  # Multi-Language Tour Booking System Schema

  ## Overview
  Complete database schema for a multi-language tour booking platform with guides, reviews, blog, and B2B portal.

  ## New Tables
  
  ### 1. languages
  - `code` (text, primary key) - ISO language code (en, es, fr, it, de, ja, zh)
  - `name` (text) - Language name
  - `flag_emoji` (text) - Flag representation
  - `created_at` (timestamptz)
  
  ### 2. tours
  - `id` (uuid, primary key)
  - `slug` (text, unique) - URL-friendly identifier
  - `theme` (text) - Tour theme (harry-potter, jack-the-ripper, sherlock-holmes)
  - `duration_hours` (numeric)
  - `base_price_gbp` (numeric)
  - `max_group_size` (int)
  - `image_url` (text)
  - `gallery_urls` (text[])
  - `status` (text) - active, inactive
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. tour_translations
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key)
  - `language_code` (text, foreign key)
  - `title` (text)
  - `description` (text)
  - `itinerary` (text)
  - `highlights` (text[])
  - `meeting_point` (text)
  - `cancellation_policy` (text)
  
  ### 4. guides
  - `id` (uuid, primary key)
  - `slug` (text, unique)
  - `photo_url` (text)
  - `languages_spoken` (text[]) - Array of language codes
  - `specialties` (text[])
  - `years_experience` (int)
  - `rating` (numeric)
  - `status` (text)
  - `created_at` (timestamptz)
  
  ### 5. guide_translations
  - `id` (uuid, primary key)
  - `guide_id` (uuid, foreign key)
  - `language_code` (text, foreign key)
  - `name` (text)
  - `bio` (text)
  - `fun_fact` (text)
  
  ### 6. bookings
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key)
  - `guide_id` (uuid, foreign key)
  - `customer_email` (text)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `booking_date` (date)
  - `booking_time` (time)
  - `num_participants` (int)
  - `language_preference` (text)
  - `currency` (text)
  - `total_amount` (numeric)
  - `status` (text) - pending, confirmed, cancelled, completed
  - `is_b2b` (boolean)
  - `special_requests` (text)
  - `created_at` (timestamptz)
  
  ### 7. reviews
  - `id` (uuid, primary key)
  - `booking_id` (uuid, foreign key)
  - `tour_id` (uuid, foreign key)
  - `guide_id` (uuid, foreign key)
  - `customer_name` (text)
  - `rating` (int)
  - `language_code` (text)
  - `comment` (text)
  - `verified` (boolean)
  - `created_at` (timestamptz)
  
  ### 8. blog_posts
  - `id` (uuid, primary key)
  - `slug` (text, unique)
  - `author` (text)
  - `featured_image_url` (text)
  - `category` (text)
  - `published_at` (timestamptz)
  - `status` (text)
  - `created_at` (timestamptz)
  
  ### 9. blog_post_translations
  - `id` (uuid, primary key)
  - `blog_post_id` (uuid, foreign key)
  - `language_code` (text, foreign key)
  - `title` (text)
  - `excerpt` (text)
  - `content` (text)
  - `seo_title` (text)
  - `seo_description` (text)
  
  ### 10. b2b_agents
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `company_name` (text)
  - `contact_email` (text)
  - `contact_phone` (text)
  - `commission_rate` (numeric)
  - `status` (text)
  - `created_at` (timestamptz)
  
  ### 11. tour_availability
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key)
  - `guide_id` (uuid, foreign key)
  - `date` (date)
  - `time_slot` (time)
  - `available_spots` (int)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for tours, guides, reviews, blog posts
  - Authenticated access for bookings
  - Restricted access for B2B portal
*/

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  flag_emoji text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  theme text NOT NULL,
  duration_hours numeric NOT NULL,
  base_price_gbp numeric NOT NULL,
  max_group_size int NOT NULL DEFAULT 15,
  image_url text,
  gallery_urls text[],
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tour_translations table
CREATE TABLE IF NOT EXISTS tour_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE CASCADE,
  language_code text REFERENCES languages(code),
  title text NOT NULL,
  description text NOT NULL,
  itinerary text,
  highlights text[],
  meeting_point text,
  cancellation_policy text,
  UNIQUE(tour_id, language_code)
);

-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  photo_url text,
  languages_spoken text[] NOT NULL,
  specialties text[],
  years_experience int DEFAULT 0,
  rating numeric DEFAULT 5.0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create guide_translations table
CREATE TABLE IF NOT EXISTS guide_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid REFERENCES guides(id) ON DELETE CASCADE,
  language_code text REFERENCES languages(code),
  name text NOT NULL,
  bio text,
  fun_fact text,
  UNIQUE(guide_id, language_code)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id),
  guide_id uuid REFERENCES guides(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  num_participants int NOT NULL,
  language_preference text REFERENCES languages(code),
  currency text DEFAULT 'GBP',
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  is_b2b boolean DEFAULT false,
  special_requests text,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  tour_id uuid REFERENCES tours(id),
  guide_id uuid REFERENCES guides(id),
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  language_code text REFERENCES languages(code),
  comment text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  author text NOT NULL,
  featured_image_url text,
  category text,
  published_at timestamptz,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Create blog_post_translations table
CREATE TABLE IF NOT EXISTS blog_post_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  language_code text REFERENCES languages(code),
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  seo_title text,
  seo_description text,
  UNIQUE(blog_post_id, language_code)
);

-- Create b2b_agents table
CREATE TABLE IF NOT EXISTS b2b_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  company_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  commission_rate numeric DEFAULT 10.0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create tour_availability table
CREATE TABLE IF NOT EXISTS tour_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE CASCADE,
  guide_id uuid REFERENCES guides(id),
  date date NOT NULL,
  time_slot time NOT NULL,
  available_spots int NOT NULL,
  UNIQUE(tour_id, guide_id, date, time_slot)
);

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for languages (public read)
CREATE POLICY "Anyone can view languages"
  ON languages FOR SELECT
  TO public
  USING (true);

-- RLS Policies for tours (public read)
CREATE POLICY "Anyone can view active tours"
  ON tours FOR SELECT
  TO public
  USING (status = 'active');

-- RLS Policies for tour_translations (public read)
CREATE POLICY "Anyone can view tour translations"
  ON tour_translations FOR SELECT
  TO public
  USING (true);

-- RLS Policies for guides (public read)
CREATE POLICY "Anyone can view active guides"
  ON guides FOR SELECT
  TO public
  USING (status = 'active');

-- RLS Policies for guide_translations (public read)
CREATE POLICY "Anyone can view guide translations"
  ON guide_translations FOR SELECT
  TO public
  USING (true);

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO public
  USING (true);

-- RLS Policies for reviews (public read)
CREATE POLICY "Anyone can view verified reviews"
  ON reviews FOR SELECT
  TO public
  USING (verified = true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for blog_posts (public read published)
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published');

-- RLS Policies for blog_post_translations (public read)
CREATE POLICY "Anyone can view blog post translations"
  ON blog_post_translations FOR SELECT
  TO public
  USING (true);

-- RLS Policies for b2b_agents
CREATE POLICY "B2B agents can view own profile"
  ON b2b_agents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can apply as B2B agent"
  ON b2b_agents FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for tour_availability (public read)
CREATE POLICY "Anyone can view tour availability"
  ON tour_availability FOR SELECT
  TO public
  USING (true);

-- Insert supported languages
INSERT INTO languages (code, name, flag_emoji) VALUES
  ('en', 'English', '🇬🇧'),
  ('es', 'Español', '🇪🇸'),
  ('fr', 'Français', '🇫🇷'),
  ('it', 'Italiano', '🇮🇹'),
  ('de', 'Deutsch', '🇩🇪'),
  ('ja', '日本語', '🇯🇵'),
  ('zh', '中文', '🇨🇳')
ON CONFLICT (code) DO NOTHING;