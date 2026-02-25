import React, { useState } from 'react';
import { X, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { useLanguage, convertPrice } from '../contexts/LanguageContext';
import { Tour, TourTranslation } from '../lib/supabase';
import { BookingForm } from './BookingForm';

interface TourDetailProps {
  tour: Tour & { translation?: TourTranslation };
  onClose: () => void;
}

export const TourDetail: React.FC<TourDetailProps> = ({ tour, onClose }) => {
  const { t, currencies, currentLanguage } = useLanguage();
  const [showBooking, setShowBooking] = useState(false);
  const currency = currencies[currentLanguage] || 'GBP';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
          <div className="relative h-96">
            <img
              src={tour.image_url || 'https://images.pexels.com/photos/1796505/pexels-photo-1796505.jpeg'}
              alt={tour.translation?.title || tour.slug}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                {tour.translation?.title || tour.slug}
              </h2>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{tour.duration_hours} {t('hours')}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{tour.max_group_size} max</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!showBooking ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('from')}</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {convertPrice(tour.base_price_gbp, currency)}
                        <span className="text-lg text-gray-500 ml-2">{t('person')}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBooking(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                    >
                      {t('bookNow')}
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('tourDetails')}</h3>
                  <p className="text-gray-700 text-lg mb-8">{tour.translation?.description}</p>

                  {tour.translation?.highlights && tour.translation.highlights.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{t('highlights')}</h4>
                      <ul className="space-y-2">
                        {tour.translation.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-600 mr-2">✓</span>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tour.translation?.itinerary && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{t('itinerary')}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{tour.translation.itinerary}</p>
                    </div>
                  )}

                  {tour.translation?.meeting_point && (
                    <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{t('meetingPoint')}</h4>
                          <p className="text-gray-700">{tour.translation.meeting_point}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {tour.translation?.cancellation_policy && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{t('cancellationPolicy')}</h4>
                      <p className="text-gray-700">{tour.translation.cancellation_policy}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <BookingForm
                tour={tour}
                onBack={() => setShowBooking(false)}
                onSuccess={() => {
                  setShowBooking(false);
                  onClose();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
