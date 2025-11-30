import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Heart, Zap, Cloud, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addEvent, getUserEvents } from '@/lib/db';
import { format } from 'date-fns';

type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired' | 'excited';

interface MoodEmoji {
  type: MoodType;
  emoji: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const moods: MoodEmoji[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', icon: <Smile className="w-8 h-8" />, color: 'from-yellow-400 to-yellow-500' },
  { type: 'excited', emoji: '🎉', label: 'Excited', icon: <Zap className="w-8 h-8" />, color: 'from-pink-400 to-pink-500' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', icon: <Cloud className="w-8 h-8" />, color: 'from-gray-400 to-gray-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', icon: <Frown className="w-8 h-8" />, color: 'from-blue-400 to-blue-500' },
  { type: 'tired', emoji: '😴', label: 'Tired', icon: <Heart className="w-8 h-8" />, color: 'from-purple-400 to-purple-500' },
  { type: 'angry', emoji: '😠', label: 'Angry', icon: <AlertCircle className="w-8 h-8" />, color: 'from-red-400 to-red-500' },
];

const Mood: React.FC = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user?.id || !selectedMood) return;

    try {
      await addEvent({
        userId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'mood',
        mood: selectedMood,
        moodIntensity: intensity,
        note: note || undefined,
      });

      setSubmitted(true);
      setSelectedMood(null);
      setIntensity(3);
      setNote('');

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to save mood:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">How are you feeling?</h1>
        <p className="text-muted-foreground">Track your mood throughout the month</p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="max-w-4xl mx-auto p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-700 dark:text-green-400 text-sm">✓ Mood saved successfully</p>
        </div>
      )}

      {/* Mood Selector */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Select your mood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.type}
                onClick={() => setSelectedMood(mood.type)}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all duration-200',
                  'flex flex-col items-center justify-center gap-2',
                  'hover:scale-105',
                  selectedMood === mood.type
                    ? `border-primary bg-gradient-to-br ${mood.color} text-white`
                    : 'border-border bg-background hover:border-primary/50'
                )}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className={cn(
                  'font-semibold text-sm',
                  selectedMood === mood.type ? 'text-white' : 'text-foreground'
                )}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <>
            <div className="h-px bg-border"></div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Intensity</h2>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span className="font-semibold text-primary">Level {intensity}</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Add a note (optional)</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-input border border-border',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  'resize-none h-24'
                )}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3"
            >
              Save Mood
            </Button>
          </>
        )}
      </div>

      {/* Placeholder Section */}
      {!selectedMood && (
        <div className="max-w-4xl mx-auto bg-secondary/5 border border-secondary/20 rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-3">Mood Insights</h3>
          <p className="text-sm text-muted-foreground">
            Select a mood to log how you're feeling. Your mood data will help identify patterns across your cycle.
          </p>
        </div>
      )}

      {/* Padding for bottom nav */}
      <div className="h-8"></div>
    </div>
  );
};

export default Mood;
