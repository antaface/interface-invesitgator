
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { casesMeta } from "@/data/casesMeta";

interface CasesLogModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCase: (id: string) => void;
}

export function CasesLogModal({ open, onClose, onSelectCase }: CasesLogModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Case Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {casesMeta.map(c => (
            <div key={c.prefix} className="flex items-center justify-between p-3 border rounded">
              <span className="text-left">{c.title}</span>
              <button
                onClick={() => onSelectCase(c.prefix)}
                className="btn-link"
              >
                Investigate&nbsp;now →
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
