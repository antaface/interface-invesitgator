
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CasesLogModalProps {
  open: boolean;
  onClose: () => void;
  cases: { id: string; title: string; status: 'open' | 'closed' }[];
  onSelectCase: (choiceId: string) => void;
}

export function CasesLogModal({ open, onClose, cases, onSelectCase }: CasesLogModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Case Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {cases.map(c => (
            <div key={c.id} className="flex justify-between items-center mb-3">
              <span>{c.title}</span>
              {c.status === 'closed'
                ? <span className="text-green-600 text-xs font-semibold">Case Closed</span>
                : <button
                    onClick={() => onSelectCase(c.id)}
                    className="text-primary-600 border border-primary-600 px-3 py-1 rounded">
                    Investigate Now
                  </button>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
