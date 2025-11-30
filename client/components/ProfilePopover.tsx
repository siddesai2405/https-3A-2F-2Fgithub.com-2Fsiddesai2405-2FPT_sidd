import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProfilePopover: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    navigate("/settings");
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className={cn(
          "p-2 rounded-full",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "transition-colors",
        )}
      >
        <User size={20} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "transition-colors",
        )}
        title={user.name}
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-12 mt-2",
            "w-48 bg-card border border-border rounded-lg shadow-lg",
            "overflow-hidden z-50",
          )}
        >
          <div className="p-4 border-b border-border">
            <p className="font-semibold text-foreground text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <button
            onClick={handleEditProfile}
            className={cn(
              "w-full px-4 py-2 text-left text-sm",
              "flex items-center gap-2",
              "hover:bg-secondary hover:text-secondary-foreground",
              "text-foreground transition-colors",
            )}
          >
            <Edit2 size={16} />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full px-4 py-2 text-left text-sm",
              "flex items-center gap-2",
              "hover:bg-destructive hover:text-destructive-foreground",
              "text-foreground transition-colors",
            )}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
          aria-label="Close menu"
        />
      )}
    </div>
  );
};
