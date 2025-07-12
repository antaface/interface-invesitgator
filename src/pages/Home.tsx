
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleStartInvestigation = () => {
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Interface Investigator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solve UX crimes through interactive decision-making. Ready to crack your first case?
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartInvestigation}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg text-lg"
          >
            Start Investigation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
