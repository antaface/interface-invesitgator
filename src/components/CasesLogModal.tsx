
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CasesLogModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCase: (id: string) => void;
}

const cases = [
  { id: 'nav1', title: 'Bloated Nav' },
  { id: 'tap1', title: 'Tiny Tap-Targets' },
  { id: 'form1', title: 'Frustrating Forms' },
  { id: 'search1', title: 'Broken Search' },
  { id: 'modal1', title: 'Modal Madness' },
  { id: 'mobile1', title: 'Mobile Mayhem' },
  { id: 'load1', title: 'Loading Limbo' },
  { id: 'access1', title: 'Accessibility Abyss' },
];

export function CasesLogModal({ open, onClose, onSelectCase }: CasesLogModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Case Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {cases.map((caseItem) => (
            <Button
              key={caseItem.id}
              variant="ghost"
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => onSelectCase(caseItem.id)}
            >
              <span className="text-left">{caseItem.title}</span>
              <Badge variant="secondary">Pending</Badge>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
