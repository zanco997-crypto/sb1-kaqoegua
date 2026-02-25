import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useLanguage, convertPrice } from '../contexts/LanguageContext';
import { supabase, Tour, TourTranslation, AvailabilityWithGuide, Language } from '../lib/supabase';
import { useAvailability } from '../hooks/useAvailability';
import { Calendar } from './Calendar';
import { TimeSlotSelector } from './TimeSlotSelector';
import { formatDate, formatTime } from '../utils/dateHelpers';

interface BookingWizardProps {
  tour: Tour & { translation?: TourTranslation };
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'language' | 'date' | 'time' | 'participants' | 'details' | 'review';

export const BookingWizard: React.FC<BookingWizardProps> = ({ tour, onBack, onSuccess }) => {
  const { t, currencies, currentLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>('language');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityWithGuide | null>(null);
  const [numParticipants, setNumParticipants] = useState(1);

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const { availabilityMap, timeSlots, guideTranslations, loading: availabilityLoading } =
    useAvailability(tour.id, selectedLanguage, currentMonth, selectedDate);

  const currency = currencies[currentLanguage] || 'GBP';

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    const { data } = await supabase.from('languages').select('*');
    if (data) setLanguages(data);
  };

  const steps: Step[] = ['language', 'date', 'time', 'participants', 'details', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'language':
        return selectedLanguage !== '';
      case 'date':
        return selectedDate !== null;
      case 'time':
        return selectedSlot !== null;
      case 'participants':
        return numParticipants >= 1 && numParticipants <= tour.max_group_size;
      case 'details':
        return customerDetails.name !== '' && customerDetails.email !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedDate) return;

    setLoading(true);

    const bookingData = {
      tour_id: tour.id,
      guide_id: selectedSlot.guide_id,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      booking_date: formatDate(selectedDate),
      booking_time: selectedSlot.time_slot,
      num_participants: numParticipants,
      language_preference: selectedLanguage,
      currency: currency,
      total_amount: tour.base_price_gbp * numParticipants,
      special_requests: customerDetails.specialRequests,
      status: 'confirmed',
    };

    const { error } = await supabase.from('bookings').insert([bookingData]);

    if (error) {
      alert('Error creating booking. Please try again.');
      console.error(error);
    } else {
      alert('Booking confirmed! You will receive an email confirmation shortly.');
      onSuccess();
    }

    setLoading(false);
  };

  const calculateTotal = () => {
    return tour.base_price_gbp * numParticipants;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'language':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Preferred Language</h3>
              <p className="text-gray-600">This will show available dates with guides who speak your language</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{lang.flag_emoji}</div>
                  <div className="font-semibold text-gray-900">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Date</h3>
              <p className="text-gray-600">
                Showing dates with {languages.find((l) => l.code === selectedLanguage)?.name} speaking guides
              </p>
            </div>

            {availabilityLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : (
              <Calendar
                currentDate={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={setCurrentMonth}
                availabilityMap={availabilityMap}
                languageCode={selectedLanguage}
              />
            )}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Time & Guide</h3>
              <p className="text-gray-600">
                {selectedDate?.toLocaleDateString(selectedLanguage, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <TimeSlotSelector
              availableSlots={timeSlots}
              guideTranslations={guideTranslations}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
              requestedParticipants={numParticipants}
            />
          </div>
        );

      case 'participants':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Number of Participants</h3>
              <p className="text-gray-600">How many people will join this tour?</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button
                  onClick={() => setNumParticipants(Math.max(1, numParticipants - 1))}
                  className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-2xl transition-colors"
                >
                  -
                </button>

                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{numParticipants}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {numParticipants === 1 ? 'person' : 'people'}
                  </div>
                </div>

                <button
                  onClick={() => setNumParticipants(Math.min(tour.max_group_size, numParticipants + 1))}
                  className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl transition-colors"
                >
                  +
                </button>
              </div>

              {selectedSlot && numParticipants > selectedSlot.spots_remaining && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700 font-medium">
                    Only {selectedSlot.spots_remaining} spots available for this time slot
                  </p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-700">Price per person:</span>
                  <span className="font-bold text-gray-900">{convertPrice(tour.base_price_gbp, currency)}</span>
                </div>
                <div className="flex items-center justify-between text-2xl mt-4 pt-4 border-t border-blue-200">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-blue-600">{convertPrice(calculateTotal(), currency)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h3>
              <p className="text-gray-600">We'll send your confirmation to this email</p>
            </div>

            <div className="max-w-lg mx-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                <textarea
                  rows={3}
                  value={customerDetails.specialRequests}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, specialRequests: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'review':
        const guide = guideTranslations.get(selectedSlot?.guide_id || '');
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h3>
              <p className="text-gray-600">Please confirm all details are correct</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Tour</span>
                  <span className="font-semibold text-gray-900">{tour.translation?.title}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {selectedDate?.toLocaleDateString(selectedLanguage, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">
                    {selectedSlot && formatTime(selectedSlot.time_slot, selectedLanguage)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Guide</span>
                  <span className="font-semibold text-gray-900">{guide?.name}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold text-gray-900">
                    {languages.find((l) => l.code === selectedLanguage)?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold text-gray-900">{numParticipants}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Contact</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{customerDetails.name}</div>
                    <div className="text-sm text-gray-600">{customerDetails.email}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {convertPrice(calculateTotal(), currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handlePrevious}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  index < currentStepIndex
                    ? 'bg-green-500 text-white'
                    : index === currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 capitalize">
          Step {currentStepIndex + 1} of {steps.length}: {currentStep.replace('-', ' ')}
        </p>
      </div>

      <div className="mb-8">{renderStepContent()}</div>

      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
        >
          Previous
        </button>

        {currentStep === 'review' ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
            {!loading && <Check className="ml-2 w-5 h-5" />}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
