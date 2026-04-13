import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SlotCard from "@/components/SlotCard";
import BookingSummary from "@/components/BookingSummary";
import { useBooking } from "@/context/BookingContext";
import { generateSlots } from "@/utils/mockData";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, Sun, Cloud, Moon, ChevronUp, CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BookingPage = () => {
  const { selectedDate, setSelectedDate } = useBooking();
  const slots = useMemo(() => generateSlots(selectedDate), [selectedDate]);
  const morningSlots = slots.filter((s) => s.period === "morning");
  const afternoonSlots = slots.filter((s) => s.period === "afternoon");
  const eveningSlots = slots.filter((s) => s.period === "evening");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableCount = slots.filter(s => s.available).length;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">📅 Slot Booking</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Book Your Slot</h1>
            <p className="opacity-70 text-sm">Select a date, pick your preferred time slots, and you're good to go!</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Calendar + Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border p-6 card-elevated"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg text-foreground">Select Date</h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today}
                className={cn("p-3 pointer-events-auto mx-auto")}
              />
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-4 py-2.5 px-4 bg-secondary rounded-xl"
                >
                  <p className="text-sm text-primary font-semibold">
                    📅 {format(selectedDate, "EEEE, dd MMMM yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {availableCount} slots available
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Slots */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Morning */}
                  <SlotSection
                    icon={<Sun className="w-5 h-5 text-accent" />}
                    title="Morning Slots"
                    subtitle="6:00 AM – 12:00 PM"
                    price="₹200/hr"
                    slots={morningSlots}
                  />

                  {/* Afternoon */}
                  <SlotSection
                    icon={<Cloud className="w-5 h-5 text-primary" />}
                    title="Afternoon Slots"
                    subtitle="12:00 PM – 5:30 PM"
                    price="₹225/hr"
                    slots={afternoonSlots}
                  />

                  {/* Evening */}
                  <SlotSection
                    icon={<Moon className="w-5 h-5 text-sport-blue" />}
                    title="Evening Slots"
                    subtitle="5:30 PM – 11:30 PM"
                    price="₹250/hr"
                    slots={eveningSlots}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl border p-12 text-center"
              >
                <div className="text-5xl mb-4 animate-float">📅</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">Select a Date</h3>
                <p className="text-sm text-muted-foreground">Choose a date from the calendar above to view available slots</p>
              </motion.div>
            )}
          </div>

          {/* Right — Summary (desktop) */}
          <div className="hidden lg:block">
            <BookingSummary />
          </div>
        </div>
      </div>

      {/* Mobile sticky summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileSummaryBar />
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

interface SlotSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
  slots: ReturnType<typeof generateSlots>;
}

const SlotSection = ({ icon, title, subtitle, price, slots }: SlotSectionProps) => {
  const availableCount = slots.filter(s => s.available).length;
  
  return (
    <div className="bg-card rounded-2xl border p-6 card-elevated">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-primary text-sm">{price}</p>
          <p className="text-[10px] text-muted-foreground">{availableCount}/{slots.length} available</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
};

const MobileSummaryBar = () => {
  const navigate = useNavigate();
  const { selectedSlots, getTotalAmount, termsAccepted, setTermsAccepted, setPaymentStatus, setBookingId } = useBooking();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const canPay = selectedSlots.length > 0 && termsAccepted;

  const handlePayment = () => {
    if (!canPay) return;
    setLoading(true);
    setPaymentStatus("processing");
    toast.loading("Processing payment...", { id: "payment" });
    setTimeout(() => {
      toast.dismiss("payment");
      const id = "OZ" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      setBookingId(id);
      setPaymentStatus("success");
      setLoading(false);
      toast.success("Payment successful! 🎉");
      navigate("/success");
    }, 2000);
  };

  return (
    <div className="bg-card border-t shadow-lg">
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-h-[60vh] overflow-y-auto p-4"
        >
          <BookingSummary />
        </motion.div>
      )}
      <div className="px-4 py-3 flex items-center justify-between">
        {selectedSlots.length === 0 ? (
          <p className="text-sm text-muted-foreground">Select slots to continue</p>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">{selectedSlots.length} slot(s) selected</p>
              <p className="font-display font-bold text-xl text-foreground">₹{getTotalAmount()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-2.5 rounded-xl border text-foreground"
              >
                <ChevronUp className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              {!expanded && (
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    T&C
                  </label>
                  <button
                    onClick={handlePayment}
                    disabled={!canPay || loading}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                      canPay && !loading ? "bg-gradient-cta text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Pay
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
