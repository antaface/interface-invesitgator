
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";
import { StoryNode, Decision } from "@/types/game";

interface StoryPanelProps {
  currentNode: StoryNode;
  onDecisionSelect: (decision: Decision) => void;
  canMakeDecisions: boolean;
}

const StoryPanel: React.FC<StoryPanelProps> = ({ 
  currentNode, 
  onDecisionSelect, 
  canMakeDecisions 
}) => {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Case Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-6">
          <div className="py-4 space-y-4">
            {/* Current Story Summary */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h3 className="font-medium mb-2">{currentNode.summary}</h3>
              <p className="text-sm text-muted-foreground">
                {currentNode.description}
              </p>
              {currentNode.isComplete && (
                <Badge className="mt-2" variant="default">
                  Case Closed
                </Badge>
              )}
            </div>

            {/* Available Decisions */}
            {!currentNode.isComplete && currentNode.decisions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Available Actions:</h4>
                {currentNode.decisions.map((decision) => (
                  <Button
                    key={decision.id}
                    variant="outline"
                    className="w-full justify-between text-left h-auto p-3"
                    onClick={() => onDecisionSelect(decision)}
                    disabled={!canMakeDecisions}
                  >
                    <span className="text-sm">{decision.text}</span>
                    <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                ))}
              </div>
            )}

            {/* Required Evidence */}
            {currentNode.decisions.some(d => d.requiresEvidence?.length) && (
              <div className="text-xs text-muted-foreground">
                <p>Some actions may require specific evidence to proceed.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StoryPanel;
