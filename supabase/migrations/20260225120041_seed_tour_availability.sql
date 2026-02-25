/*
  # Seed Tour Availability Data

  ## Purpose
  Populate the tour_availability table with realistic availability data for the next 90 days.
  Assign guides to specific time slots based on their specialties and language capabilities.

  ## Details
  - Generates availability for 3 tours (Harry Potter, Jack the Ripper, Sherlock Holmes)
  - Creates 2-3 time slots per day per tour
  - Assigns guides based on specialties and languages
  - Varies available spots to simulate realistic booking scenarios
  - Includes some fully booked and limited availability slots

  ## Sample Bookings
  - Adds realistic bookings to reduce available spots
  - Creates booking history for review context
*/

-- First, let's add some sample bookings to make the availability realistic
INSERT INTO bookings (tour_id, guide_id, customer_email, customer_name, customer_phone, booking_date, booking_time, num_participants, language_preference, currency, total_amount, status)
SELECT 
  t.id,
  g.id,
  'customer' || gs.n || '@example.com',
  'Customer ' || gs.n,
  '+44 20 1234 ' || LPAD(gs.n::text, 4, '0'),
  CURRENT_DATE + (gs.n % 30),
  CASE (gs.n % 3)
    WHEN 0 THEN '10:00'::time
    WHEN 1 THEN '14:00'::time
    ELSE '18:00'::time
  END,
  (gs.n % 4) + 1,
  CASE (gs.n % 3)
    WHEN 0 THEN 'en'
    WHEN 1 THEN 'es'
    ELSE 'fr'
  END,
  'GBP',
  t.base_price_gbp * ((gs.n % 4) + 1),
  'confirmed'
FROM tours t
CROSS JOIN guides g
CROSS JOIN generate_series(1, 15) gs(n)
WHERE t.slug = 'harry-potter-magical-london' 
  AND g.slug = 'emma-wilson'
  AND gs.n <= 15
ON CONFLICT DO NOTHING;

-- Generate availability for Harry Potter tour (next 90 days)
INSERT INTO tour_availability (tour_id, guide_id, date, time_slot, available_spots)
SELECT 
  t.id,
  g.id,
  date_series.date,
  time_slot,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (0, 6) THEN 20
    WHEN random() < 0.1 THEN 5
    WHEN random() < 0.05 THEN 0
    ELSE 15
  END as available_spots
FROM tours t
CROSS JOIN (
  SELECT id, slug, languages_spoken 
  FROM guides 
  WHERE 'harry-potter' = ANY(specialties) AND status = 'active'
) g
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  INTERVAL '1 day'
) date_series(date)
CROSS JOIN (
  VALUES ('10:00'::time), ('14:00'::time)
) AS times(time_slot)
WHERE t.slug = 'harry-potter-magical-london'
  AND EXTRACT(DOW FROM date_series.date) NOT IN (2)
ON CONFLICT (tour_id, guide_id, date, time_slot) DO NOTHING;

-- Generate availability for Jack the Ripper tour
INSERT INTO tour_availability (tour_id, guide_id, date, time_slot, available_spots)
SELECT 
  t.id,
  g.id,
  date_series.date,
  time_slot,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (5, 6) THEN 15
    WHEN random() < 0.15 THEN 3
    WHEN random() < 0.08 THEN 0
    ELSE 12
  END as available_spots
FROM tours t
CROSS JOIN (
  SELECT id, slug, languages_spoken 
  FROM guides 
  WHERE 'jack-the-ripper' = ANY(specialties) AND status = 'active'
) g
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  INTERVAL '1 day'
) date_series(date)
CROSS JOIN (
  VALUES ('18:00'::time), ('20:00'::time)
) AS times(time_slot)
WHERE t.slug = 'jack-the-ripper-dark-london'
  AND EXTRACT(DOW FROM date_series.date) NOT IN (1)
ON CONFLICT (tour_id, guide_id, date, time_slot) DO NOTHING;

-- Generate availability for Sherlock Holmes tour
INSERT INTO tour_availability (tour_id, guide_id, date, time_slot, available_spots)
SELECT 
  t.id,
  g.id,
  date_series.date,
  time_slot,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (0, 6) THEN 18
    WHEN random() < 0.12 THEN 4
    WHEN random() < 0.06 THEN 0
    ELSE 14
  END as available_spots
FROM tours t
CROSS JOIN (
  SELECT id, slug, languages_spoken 
  FROM guides 
  WHERE 'sherlock-holmes' = ANY(specialties) AND status = 'active'
) g
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  INTERVAL '1 day'
) date_series(date)
CROSS JOIN (
  VALUES ('11:00'::time), ('15:00'::time)
) AS times(time_slot)
WHERE t.slug = 'sherlock-holmes-mystery-tour'
  AND EXTRACT(DOW FROM date_series.date) NOT IN (3)
ON CONFLICT (tour_id, guide_id, date, time_slot) DO NOTHING;

-- Create a view to easily query available spots (accounting for existing bookings)
CREATE OR REPLACE VIEW v_tour_availability_with_bookings AS
SELECT 
  ta.id,
  ta.tour_id,
  ta.guide_id,
  ta.date,
  ta.time_slot,
  ta.available_spots as base_capacity,
  COALESCE(SUM(b.num_participants), 0) as booked_count,
  GREATEST(ta.available_spots - COALESCE(SUM(b.num_participants), 0), 0) as spots_remaining,
  g.slug as guide_slug,
  g.photo_url as guide_photo,
  g.languages_spoken as guide_languages,
  g.rating as guide_rating,
  t.slug as tour_slug,
  t.theme as tour_theme
FROM tour_availability ta
JOIN guides g ON ta.guide_id = g.id
JOIN tours t ON ta.tour_id = t.id
LEFT JOIN bookings b ON 
  b.tour_id = ta.tour_id 
  AND b.guide_id = ta.guide_id
  AND b.booking_date = ta.date 
  AND b.booking_time = ta.time_slot
  AND b.status IN ('confirmed', 'pending')
GROUP BY 
  ta.id, ta.tour_id, ta.guide_id, ta.date, ta.time_slot, 
  ta.available_spots, g.slug, g.photo_url, g.languages_spoken, 
  g.rating, t.slug, t.theme;