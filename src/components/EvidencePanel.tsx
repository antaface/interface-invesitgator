
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Image, Users, BarChart3 } from "lucide-react";
import { Evidence } from "@/types/game";

interface EvidencePanelProps {
  evidence: Evidence[];
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'screenshot':
        return <Image className="h-4 w-4" />;
      case 'testimony':
        return <Users className="h-4 w-4" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const discoveredEvidence = evidence.filter(e => e.discovered);

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Evidence Board</span>
          <Badge variant="secondary">
            {discoveredEvidence.length}/{evidence.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-6">
          <div className="space-y-3 py-4">
            {discoveredEvidence.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evidence discovered yet.</p>
                <p className="text-sm">Continue your investigation to uncover clues.</p>
              </div>
            ) : (
              discoveredEvidence.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-1">
                      {getEvidenceIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EvidencePanel;
