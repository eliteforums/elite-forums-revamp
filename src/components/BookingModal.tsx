import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden rounded-2xl border-border/60">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Book a Meeting</DialogTitle>
              <p className="text-sm text-muted-foreground">Pick a time that works for you</p>
            </div>
          </div>
        </DialogHeader>
        <div className="w-full">
          <iframe
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0AX_L2bFXqdvEqYfczKheIWDgu7w71VrweGPr5nS50060BvUOPkRb3e2LlGJ4V-RA7KuVKabsn?gv=true"
            style={{ border: 0 }}
            width="100%"
            height="550"
            title="Schedule a meeting with Elite Forums"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
