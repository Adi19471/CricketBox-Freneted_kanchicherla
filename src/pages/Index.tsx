import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Star, MapPin, Clock, ChevronRight, Users, Phone, ArrowRight, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-cricket.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { facilities, amenities, rules, galleryOnlineImages, testimonials } from "@/utils/mockData";
import { useState, useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const SectionTitle = ({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) => (
  <div className="mb-8">
    <motion.p variants={fadeUp} custom={0} className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">
      {emoji} {subtitle}
    </motion.p>
    <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-foreground">
      {title}
    </motion.h2>
  </div>
);

const Index = () => {
  const allGalleryImages = [heroImage, gallery1, gallery2, gallery3, ...galleryOnlineImages];
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        <img src={heroImage} alt="Our Zone Box Cricket arena" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-foreground/10" />

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-10 md:pb-16">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                <Star className="w-3 h-3 fill-current" /> 4.8 Rating
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-dark text-background text-xs font-medium">
                <Users className="w-3 h-3" /> 120+ Bookings
              </div>
              <div className="px-3 py-1.5 rounded-full glass-dark text-background text-xs font-medium">
                🏆 #1 in Nandigama
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-background mb-3 leading-[1.1]">
              Our Zone<br />
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">Box Cricket</span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-background/70 text-sm mb-8">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Nandigama, AP, India</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 6:00 AM – 11:59 PM</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> +91 98765 43210</span>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gradient-cta text-primary-foreground px-8 py-4 rounded-2xl font-display font-bold text-sm hover:opacity-90 transition-all hover:shadow-xl shadow-lg"
              >
                Book Now – ₹200 onwards <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="https://maps.google.com/?q=Nandigama+Andhra+Pradesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-background/30 text-background px-6 py-4 rounded-2xl text-sm font-medium hover:bg-background/10 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Price tag */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-24 right-4 md:right-8 bg-card rounded-2xl p-4 card-elevated-lg hidden sm:block"
        >
          <p className="text-xs text-muted-foreground mb-1">Starting from</p>
          <p className="font-display text-3xl font-bold text-primary">₹200</p>
          <p className="text-xs text-muted-foreground">per hour</p>
        </motion.div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionTitle emoji="🏏" title="About Our Venue" subtitle="Welcome" />
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-6">
              Our Zone Box Cricket is a premium indoor cricket facility located in the heart of Nandigama, Andhra Pradesh.
              Equipped with professional-grade artificial turf, powerful LED flood lights, and all modern amenities — it's the
              perfect destination for cricket enthusiasts looking for a thrilling game with friends and family.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-3 gap-4">
              {[
                { num: "17+", label: "Slots/Day" },
                { num: "120+", label: "Bookings" },
                { num: "4.8★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary rounded-xl">
                  <p className="font-display text-2xl font-bold text-primary">{stat.num}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-[4/3] card-elevated"
          >
            <img
              src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=700&q=80"
              alt="Cricket action"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== FACILITIES ===== */}
      <section id="facilities" className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <SectionTitle emoji="🏟" title="Facilities" subtitle="World-Class" />
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((f) => (
                  <motion.div
                    key={f.name}
                    variants={fadeUp}
                    custom={0}
                    className="flex items-start gap-3 bg-card p-4 rounded-2xl hover-lift border"
                  >
                    <span className="text-2xl mt-0.5">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <SectionTitle emoji="🧴" title="Amenities" subtitle="Premium" />
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((a) => (
                  <motion.div
                    key={a.name}
                    variants={fadeUp}
                    custom={0}
                    className="flex items-start gap-3 bg-card p-4 rounded-2xl hover-lift border"
                  >
                    <span className="text-2xl mt-0.5">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PRICING PREVIEW ===== */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <SectionTitle emoji="💰" title="Simple & Transparent Pricing" subtitle="Pricing" />
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-4"
        >
          {[
            { period: "☀️ Morning", time: "6:00 AM – 12:00 PM", price: 200, label: "per hour", color: "from-accent/10 to-accent/5 border-accent/20" },
            { period: "🌤️ Afternoon", time: "12:00 PM – 5:30 PM", price: 225, label: "per hour", color: "from-primary/10 to-primary/5 border-primary/20" },
            { period: "🌙 Evening", time: "5:30 PM – 11:30 PM", price: 250, label: "per hour", popular: true, color: "from-sport-blue/10 to-sport-blue/5 border-sport-blue/20" },
          ].map((tier, i) => (
            <motion.div
              key={tier.period}
              variants={fadeUp}
              custom={i}
              className={`relative bg-gradient-to-b ${tier.color} border-2 rounded-3xl p-6 text-center hover-lift ${tier.popular ? "ring-2 ring-sport-blue/30" : ""}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sport-blue text-sport-blue-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
              <p className="text-3xl mb-2">{tier.period.split(" ")[0]}</p>
              <h3 className="font-display font-bold text-foreground mb-1">{tier.period.split(" ").slice(1).join(" ")}</h3>
              <p className="text-xs text-muted-foreground mb-4">{tier.time}</p>
              <p className="font-display text-4xl font-bold text-foreground">₹{tier.price}</p>
              <p className="text-xs text-muted-foreground mb-4">{tier.label}</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Book Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== OFFERS ===== */}
      <section className="container mx-auto px-4 py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-primary-foreground overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/4" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">🎉 Limited Time Offer</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">Flat 30% OFF</h3>
              <p className="opacity-80 text-sm max-w-md">
                Use code <span className="font-bold bg-primary-foreground/20 px-2.5 py-1 rounded-lg">CRICKET30</span> and save up to ₹75 on your booking!
              </p>
            </div>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-foreground px-8 py-4 rounded-2xl font-display font-bold text-sm hover:opacity-90 transition-all shadow-lg whitespace-nowrap"
            >
              Claim Offer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="container mx-auto px-4 py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle emoji="📸" title="Gallery" subtitle="Our Venue" />

          <div className="space-y-4">
            <motion.div variants={fadeUp} custom={1} className="rounded-3xl overflow-hidden aspect-video bg-muted">
              <img
                src={allGalleryImages[activeImg]}
                alt="Gallery view"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </motion.div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allGalleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    i === activeImg ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionTitle emoji="⭐" title="What Players Say" subtitle="Testimonials" />
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="bg-card rounded-2xl p-6 border hover-lift">
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {t.name[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-accent fill-accent" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== RULES ===== */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto">
          <SectionTitle emoji="📜" title="Rules & Cancellation Policy" subtitle="Please Note" />
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4 bg-card p-5 rounded-2xl border hover-lift"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-sm text-primary">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground leading-relaxed">{rule}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80"
            alt="Cricket"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/60" />
          <div className="relative p-10 md:p-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-background mb-4 max-w-lg">
              Ready to Play? Book Your Slot Now!
            </h2>
            <p className="text-background/70 mb-8 max-w-md">
              Don't miss out on the best box cricket experience in Nandigama. Book your preferred slot now!
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-gradient-cta text-primary-foreground px-10 py-4 rounded-2xl font-display font-bold hover:opacity-90 transition-all shadow-xl"
            >
              Book Your Slot <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
