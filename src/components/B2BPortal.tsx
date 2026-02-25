import React, { useState } from 'react';
import { Building, Users, TrendingUp, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export const B2BPortal: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('b2b_agents').insert([
      {
        company_name: formData.company_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        status: 'pending',
      },
    ]);

    if (error) {
      alert('Error submitting application. Please try again.');
      console.error(error);
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  return (
    <section id="b2b" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('travelAgents')}</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Partner with us for exclusive rates and commissions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Competitive Commission Rates</h3>
                  <p className="text-gray-300">
                    Earn up to 15% commission on all bookings through our B2B portal.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
                  <p className="text-gray-300">
                    Access to a dedicated account manager for all your group bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Priority Booking</h3>
                  <p className="text-gray-300">
                    Get priority access to tours and guaranteed availability for your groups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold mb-6">{t('apply')}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('companyName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('message')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your business..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : t('apply')}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                <p className="text-gray-600">
                  Thank you for your interest. Our B2B team will contact you within 48 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);
