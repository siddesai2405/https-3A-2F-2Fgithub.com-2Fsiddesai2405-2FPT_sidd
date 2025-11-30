import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Personal Chat Assistant</h1>
        <p className="text-muted-foreground">Ask questions about your cycle and health</p>
      </div>

      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Chat Feature Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            An AI-powered offline chatbot that provides personalized period tracking tips, health advice, and cycle information.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary pt-4">
            <Zap size={16} />
            <span>This feature is currently being developed</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">What you'll be able to do:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Ask questions about your cycle</li>
            <li>✓ Get personalized health tips</li>
            <li>✓ Access period education resources</li>
            <li>✓ Chat with an offline AI assistant</li>
            <li>✓ Get quick answers about symptoms</li>
          </ul>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
};

export default Chat;
