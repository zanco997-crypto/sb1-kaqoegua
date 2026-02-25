import React, { useState, useEffect } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Review } from '../lib/supabase';

export const Reviews: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [currentLanguage]);

  const loadReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('reviews')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from our guests
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
                {review.verified && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>{t('verifiedReview')}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-4">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{review.customer_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString(currentLanguage)}
                  </p>
                </div>
                <span className="text-2xl">
                  {review.language_code === 'en' && '🇬🇧'}
                  {review.language_code === 'es' && '🇪🇸'}
                  {review.language_code === 'fr' && '🇫🇷'}
                  {review.language_code === 'it' && '🇮🇹'}
                  {review.language_code === 'de' && '🇩🇪'}
                  {review.language_code === 'ja' && '🇯🇵'}
                  {review.language_code === 'zh' && '🇨🇳'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
