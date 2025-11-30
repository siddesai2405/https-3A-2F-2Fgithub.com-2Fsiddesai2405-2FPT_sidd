import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, TrendingUp, Calendar, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserEvents } from '@/lib/db';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Stats: React.FC = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [periodData, setPeriodData] = useState<any[]>([]);
  const [symptomData, setSymptomData] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      // Get last 6 months of data
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const allEvents = await getUserEvents(
        user.id,
        sixMonthsAgo.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      // Process mood data
      const moodMap = new Map();
      allEvents
        .filter(e => e.type === 'mood')
        .forEach(e => {
          const date = new Date(e.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const intensity = e.moodIntensity || 3;
          if (!moodMap.has(date)) {
            moodMap.set(date, []);
          }
          moodMap.get(date).push(intensity);
        });

      const moodChartData = Array.from(moodMap).map(([date, intensities]: any) => ({
        date,
        average: (intensities.reduce((a: number, b: number) => a + b, 0) / intensities.length).toFixed(1),
        count: intensities.length,
      }));

      // Process period data
      const periodDates = allEvents
        .filter(e => e.type === 'period')
        .map(e => new Date(e.date));

      const periodLengths: number[] = [];
      for (let i = 1; i < periodDates.length; i++) {
        const diff = Math.floor(
          (periodDates[i].getTime() - periodDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff > 0 && diff < 60) {
          periodLengths.push(diff);
        }
      }

      const periodChartData = [
        { name: 'Avg Cycle Length', value: user.profile.cycleLength },
        { name: 'Your Data', value: periodLengths.length > 0 ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length) : user.profile.cycleLength },
      ];

      // Process symptom data
      const symptomMap = new Map();
      allEvents
        .filter(e => e.type === 'symptom' && e.symptoms)
        .forEach(e => {
          e.symptoms?.forEach(symptom => {
            symptomMap.set(symptom, (symptomMap.get(symptom) || 0) + 1);
          });
        });

      const symptomChartData = Array.from(symptomMap)
        .map(([symptom, count]) => ({
          name: symptom,
          value: count,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setMoodData(moodChartData.slice(-30));
      setPeriodData(periodChartData);
      setSymptomData(symptomChartData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Your Health Statistics</h1>
        <p className="text-muted-foreground">Analyze your cycle and wellness patterns</p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="text-primary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Cycle Length</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{user?.profile.cycleLength} days</p>
          <p className="text-sm text-muted-foreground mt-2">Average cycle duration</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="text-secondary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Luteal Length</h3>
          </div>
          <p className="text-3xl font-bold text-secondary">{user?.profile.lutealLength} days</p>
          <p className="text-sm text-muted-foreground mt-2">Luteal phase duration</p>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mood Trends */}
        {moodData.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Heart className="text-pink-500" size={20} />
              </div>
              <h3 className="font-semibold text-foreground">Mood Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => parseFloat(value).toFixed(1)}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="var(--primary)"
                  dot={{ fill: 'var(--primary)' }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cycle Comparison */}
        {periodData.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="text-blue-500" size={20} />
              </div>
              <h3 className="font-semibold text-foreground">Cycle Length Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Symptoms Distribution */}
        {symptomData.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-foreground mb-6">Most Common Symptoms</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={symptomData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {symptomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Empty State */}
        {moodData.length === 0 && periodData.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">No data yet. Start logging your mood and symptoms to see statistics.</p>
          </div>
        )}
      </div>

      <div className="h-8"></div>
    </div>
  );
};

export default Stats;
