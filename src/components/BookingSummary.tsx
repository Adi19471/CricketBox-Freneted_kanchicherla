import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import CouponBox from "./CouponBox";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Shield, CreditCard, Loader2, Package } from "lucide-react";
import { useState } from "react";

const BookingSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    selectedDate, selectedServices, includeInsurance, setIncludeInsurance,
    termsAccepted, setTermsAccepted, phoneInput, setPhoneInput,
    paymentStatus, bookingResponse,
    getBasePrice, getConvenienceFee,
    getInsuranceFee, getDiscountAmount, getTotalAmount, createBookingFn,
  } = useBooking();


  const canPay = selectedServices.length > 0 && termsAccepted && paymentStatus === 'idle';

  const handlePayment = async () => {
    if (!canPay) return;
    setLoading(true);
    await createBookingFn();
    setLoading(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-2xl border p-6 card-elevated-lg sticky top-20"
    >
      <div className="flex items-center gap-2 mb-5">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-lg text-foreground">Booking Summary</h3>
      </div>

      <div className="space-y-4 text-sm">
        {/* Venue & Date */}
        <div className="bg-secondary rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Our Zone Box Cricket</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              {selectedDate ? format(selectedDate, "EEEE, dd MMM yyyy") : "Select a date"}
            </span>
          </div>
        </div>

        {/* Phone Input */}
        <div className="border-t pt-3">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 10-digit phone"
            maxLength={10}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        {/* Selected Services */}
        {selectedServices.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {selectedServices.length} Slot{selectedServices.length > 1 ? "s" : ""} Selected
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-secondary/60">
                  <span className="text-foreground font-medium truncate max-w-[120px]">{s.name}</span>
                  <span className="font-semibold text-foreground">₹{s.price}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (

          <div className="text-center py-6 text-muted-foreground text-xs">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No services selected yet</p>
            <p className="mt-1 text-[10px]">Select a date & pick your services</p>
          </div>
        )}

        {/* Price Breakdown */}
        {selectedServices.length > 0 && (
          <div className="border-t pt-3 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price</span>
              <span className="text-foreground font-medium">₹{getBasePrice()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Convenience Fee</span>
              <span className="text-foreground font-medium">₹{getConvenienceFee()}</span>
            </div>

            {/* Insurance */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <Shield className="w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors">Insurance (₹10)</span>
              </span>
              <span className="text-foreground font-medium">₹{getInsuranceFee()}</span>
            </label>

            {getDiscountAmount() > 0 && (
              <div className="flex justify-between text-primary font-medium">
                <span>🎉 Discount</span>
                <span>-₹{getDiscountAmount()}</span>
              </div>
            )}
          </div>
        )}

        {/* Coupon */}
        <div className="border-t pt-3">
          <CouponBox />
        </div>

        {/* Total */}
        <div className="border-t pt-4 flex justify-between items-center font-display">
          <span className="font-bold text-lg text-foreground">Total</span>
          <span className="font-bold text-2xl text-primary">₹{getTotalAmount()}</span>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-primary flex-shrink-0"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I agree to the <span className="text-foreground font-medium">Terms & Conditions</span> and{" "}
            <span className="text-foreground font-medium">Cancellation Policy</span>
          </span>
        </label>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={!canPay || loading}
          className={`
            w-full py-3.5 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2
            ${canPay && !loading
              ? "bg-gradient-cta text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Proceed to Pay – ₹{getTotalAmount()}
            </>
          )}
        </button>

        {paymentStatus === 'success' && bookingResponse && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="border-t pt-6 space-y-4"
          >
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">Booking Confirmed!</h4>
                <p className="text-sm text-muted-foreground">ID: #{bookingResponse.bookingId}</p>
              </div>
            </div>

            <div className="bg-secondary/50 p-4 rounded-xl space-y-3">
              <h5 className="font-semibold text-foreground text-sm uppercase tracking-wide">Booking Details</h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <div className="font-medium">{bookingResponse.data.bookingDate}</div>
                </div>
                <div>
                  <span className="text-muted-foreground"># Slots:</span>
                  <div className="font-medium">2</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <div className="font-medium">{bookingResponse.data.startTime} - {bookingResponse.data.endTime}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium">{bookingResponse.data.totalHours}h</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <div className="font-bold text-primary">₹{bookingResponse.data.amount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="font-medium text-success">{bookingResponse.data.status} / {bookingResponse.data.paymentStatus}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  if (bookingResponse?.data) {
                    navigator.clipboard.writeText(`https://rzp.io/rzp/ZwvGQc2`); // Use actual paymentRes.data.paymentLink if stored
                    toast.success('Payment link copied!');
                  }
                }}
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground p-3 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                📋 Copy Payment Link
              </button>
              <button
                onClick={() => {
                  if (bookingResponse?.data) {
                    window.open(`https://rzp.io/rzp/ZwvGQc2`, '_blank'); // Use actual paymentRes.data.paymentLink if stored
                  }
                }}
                className="w-full border border-primary/50 hover:bg-primary/5 text-primary p-3 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                🔗 Open Payment (Razorpay)
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 p-3 rounded-xl font-semibold text-sm"
              >
                👤 View My Bookings
              </button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              💳 Payment Status: PENDING | Complete payment to confirm booking
            </p>
          </motion.div>
        )}

        <p className="text-[10px] text-center text-muted-foreground">
          🔒 Secured by Razorpay • 100% Safe Payment
        </p>
      </div>
    </motion.div>
  );
};

export default BookingSummary;
