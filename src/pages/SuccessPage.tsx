import { motion } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CheckCircle, Download, Home, MessageCircle, MapPin, CalendarDays, Clock, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";

const ConfettiPiece = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    initial={{ y: -20, x: Math.random() * 300 - 150, opacity: 1, rotate: 0 }}
    animate={{ y: 400, opacity: 0, rotate: Math.random() * 720 }}
    transition={{ duration: 2.5 + Math.random() * 1.5, delay, ease: "easeIn" }}
    className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-sm"
    style={{ backgroundColor: color }}
  />
);

const confettiColors = [
  "hsl(152, 60%, 36%)", "hsl(38, 92%, 50%)", "hsl(210, 80%, 50%)",
  "hsl(0, 84%, 60%)", "hsl(280, 70%, 50%)", "hsl(45, 100%, 50%)",
];

const SuccessPage = () => {
  const { bookingId, selectedDate, selectedSlots, getTotalAmount, resetBooking } = useBooking();

  const whatsappMsg = encodeURIComponent(
    `🏏 Booking Confirmed!\\n\\n📍 Venue: Our Zone Box Cricket\\n🆔 Booking ID: ${bookingId || "OZ-DEMO"}\\n📅 Date: ${selectedDate ? format(selectedDate, "dd MMM yyyy") : "—"}\\n⏰ Slots: ${(selectedSlots ?? []).map(s => s.time).join(", ") || "—"}\\n💰 Amount: ₹${getTotalAmount()}\\n\\nSee you on the turf! 🏏`
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-card rounded-3xl border p-8 md:p-12 max-w-xl w-full text-center card-elevated-lg relative overflow-hidden"
        >
          {/* Confetti */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <ConfettiPiece key={i} delay={i * 0.1} color={confettiColors[i % confettiColors.length]} />
            ))}
          </div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
          >
            Payment Successful! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            Your cricket slot has been booked successfully
          </motion.p>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-secondary rounded-2xl p-6 text-left space-y-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Booking ID</span>
              <span className="font-mono font-bold text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg">
                {bookingId || "OZ-DEMO"}
              </span>
            </div>

            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">Our Zone Box Cricket, Nandigama</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground">
                  {selectedDate ? format(selectedDate, "EEEE, dd MMM yyyy") : "—"}
                </span>
              </div>
{selectedSlots?.length > 0 && (
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
{(selectedSlots ?? []).map((s) => (
                      <p key={s.id} className="text-foreground">{s.time} — ₹{s.price}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">Amount Paid</span>
              </div>
₹{getTotalAmount?.() ?? 0}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-cta text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg">
              <Download className="w-4 h-4" /> Download Invoice
            </button>
            <a
              href={`https://wa.me/?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border-2 py-3.5 rounded-xl font-semibold text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Share on WhatsApp
            </a>
          </motion.div>

          <Link
            to="/"
            onClick={resetBooking}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
