import React from 'react';
import { Clock, Users, Star, CheckCircle } from 'lucide-react';
import { AvailabilityWithGuide, GuideTranslation } from '../lib/supabase';
import { formatTime } from '../utils/dateHelpers';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeSlotSelectorProps {
  availableSlots: AvailabilityWithGuide[];
  guideTranslations: Map<string, GuideTranslation>;
  selectedSlot: AvailabilityWithGuide | null;
  onSlotSelect: (slot: AvailabilityWithGuide) => void;
  requestedParticipants: number;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  availableSlots,
  guideTranslations,
  selectedSlot,
  onSlotSelect,
  requestedParticipants,
}) => {
  const { currentLanguage, t } = useLanguage();

  if (availableSlots.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No available time slots for this date</p>
        <p className="text-sm text-gray-500 mt-2">Please select another date</p>
      </div>
    );
  }

  const isSlotAvailable = (slot: AvailabilityWithGuide): boolean => {
    return slot.spots_remaining >= requestedParticipants;
  };

  const getAvailabilityBadge = (slot: AvailabilityWithGuide) => {
    if (slot.spots_remaining === 0) {
      return (
        <span className="text-xs font-semibold px-3 py-1 bg-red-100 text-red-700 rounded-full">
          Sold Out
        </span>
      );
    }

    if (slot.spots_remaining <= 5) {
      return (
        <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
          {slot.spots_remaining} spots left
        </span>
      );
    }

    return (
      <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
        {slot.spots_remaining} spots available
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900">Select Time & Guide</h4>
        <p className="text-sm text-gray-600">
          {availableSlots.length} {availableSlots.length === 1 ? 'option' : 'options'} available
        </p>
      </div>

      <div className="grid gap-4">
        {availableSlots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isAvailable = isSlotAvailable(slot);
          const guideTranslation = guideTranslations.get(slot.guide_id);

          return (
            <button
              key={slot.id}
              onClick={() => isAvailable && onSlotSelect(slot)}
              disabled={!isAvailable}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : isAvailable
                  ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-blue-600 fill-current" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={slot.guide_photo || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'}
                    alt={guideTranslation?.name || slot.guide_slug}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-blue-600">
                          <Clock className="w-5 h-5 mr-2" />
                          <span className="text-xl font-bold">
                            {formatTime(slot.time_slot, currentLanguage)}
                          </span>
                        </div>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mt-1">
                        {guideTranslation?.name || slot.guide_slug}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{slot.guide_rating.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{slot.spots_remaining} / {slot.base_capacity}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {slot.guide_languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getAvailabilityBadge(slot)}

                    {!isAvailable && requestedParticipants > slot.spots_remaining && (
                      <span className="text-xs text-red-600 font-medium">
                        Not enough spots for {requestedParticipants} people
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
