import { useState, useEffect } from 'react';
import { supabase, AvailabilityWithGuide, GuideTranslation } from '../lib/supabase';
import { formatDate } from '../utils/dateHelpers';

interface UseAvailabilityResult {
  availabilityMap: Map<string, { date: string; totalSpots: number; hasAvailability: boolean }>;
  timeSlots: AvailabilityWithGuide[];
  guideTranslations: Map<string, GuideTranslation>;
  loading: boolean;
  error: string | null;
  refreshAvailability: () => void;
}

export const useAvailability = (
  tourId: string,
  languageCode: string,
  currentMonth: Date,
  selectedDate: Date | null
): UseAvailabilityResult => {
  const [availabilityMap, setAvailabilityMap] = useState(new Map());
  const [timeSlots, setTimeSlots] = useState<AvailabilityWithGuide[]>([]);
  const [guideTranslations, setGuideTranslations] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error: fetchError } = await supabase
        .from('v_tour_availability_with_bookings')
        .select('*')
        .eq('tour_id', tourId)
        .gte('date', formatDate(startDate))
        .lte('date', formatDate(endDate))
        .contains('guide_languages', [languageCode]);

      if (fetchError) throw fetchError;

      const dateMap = new Map();

      if (data) {
        data.forEach((slot: any) => {
          const dateStr = slot.date;
          const existing = dateMap.get(dateStr);

          if (existing) {
            dateMap.set(dateStr, {
              date: dateStr,
              totalSpots: existing.totalSpots + slot.spots_remaining,
              hasAvailability: existing.hasAvailability || slot.spots_remaining > 0,
            });
          } else {
            dateMap.set(dateStr, {
              date: dateStr,
              totalSpots: slot.spots_remaining,
              hasAvailability: slot.spots_remaining > 0,
            });
          }
        });
      }

      setAvailabilityMap(dateMap);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const fetchDayTimeSlots = async () => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    try {
      const dateStr = formatDate(selectedDate);

      const { data, error: fetchError } = await supabase
        .from('v_tour_availability_with_bookings')
        .select('*')
        .eq('tour_id', tourId)
        .eq('date', dateStr)
        .contains('guide_languages', [languageCode])
        .order('time_slot', { ascending: true });

      if (fetchError) throw fetchError;

      const slots: AvailabilityWithGuide[] = data || [];
      setTimeSlots(slots);

      const guideIds = [...new Set(slots.map((s) => s.guide_id))];
      if (guideIds.length > 0) {
        const { data: translationsData } = await supabase
          .from('guide_translations')
          .select('*')
          .in('guide_id', guideIds)
          .eq('language_code', languageCode);

        const translationsMap = new Map();
        translationsData?.forEach((trans) => {
          translationsMap.set(trans.guide_id, trans);
        });
        setGuideTranslations(translationsMap);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots');
    }
  };

  useEffect(() => {
    if (tourId && languageCode) {
      fetchMonthAvailability();
    }
  }, [tourId, languageCode, currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      fetchDayTimeSlots();
    }
  }, [selectedDate, tourId, languageCode]);

  const refreshAvailability = () => {
    fetchMonthAvailability();
    if (selectedDate) {
      fetchDayTimeSlots();
    }
  };

  return {
    availabilityMap,
    timeSlots,
    guideTranslations,
    loading,
    error,
    refreshAvailability,
  };
};
