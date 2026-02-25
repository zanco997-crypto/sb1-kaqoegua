import React from 'react';
import { Tour, TourTranslation } from '../lib/supabase';
import { BookingWizard } from './BookingWizard';

interface BookingFormProps {
  tour: Tour & { translation?: TourTranslation };
  onBack: () => void;
  onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ tour, onBack, onSuccess }) => {
  return <BookingWizard tour={tour} onBack={onBack} onSuccess={onSuccess} />;
};
