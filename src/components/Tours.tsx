import React, { useState, useEffect } from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { useLanguage, convertPrice } from '../contexts/LanguageContext';
import { supabase, Tour, TourTranslation } from '../lib/supabase';
import { TourDetail } from './TourDetail';

interface TourWithTranslation extends Tour {
  translation?: TourTranslation;
}

export const Tours: React.FC = () => {
  const { currentLanguage, t, currencies } = useLanguage();
  const [tours, setTours] = useState<TourWithTranslation[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);

  const currency = currencies[currentLanguage] || 'GBP';

  useEffect(() => {
    loadTours();
  }, [currentLanguage]);

  const loadTours = async () => {
    setLoading(true);
    const { data: toursData } = await supabase.from('tours').select('*').eq('status', 'active');

    if (toursData) {
      const toursWithTranslations = await Promise.all(
        toursData.map(async (tour) => {
          const { data: translation } = await supabase
            .from('tour_translations')
            .select('*')
            .eq('tour_id', tour.id)
            .eq('language_code', currentLanguage)
            .maybeSingle();

          return {
            ...tour,
            translation: translation || undefined,
          };
        })
      );

      setTours(toursWithTranslations);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('ourTours')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tagline')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.image_url || 'https://images.pexels.com/photos/1796505/pexels-photo-1796505.jpeg'}
                  alt={tour.translation?.title || tour.slug}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {t('from')} {convertPrice(tour.base_price_gbp, currency)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {tour.translation?.title || tour.slug}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tour.translation?.description || ''}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{tour.duration_hours} {t('hours')}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{tour.max_group_size} max</span>
                  </div>
                </div>

                {tour.translation?.highlights && tour.translation.highlights.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {tour.translation.highlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedTour(tour)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  {t('bookNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTour && (
        <TourDetail tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </section>
  );
};
