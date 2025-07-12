
export interface StoryNode {
  id: string;
  summary: string;
  description: string;
  decisions: Decision[];
  evidence: Evidence[];
  isComplete?: boolean;
}

export interface Decision {
  id: string;
  text: string;
  nextNodeId: string;
  requiresEvidence?: string[];
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'screenshot' | 'testimony' | 'analysis';
  discovered: boolean;
}

export interface GameSession {
  id: string;
  currentNodeId: string;
  discoveredEvidence: string[];
  conversationHistory: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'investigator';
  content: string;
  timestamp: Date;
  nodeId: string;
}

export interface InvestigatorResponse {
  message: string;
  availableActions: string[];
  newEvidence?: Evidence[];
}
