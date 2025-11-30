import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Download, Upload, Lock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserSettings, updateUserSettings, db } from '@/lib/db';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [cycleLength, setCycleLength] = useState(28);
  const [lutealLength, setLutealLength] = useState(14);
  const [periodLength, setPeriodLength] = useState(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user]);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      const settings = await getUserSettings(user.id);
      if (settings) {
        setCycleLength(settings.cycleLength);
        setLutealLength(settings.lutealLength);
        setPeriodLength(settings.periodLength);
        setTheme(settings.theme);
        setNotificationsEnabled(settings.notificationsEnabled);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);

    try {
      await updateUserSettings(user.id, {
        cycleLength,
        lutealLength,
        periodLength,
        theme,
        notificationsEnabled,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const allData = {
        exportDate: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
          role: user?.role,
          profile: user?.profile,
        },
        events: await db.events.where('userId').equals(user?.id!).toArray(),
        settings: await getUserSettings(user?.id!),
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `period-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Import events
      if (data.events && Array.isArray(data.events)) {
        await db.events.bulkAdd(data.events);
      }

      // Import settings
      if (data.settings) {
        await updateUserSettings(user?.id!, data.settings);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadSettings();
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your app preferences and personal data</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="max-w-4xl mx-auto p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-700 dark:text-green-400 text-sm">✓ Settings saved successfully</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input
                type="text"
                value={user?.name || ''}
                disabled
                className="h-11 bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="h-11 bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Lock size={18} className="text-primary" />
                <span className="text-foreground font-medium capitalize">{user?.role} Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Settings */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Cycle Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Average Cycle Length (days)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="20"
                  max="40"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="h-11 flex-1"
                />
                <span className="text-lg font-bold text-primary">{cycleLength}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Typical range: 20-40 days</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Luteal Phase Length (days)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="7"
                  max="20"
                  value={lutealLength}
                  onChange={(e) => setLutealLength(parseInt(e.target.value))}
                  className="h-11 flex-1"
                />
                <span className="text-lg font-bold text-secondary">{lutealLength}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Typical range: 7-20 days</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Period Length (days)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                  className="h-11 flex-1"
                />
                <span className="text-lg font-bold text-red-500">{periodLength}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Typical range: 2-10 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">App Settings</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all',
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Sun size={18} />
                  <span className="text-sm font-medium">Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all',
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Moon size={18} />
                  <span className="text-sm font-medium">Dark</span>
                </button>

                <button
                  onClick={() => setTheme('auto')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all',
                    theme === 'auto'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-sm font-medium">Auto</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Get reminders for your cycle</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  notificationsEnabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Data Management</h2>

          <div className="space-y-4">
            <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                All your data is stored locally on your device. You can export it as a backup and import it on another device.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleExportData}
                  className="flex-1 gap-2"
                  variant="outline"
                >
                  <Download size={18} />
                  Export Data
                </Button>

                <label className="flex-1">
                  <Button
                    className="w-full gap-2"
                    variant="outline"
                    asChild
                  >
                    <span>
                      <Upload size={18} />
                      Import Data
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 text-base"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="h-8"></div>
    </div>
  );
};

export default Settings;
