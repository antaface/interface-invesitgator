
import React from 'react';
import { Card } from "@/components/ui/card";

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">
              Interface Investigator
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Case #001 - Active Investigation
              </span>
            </div>
          </div>
        </header>
        
        <main className="grid lg:grid-cols-4 gap-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GameLayout;
