import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const blogPosts = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/2506998/pexels-photo-2506998.jpeg',
    category: 'Harry Potter',
    title: {
      en: 'Top 10 Harry Potter Filming Locations in London',
      es: 'Los 10 Mejores Lugares de Filmación de Harry Potter en Londres',
      fr: 'Top 10 des Lieux de Tournage de Harry Potter à Londres',
      it: 'I 10 Migliori Luoghi di Ripresa di Harry Potter a Londra',
      de: 'Top 10 Harry Potter Drehorte in London',
      ja: 'ロンドンのハリー・ポッター撮影地トップ10',
      zh: '伦敦十大哈利·波特拍摄地',
    },
    excerpt: {
      en: 'Discover the magical places where your favorite wizarding moments came to life.',
      es: 'Descubre los lugares mágicos donde cobraron vida tus momentos favoritos del mundo mágico.',
      fr: 'Découvrez les lieux magiques où vos moments préférés de sorcellerie ont pris vie.',
      it: 'Scopri i luoghi magici dove i tuoi momenti preferiti del mondo magico hanno preso vita.',
      de: 'Entdecken Sie die magischen Orte, an denen Ihre Lieblingszaubermomente zum Leben erweckt wurden.',
      ja: 'お気に入りの魔法の瞬間が生まれた魔法の場所を発見してください。',
      zh: '探索您最喜爱的魔法时刻成真的神奇地点。',
    },
    date: '2024-03-15',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1796505/pexels-photo-1796505.jpeg',
    category: 'Travel Tips',
    title: {
      en: 'Best Time to Visit London: A Complete Guide',
      es: 'Mejor Época para Visitar Londres: Guía Completa',
      fr: 'Meilleur Moment pour Visiter Londres: Guide Complet',
      it: 'Il Miglior Momento per Visitare Londra: Guida Completa',
      de: 'Beste Reisezeit für London: Ein Vollständiger Leitfaden',
      ja: 'ロンドン訪問のベストシーズン：完全ガイド',
      zh: '访问伦敦的最佳时间：完整指南',
    },
    excerpt: {
      en: 'Plan your perfect London trip with our seasonal guide and insider tips.',
      es: 'Planifica tu viaje perfecto a Londres con nuestra guía estacional y consejos internos.',
      fr: 'Planifiez votre voyage parfait à Londres avec notre guide saisonnier et nos conseils d\'initiés.',
      it: 'Pianifica il tuo viaggio perfetto a Londra con la nostra guida stagionale e consigli da insider.',
      de: 'Planen Sie Ihre perfekte London-Reise mit unserem saisonalen Leitfaden und Insider-Tipps.',
      ja: 'シーズンガイドとインサイダーのヒントで完璧なロンドン旅行を計画しましょう。',
      zh: '使用我们的季节性指南和内部提示规划您的完美伦敦之旅。',
    },
    date: '2024-03-10',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2506998/pexels-photo-2506998.jpeg',
    category: 'History',
    title: {
      en: 'Victorian London: A Journey Through Time',
      es: 'Londres Victoriana: Un Viaje a Través del Tiempo',
      fr: 'Londres Victorien: Un Voyage à Travers le Temps',
      it: 'Londra Vittoriana: Un Viaggio nel Tempo',
      de: 'Viktorianisches London: Eine Zeitreise',
      ja: 'ヴィクトリア朝のロンドン：時間を超えた旅',
      zh: '维多利亚时代的伦敦：穿越时光之旅',
    },
    excerpt: {
      en: 'Explore the fascinating history of London during the Victorian era.',
      es: 'Explora la fascinante historia de Londres durante la era victoriana.',
      fr: 'Explorez l\'histoire fascinante de Londres pendant l\'ère victorienne.',
      it: 'Esplora l\'affascinante storia di Londra durante l\'era vittoriana.',
      de: 'Erkunden Sie die faszinierende Geschichte Londons während der viktorianischen Ära.',
      ja: 'ヴィクトリア朝時代のロンドンの魅力的な歴史を探検してください。',
      zh: '探索维多利亚时代伦敦的迷人历史。',
    },
    date: '2024-03-05',
  },
];

export const Blog: React.FC = () => {
  const { currentLanguage, t } = useLanguage();

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('blog')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insider tips and stories from London
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title[currentLanguage as keyof typeof post.title]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time>{new Date(post.date).toLocaleDateString(currentLanguage)}</time>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title[currentLanguage as keyof typeof post.title]}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt[currentLanguage as keyof typeof post.excerpt]}
                </p>

                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  {t('learnMore')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
