import React, { useState, useEffect } from 'react';
import { Star, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Guide, GuideTranslation } from '../lib/supabase';

interface GuideWithTranslation extends Guide {
  translation?: GuideTranslation;
}

export const Guides: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const [guides, setGuides] = useState<GuideWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuides();
  }, [currentLanguage]);

  const loadGuides = async () => {
    setLoading(true);
    const { data: guidesData } = await supabase.from('guides').select('*').eq('status', 'active');

    if (guidesData) {
      const guidesWithTranslations = await Promise.all(
        guidesData.map(async (guide) => {
          const { data: translation } = await supabase
            .from('guide_translations')
            .select('*')
            .eq('guide_id', guide.id)
            .eq('language_code', currentLanguage)
            .maybeSingle();

          return {
            ...guide,
            translation: translation || undefined,
          };
        })
      );

      setGuides(guidesWithTranslations);
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
    <section id="guides" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('meetGuides')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('featuredGuides')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={guide.photo_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'}
                  alt={guide.translation?.name || guide.slug}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {guide.rating.toFixed(1)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {guide.translation?.name || guide.slug}
                </h3>

                <div className="mb-4">
                  <div className="flex items-start text-sm text-gray-600 mb-2">
                    <Languages className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {guide.languages_spoken.map((lang, idx) => (
                        <span key={idx} className="inline-block">
                          {lang.toUpperCase()}{idx < guide.languages_spoken.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {guide.years_experience} {t('experience')}
                  </p>
                </div>

                {guide.translation?.bio && (
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {guide.translation.bio}
                  </p>
                )}

                {guide.specialties && guide.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">{t('specialties')}:</p>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize"
                        >
                          {specialty.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                  {t('bookWithGuide')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
