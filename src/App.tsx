import React, { Suspense, lazy } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

const Tours = lazy(() => import('./components/Tours').then(module => ({ default: module.Tours })));
const Guides = lazy(() => import('./components/Guides').then(module => ({ default: module.Guides })));
const Reviews = lazy(() => import('./components/Reviews').then(module => ({ default: module.Reviews })));
const B2BPortal = lazy(() => import('./components/B2BPortal').then(module => ({ default: module.B2BPortal })));
const Blog = lazy(() => import('./components/Blog').then(module => ({ default: module.Blog })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));

const LoadingSection = () => (
  <div className="py-16 px-4 max-w-7xl mx-auto">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<LoadingSection />}>
            <Tours />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <Guides />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <Reviews />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <B2BPortal />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <Blog />
          </Suspense>
          <Suspense fallback={<LoadingSection />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
