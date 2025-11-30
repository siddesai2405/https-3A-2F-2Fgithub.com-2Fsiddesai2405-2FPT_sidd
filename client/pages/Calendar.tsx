import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserEvents, addEvent } from '@/lib/db';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface CalendarEvent {
  id?: number;
  date: string;
  type: 'period' | 'symptom' | 'note' | 'pill' | 'mood';
  note?: string;
}

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventNote, setEventNote] = useState('');
  const [eventType, setEventType] = useState<'period' | 'symptom' | 'note' | 'pill' | 'mood'>('period');

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user, currentDate]);

  const loadEvents = async () => {
    if (!user?.id) return;

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    try {
      const allEvents = await getUserEvents(
        user.id,
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      );
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!user?.id || !selectedDate) return;

    try {
      await addEvent({
        userId: user.id,
        date: selectedDate,
        type: eventType,
        note: eventNote || undefined,
      });

      setEventNote('');
      setEventType('period');
      setSelectedDate(null);
      setIsAddingEvent(false);
      loadEvents();
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get previous month days for padding
  const firstDay = monthStart.getDay();
  const previousMonthDays = Array.from({ length: firstDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (firstDay - i));
    return date;
  });

  const calendarDays = [...previousMonthDays, ...daysInMonth];

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'period':
        return 'bg-red-500';
      case 'symptom':
        return 'bg-yellow-500';
      case 'mood':
        return 'bg-purple-500';
      case 'pill':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Cycle Calendar</h1>
        <p className="text-muted-foreground">Track your period and symptoms</p>
      </div>

      {/* Calendar */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          >
            <ChevronLeft size={20} />
          </Button>

          <h2 className="text-xl font-bold text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-muted-foreground text-sm p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setIsAddingEvent(true);
                }}
                className={cn(
                  'aspect-square rounded-lg p-2 text-sm font-medium',
                  'transition-all duration-200',
                  'flex flex-col items-center justify-start',
                  'border-2',
                  isToday
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-secondary/10',
                  !isCurrentMonth && 'opacity-30',
                  isSelected && 'bg-primary/10 border-primary'
                )}
              >
                <span className="font-semibold text-foreground">{format(date, 'd')}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap justify-center w-full">
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          getEventColor(event.type)
                        )}
                      ></div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { color: 'bg-red-500', label: 'Period' },
            { color: 'bg-yellow-500', label: 'Symptom' },
            { color: 'bg-purple-500', label: 'Mood' },
            { color: 'bg-blue-500', label: 'Pill' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', item.color)}></div>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Add Event for {format(new Date(selectedDate), 'MMM d, yyyy')}
            </h3>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className={cn(
                  'w-full px-4 py-2 rounded-lg',
                  'bg-input border border-border',
                  'text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              >
                <option value="period">Period</option>
                <option value="symptom">Symptom</option>
                <option value="mood">Mood</option>
                <option value="pill">Pill</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">Note (optional)</label>
              <textarea
                value={eventNote}
                onChange={(e) => setEventNote(e.target.value)}
                placeholder="Add a note..."
                className={cn(
                  'w-full px-4 py-2 rounded-lg',
                  'bg-input border border-border',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  'resize-none h-24'
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsAddingEvent(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEvent}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Padding for bottom nav */}
      <div className="h-8"></div>
    </div>
  );
};

export default Calendar;
