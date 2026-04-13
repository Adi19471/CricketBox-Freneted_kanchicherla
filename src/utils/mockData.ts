import { Slot } from "@/context/BookingContext";

// Simulate some slots as already booked
const bookedSlotIds = new Set(["morning-2", "morning-5", "evening-1", "evening-4", "afternoon-1"]);

export const generateSlots = (date?: Date): Slot[] => {
  const morningSlots: Slot[] = [];
  const afternoonSlots: Slot[] = [];
  const eveningSlots: Slot[] = [];

  // Morning slots: 6 AM to 12 PM (1hr each)
  for (let i = 0; i < 6; i++) {
    const startHour = 6 + i;
    const endHour = startHour + 1;
    const id = `morning-${i}`;
    // Randomly mark some extra as booked based on date
    const dateBooked = date ? (date.getDate() + i) % 7 === 0 : false;
    morningSlots.push({
      id,
      time: `${formatHour(startHour)} – ${formatHour(endHour)}`,
      price: 200,
      period: "morning",
      available: !bookedSlotIds.has(id) && !dateBooked,
    });
  }

  // Afternoon slots: 12 PM to 5:30 PM (1hr each)
  for (let i = 0; i < 5; i++) {
    const startHour = 12 + i;
    const endHour = startHour + 1;
    const id = `afternoon-${i}`;
    const dateBooked = date ? (date.getDate() + i) % 5 === 0 : false;
    afternoonSlots.push({
      id,
      time: `${formatHour(startHour)} – ${formatHour(endHour)}`,
      price: 225,
      period: "afternoon",
      available: !bookedSlotIds.has(id) && !dateBooked,
    });
  }

  // Evening slots: 5:30 PM to 11:30 PM (1hr each)
  for (let i = 0; i < 6; i++) {
    const startMinutes = 17 * 60 + 30 + i * 60;
    const endMinutes = startMinutes + 60;
    const id = `evening-${i}`;
    const dateBooked = date ? (date.getDate() + i) % 6 === 0 : false;
    eveningSlots.push({
      id,
      time: `${formatMinutes(startMinutes)} – ${formatMinutes(endMinutes)}`,
      price: 250,
      period: "evening",
      available: !bookedSlotIds.has(id) && !dateBooked,
    });
  }

  return [...morningSlots, ...afternoonSlots, ...eveningSlots];
};

function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:00 ${period}`;
}

function formatMinutes(totalMins: number): string {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export const facilities = [
  { icon: "💡", name: "Flood Lights", desc: "Professional-grade LED flood lights" },
  { icon: "🅿️", name: "Parking", desc: "Free two-wheeler & car parking" },
  { icon: "💺", name: "Seating Area", desc: "Comfortable gallery seating for spectators" },
  { icon: "🚻", name: "Washrooms", desc: "Clean & well-maintained washrooms" },
  { icon: "💧", name: "Drinking Water", desc: "RO purified drinking water" },
  { icon: "📶", name: "Free Wi-Fi", desc: "High-speed internet access" },
];

export const amenities = [
  { icon: "👔", name: "Changing Room", desc: "Private changing rooms" },
  { icon: "🏏", name: "Equipment Rental", desc: "Bats, pads & gloves available" },
  { icon: "📊", name: "Scoreboard", desc: "Digital scoreboard tracking" },
  { icon: "🩹", name: "First Aid Kit", desc: "Emergency medical kit on-site" },
];

export const rules = [
  "Reach the venue at least 10 minutes before your slot",
  "No refund for cancellations within 2 hours of the slot",
  "No smoking or alcohol allowed on premises",
  "Follow all safety rules and guidelines provided by the venue",
  "Please vacate the turf on time after your slot ends",
  "Shoes must be worn at all times on the turf",
];

export const galleryOnlineImages = [
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80",
  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
  "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80",
  "https://images.unsplash.com/photo-1629285483773-6b5cde2171d5?w=800&q=80",
];

export const testimonials = [
  { name: "Ravi Kumar", rating: 5, text: "Best box cricket facility in Nandigama! Great turf and facilities." },
  { name: "Priya Sharma", rating: 5, text: "Amazing experience! The booking was smooth and the turf quality is top-notch." },
  { name: "Ajay Reddy", rating: 4, text: "Good place for weekend cricket with friends. Well maintained." },
];
