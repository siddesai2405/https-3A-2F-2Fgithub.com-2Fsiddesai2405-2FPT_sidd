import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Heart,
  MessageCircle,
  BarChart3,
  Apple,
  Stethoscope,
  Smile,
  Clock,
  Zap,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/db";

interface CycleStats {
  daysUntilPeriod: number;
  currentPhase: string;
  phaseColor: string;
}

const Index: React.FC = () => {
  const { user } = useAuth();
  const [cycleStats, setCycleStats] = useState<CycleStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (user) {
        const currentUser = await getCurrentUser();
        if (currentUser?.profile.lastPeriodStart) {
          const lastStart = new Date(currentUser.profile.lastPeriodStart);
          const today = new Date();
          const daysElapsed = Math.floor(
            (today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24),
          );
          const cycleLength = currentUser.profile.cycleLength || 28;
          const daysUntilPeriod = cycleLength - (daysElapsed % cycleLength);

          let currentPhase = "Luteal";
          let phaseColor = "text-secondary";

          if (daysElapsed % cycleLength < 5) {
            currentPhase = "Period";
            phaseColor = "text-red-500";
          } else if (daysElapsed % cycleLength < 14) {
            currentPhase = "Follicular";
            phaseColor = "text-blue-500";
          } else if (daysElapsed % cycleLength < 18) {
            currentPhase = "Ovulation";
            phaseColor = "text-yellow-500";
          }

          setCycleStats({
            daysUntilPeriod,
            currentPhase,
            phaseColor,
          });
        }
      }
    };

    loadStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="px-4 py-8 sm:py-12 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {user?.name.split(" ")[0]}
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal period tracker and wellness companion. Offline,
            private, and always available.
          </p>

          {/* Cycle Status Card */}
          {cycleStats && (
            <div
              className={cn(
                "mt-8 bg-card border border-border rounded-2xl",
                "p-6 shadow-lg space-y-4",
              )}
            >
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Current Cycle Phase
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full",
                      cycleStats.phaseColor,
                    )}
                  ></div>
                  <p className="text-2xl font-bold text-foreground">
                    {cycleStats.currentPhase}
                  </p>
                </div>
              </div>
              <div className="h-px bg-border"></div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Days until next period
                </p>
                <p className="text-3xl font-bold text-primary">
                  {cycleStats.daysUntilPeriod}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-12 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Calendar,
                title: "View Calendar",
                description: "Track your cycle and symptoms",
                path: "/calendar",
                color: "from-blue-500/20 to-blue-500/5",
              },
              {
                icon: Heart,
                title: "Log Mood",
                description: "Record how you're feeling",
                path: "/mood",
                color: "from-pink-500/20 to-pink-500/5",
              },
              {
                icon: MessageCircle,
                title: "Chat Assistant",
                description: "Get period and health tips",
                path: "/chat",
                color: "from-purple-500/20 to-purple-500/5",
              },
              {
                icon: Apple,
                title: "Food Tracker",
                description: "Explore cycle-based recipes",
                path: "/food",
                color: "from-green-500/20 to-green-500/5",
              },
              {
                icon: Stethoscope,
                title: "Find Doctor",
                description: "Locate nearby gynecologists",
                path: "/gynecologist",
                color: "from-red-500/20 to-red-500/5",
              },
              {
                icon: BarChart3,
                title: "View Stats",
                description: "Analyze your patterns",
                path: "/stats",
                color: "from-indigo-500/20 to-indigo-500/5",
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className={cn(
                    "group relative overflow-hidden rounded-xl",
                    "bg-gradient-to-br",
                    action.color,
                    "border border-border",
                    "p-6 transition-all duration-300",
                    "hover:border-primary hover:shadow-lg",
                    "hover:scale-105",
                  )}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 max-w-4xl mx-auto">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">
            Why Period Tracker?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Lock,
                title: "Completely Private",
                description:
                  "Your data never leaves your device. 100% offline after first load.",
              },
              {
                icon: Zap,
                title: "Fast & Responsive",
                description:
                  "Instant access to all features without internet connection.",
              },
              {
                icon: Heart,
                title: "Health Insights",
                description:
                  "Smart cycle predictions and personalized health tips.",
              },
              {
                icon: Clock,
                title: "Always Available",
                description: "Works 24/7 without any server dependencies.",
              },
              {
                icon: Smile,
                title: "User Friendly",
                description:
                  "Beautiful, intuitive interface designed for ease of use.",
              },
              {
                icon: Zap,
                title: "No Ads",
                description:
                  "Distraction-free experience with your complete focus.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 max-w-4xl mx-auto">
        <div
          className={cn(
            "bg-gradient-to-br from-primary/10 to-secondary/10",
            "border border-primary/20 rounded-2xl",
            "p-8 text-center space-y-4",
          )}
        >
          <h2 className="text-2xl font-bold text-foreground">
            Start Tracking Today
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visit the calendar to log your first period event, or explore the
            mood tracker to start recording how you feel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/calendar">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Go to Calendar
              </Button>
            </Link>
            <Link to="/settings">
              <Button size="lg" variant="outline">
                Configure Settings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Padding for bottom nav */}
      <div className="h-12"></div>
    </div>
  );
};

export default Index;
