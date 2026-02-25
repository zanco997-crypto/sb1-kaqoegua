import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getCalendarDays,
  getMonthName,
  getDayName,
  isToday,
  isSameDay,
  isPastDate,
  formatDate,
} from '../utils/dateHelpers';

interface DateAvailability {
  date: string;
  totalSpots: number;
  hasAvailability: boolean;
}

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  availabilityMap: Map<string, DateAvailability>;
  languageCode: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  availabilityMap,
  languageCode,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const getDateStatus = (date: Date) => {
    const dateStr = formatDate(date);
    const availability = availabilityMap.get(dateStr);

    if (isPastDate(date)) return 'past';
    if (!availability || !availability.hasAvailability) return 'unavailable';
    if (availability.totalSpots <= 5) return 'limited';
    return 'available';
  };

  const getDayClasses = (date: Date | null): string => {
    if (!date) return 'invisible';

    const status = getDateStatus(date);
    const selected = isSameDay(date, selectedDate);
    const today = isToday(date);

    let classes =
      'w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 relative ';

    if (status === 'past') {
      classes += 'text-gray-300 cursor-not-allowed';
    } else if (status === 'unavailable') {
      classes += 'text-gray-400 cursor-not-allowed opacity-50';
    } else if (selected) {
      classes += 'bg-blue-600 text-white shadow-lg scale-110';
    } else if (status === 'limited') {
      classes += 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 cursor-pointer border border-yellow-300';
    } else {
      classes += 'bg-white text-gray-900 hover:bg-blue-50 hover:scale-105 cursor-pointer border border-gray-200';
    }

    if (today && !selected) {
      classes += ' ring-2 ring-blue-400';
    }

    return classes;
  };

  const renderAvailabilityIndicator = (date: Date) => {
    const status = getDateStatus(date);
    if (status === 'past' || status === 'unavailable') return null;

    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
        <div
          className={`w-1 h-1 rounded-full ${
            status === 'limited' ? 'bg-yellow-600' : 'bg-green-500'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h3 className="text-xl font-bold text-gray-900">
          {getMonthName(month, languageCode)} {year}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <div
            key={dayIndex}
            className="text-center text-xs font-semibold text-gray-600 py-2"
          >
            {getDayName(dayIndex, languageCode)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                onClick={() => {
                  const status = getDateStatus(date);
                  if (status !== 'past' && status !== 'unavailable') {
                    onDateSelect(date);
                  }
                }}
                className={getDayClasses(date)}
                disabled={
                  isPastDate(date) || getDateStatus(date) === 'unavailable'
                }
              >
                {date.getDate()}
                {renderAvailabilityIndicator(date)}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-white border border-gray-200 mr-2" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 mr-2" />
          <span className="text-gray-600">Limited</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-gray-100 mr-2" />
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>
    </div>
  );
};
