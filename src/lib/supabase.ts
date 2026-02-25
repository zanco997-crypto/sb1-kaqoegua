import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Tour {
  id: string;
  slug: string;
  theme: string;
  duration_hours: number;
  base_price_gbp: number;
  max_group_size: number;
  image_url: string;
  gallery_urls: string[];
  status: string;
}

export interface TourTranslation {
  tour_id: string;
  language_code: string;
  title: string;
  description: string;
  itinerary: string;
  highlights: string[];
  meeting_point: string;
  cancellation_policy: string;
}

export interface Guide {
  id: string;
  slug: string;
  photo_url: string;
  languages_spoken: string[];
  specialties: string[];
  years_experience: number;
  rating: number;
  status: string;
}

export interface GuideTranslation {
  guide_id: string;
  language_code: string;
  name: string;
  bio: string;
  fun_fact: string;
}

export interface Review {
  id: string;
  tour_id: string;
  guide_id: string;
  customer_name: string;
  rating: number;
  language_code: string;
  comment: string;
  verified: boolean;
  created_at: string;
}

export interface Language {
  code: string;
  name: string;
  flag_emoji: string;
}

export interface Booking {
  tour_id: string;
  guide_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  booking_date: string;
  booking_time: string;
  num_participants: number;
  language_preference: string;
  currency: string;
  total_amount: number;
  is_b2b?: boolean;
  special_requests?: string;
}

export interface TourAvailability {
  id: string;
  tour_id: string;
  guide_id: string;
  date: string;
  time_slot: string;
  available_spots: number;
}

export interface AvailabilityWithGuide extends TourAvailability {
  guide_slug: string;
  guide_photo: string;
  guide_languages: string[];
  guide_rating: number;
  spots_remaining: number;
  base_capacity: number;
  booked_count: number;
}
