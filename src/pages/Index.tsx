
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Interface Investigator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solve UX crimes by interrogating our AI-style Investigator. 
            Uncover design mysteries through strategic questioning and evidence gathering.
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat Investigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interrogate the AI Investigator through strategic conversations to uncover UX design flaws and solutions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Evidence Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gather digital evidence, analyze user flows, and piece together the story behind interface failures.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Case Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Navigate through branching storylines where your decisions shape the investigation outcome.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="text-lg px-8 py-3">
            Start Investigation
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Ready to solve your first UX crime?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
