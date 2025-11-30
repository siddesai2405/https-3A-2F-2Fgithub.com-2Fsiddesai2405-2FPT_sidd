import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="text-primary" size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Home size={18} />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
