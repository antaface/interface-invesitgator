
import { playSfx } from "@/hooks/useSfx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { casesMeta } from "@/data/casesMeta";

interface CasesLogModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCase: (id: string) => void;
  solved: Set<string>;
}

export function CasesLogModal({ open, onClose, onSelectCase, solved }: CasesLogModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Case Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {casesMeta.map(c => {
            const isSolved = solved.has(c.prefix);
            return (
              <div key={c.prefix} className="flex items-center justify-between p-3 border rounded">
                <span className="text-left">{c.title}</span>
                {isSolved ? (
                  <span className="px-3 py-1 rounded-md bg-emerald-700/20 text-emerald-400 text-sm">
                    Case Closed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playSfx("click");
                      onSelectCase(c.prefix);
                    }}
                    className="btn-link"
                  >
                    Investigate&nbsp;now →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
