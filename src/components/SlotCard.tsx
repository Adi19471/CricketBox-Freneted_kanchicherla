import { motion } from "framer-motion";
import { Slot, useBooking } from "@/context/BookingContext";
import { Check, X, Clock } from "lucide-react";

interface SlotCardProps {
  slot: Slot;
}

const periodEmoji = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌙",
};

const SlotCard = ({ slot }: SlotCardProps) => {
  const { selectedSlots, toggleSlot } = useBooking();
  const isSelected = selectedSlots.some((s) => s.id === slot.id);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={slot.available ? { scale: 1.03, y: -2 } : {}}
      whileTap={slot.available ? { scale: 0.97 } : {}}
      disabled={!slot.available}
      onClick={() => slot.available && toggleSlot(slot)}
      className={`
        relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden
        ${!slot.available
          ? "opacity-40 cursor-not-allowed border-border bg-muted"
          : isSelected
            ? "border-primary bg-secondary ring-2 ring-primary/20 shadow-lg"
            : "border-border bg-card hover:border-primary/30 card-elevated"
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute top-0 left-0 w-full h-1 bg-gradient-cta"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
            isSelected ? "bg-primary/10" : "bg-secondary"
          }`}>
            {periodEmoji[slot.period]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="font-semibold text-sm text-foreground">{slot.time}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{slot.period} Slot</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-lg text-foreground">₹{slot.price}</p>
          {!slot.available ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
              <X className="w-3 h-3" /> Booked
            </span>
          ) : isSelected ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Check className="w-3 h-3" /> Selected
            </span>
          ) : (
            <span className="text-xs font-medium text-success">Available</span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default SlotCard;
