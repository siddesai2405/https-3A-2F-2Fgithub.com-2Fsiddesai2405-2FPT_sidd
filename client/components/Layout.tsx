import React from "react";
import { BottomNav } from "./BottomNav";
import { ProfilePopover } from "./ProfilePopover";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showProfile?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showNav = true,
  showProfile = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      {showProfile && (
        <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <h1 className="font-bold text-lg text-foreground hidden sm:block">
              Period Tracker
            </h1>
          </div>
          <ProfilePopover />
        </header>
      )}

      {/* Main Content */}
      <main className={cn("flex-1 pb-24 md:pb-0", "overflow-y-auto")}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && <BottomNav />}
    </div>
  );
};
