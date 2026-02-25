import React, { useState, useEffect } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Language } from '../lib/supabase';

export const Header: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    const { data } = await supabase.from('languages').select('*').order('code');
    if (data) setLanguages(data);
  };

  const navigation = [
    { name: t('ourTours'), href: '#tours' },
    { name: t('meetGuides'), href: '#guides' },
    { name: t('reviews'), href: '#reviews' },
    { name: t('blog'), href: '#blog' },
    { name: t('b2bPortal'), href: '#b2b' },
    { name: t('contact'), href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-white tracking-tight">
              {t('siteName')}
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}

            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">
                  {languages.find((l) => l.code === currentLanguage)?.flag_emoji}
                </span>
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                        currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{lang.flag_emoji}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden text-white p-2"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-slate-800">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-800">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left py-2.5 flex items-center space-x-3 ${
                    currentLanguage === lang.code ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  <span>{lang.flag_emoji}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
