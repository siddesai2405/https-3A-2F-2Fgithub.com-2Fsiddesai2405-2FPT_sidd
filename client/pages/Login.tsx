import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Heart className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Period Tracker</h1>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div
          className={cn(
            "w-full max-w-md bg-card rounded-2xl",
            "border border-border shadow-lg",
            "p-8 space-y-6",
          )}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">
              Track your cycle with confidence
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 text-base font-semibold",
                "bg-gradient-to-r from-primary to-secondary",
                "hover:from-primary/90 hover:to-secondary/90",
                "text-primary-foreground",
              )}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/90 transition-colors"
            >
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs font-mono text-foreground">
              Email: demo@example.com
            </p>
            <p className="text-xs font-mono text-foreground">
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
