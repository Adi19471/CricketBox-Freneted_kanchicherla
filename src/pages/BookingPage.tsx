import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import { useBooking } from "@/context/BookingContext";
import { Service } from "@/types/booking";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, ChevronUp, CreditCard, Loader2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BookingPage = () => {
  const { selectedDate, setSelectedDate, services, loadingServices, fetchServices } = useBooking();
  const availableServices = useMemo(() => 
    Array.isArray(services) 
      ? services.filter((s: Service) => s.available)
      : [], 
    [services]
  );

  useEffect(() => {
    fetchServices(selectedDate);
  }, [selectedDate, fetchServices]); 

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const availableCount = availableServices.length;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">🛠️ Service Booking</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Book Services</h1>
            <p className="opacity-70 text-sm">Select a date to view available services</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Calendar + Services */}
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
                    {availableCount} services available
                  </p>
                </motion.div>
              )}
            </motion.div>

            {loadingServices && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading services...</span>
              </div>
            )} 

            {/* Services */}
            <AnimatePresence mode="wait">
              {selectedDate && !loadingServices && (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <ServiceSection services={services} />
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
                <p className="text-sm text-muted-foreground">Choose a date from the calendar to view available services</p>
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

interface ServiceSectionProps {
  services: Service[];
}

const ServiceSection = ({ services }: ServiceSectionProps) => {
  const availableCount = services.filter(s => s.available).length;
  
  return (
    <div className="bg-card rounded-2xl border p-6 card-elevated">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-foreground">Available Services</h3>
            <p className="text-sm text-muted-foreground">{availableCount} available</p>
          </div>
        </div>
      </div>
      {services.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">No services available</p>
          <p className="text-sm">No services for the selected date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { toggleService, selectedServices } = useBooking();
  const isSelected = selectedServices.some((s) => s.id === service.id);

  return (
    <motion.button
      whileHover={service.available ? { scale: 1.02 } : {}}
      whileTap={service.available ? { scale: 0.98 } : {}}
      disabled={!service.available}
      onClick={() => service.available && toggleService(service)}
      className={`
        p-5 rounded-xl border-2 text-left transition-all duration-200 group
        ${!service.available
          ? "opacity-50 cursor-not-allowed border-border bg-muted"
          : isSelected
            ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-lg"
            : "border-border hover:border-primary/50 hover:shadow-md bg-card group-hover:bg-secondary/30"
        }
      `}
    >
      {isSelected && (
        <div className="absolute inset-0 bg-primary/5 rounded-xl -m-1" />
      )}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-base mb-1">{service.name}</h4>
          <p className="text-2xl font-display font-bold text-primary">₹{service.price}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {!service.available ? (
            <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">Unavailable</span>
          ) : isSelected ? (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">Selected</span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">Available</span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

const MobileSummaryBar = () => {
  const navigate = useNavigate();
  const { selectedServices, getTotalAmount, termsAccepted, setTermsAccepted, setPaymentStatus, setBookingId } = useBooking();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const canPay = selectedServices.length > 0 && termsAccepted;

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
        {selectedServices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Select services to continue</p>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">{selectedServices.length} service(s) selected</p>
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

