import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1796505/pexels-photo-1796505.jpeg')] bg-cover bg-center opacity-20" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {t('siteName')}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
          {t('tagline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#tours"
            className="group inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            {t('bookNow')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#tours"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 transition-all duration-300"
          >
            {t('learnMore')}
          </a>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {['harry-potter', 'jack-the-ripper', 'sherlock-holmes'].map((theme) => (
            <div key={theme} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {theme === 'harry-potter' ? '3.5h' : theme === 'jack-the-ripper' ? '2h' : '3h'}
              </div>
              <div className="text-gray-300 text-sm capitalize">
                {theme.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
