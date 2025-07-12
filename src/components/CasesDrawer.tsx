
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function CasesDrawer({ open, onClose }:{
  open:boolean; onClose:()=>void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v)=>!v && onClose()}>
      <SheetContent side="right" className="w-80 p-6">
        <h2 className="text-lg font-semibold mb-4">Case Log</h2>
        <p className="text-sm text-zinc-500">Progress tracking coming soon…</p>
      </SheetContent>
    </Sheet>
  );
}
