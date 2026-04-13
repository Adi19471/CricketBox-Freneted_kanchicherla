import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Tag, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CouponBox = () => {
  const { couponApplied, couponCode, applyCoupon, removeCoupon } = useBooking();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    setError("");
    if (!input.trim()) return;
    const success = applyCoupon(input.trim());
    if (!success) {
      setError("Invalid coupon code. Try CRICKET30!");
    } else {
      setInput("");
    }
  };

  if (couponApplied) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-3.5 rounded-xl bg-primary/5 border-2 border-primary/20"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-bold text-primary block">{couponCode}</span>
            <span className="text-[10px] text-muted-foreground">30% off up to ₹75</span>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive transition-colors">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Apply
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive mt-1.5 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="text-[10px] text-muted-foreground mt-1.5">💡 Try: CRICKET30 for 30% off</p>
    </div>
  );
};

export default CouponBox;
