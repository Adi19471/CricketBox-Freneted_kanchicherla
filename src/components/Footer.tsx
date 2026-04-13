import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Instagram, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-cta flex items-center justify-center">
              <span className="text-lg">🏏</span>
            </div>
            <div>
              <p className="font-display font-bold text-base leading-tight">Our Zone</p>
              <p className="text-[10px] tracking-wider uppercase opacity-60">Box Cricket</p>
            </div>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">
            Premium box cricket facility in Nandigama with world-class turf and amenities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</Link></li>
            <li><Link to="/booking" className="opacity-60 hover:opacity-100 transition-opacity">Book a Slot</Link></li>
            <li><a href="/#facilities" className="opacity-60 hover:opacity-100 transition-opacity">Facilities</a></li>
            <li><a href="/#gallery" className="opacity-60 hover:opacity-100 transition-opacity">Gallery</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 opacity-60">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Nandigama, Krishna District, Andhra Pradesh, India</span>
            </li>
            <li className="flex items-center gap-2 opacity-60">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2 opacity-60">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>info@ourzonecricket.com</span>
            </li>
          </ul>
        </div>

        {/* Timing */}
        <div>
          <h4 className="font-display font-semibold text-sm mb-4 uppercase tracking-wider opacity-80">Timing</h4>
          <div className="flex items-start gap-2 text-sm opacity-60 mb-4">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>Mon – Sun</p>
              <p className="font-semibold opacity-100">6:00 AM – 11:59 PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-xs opacity-40">© 2026 Our Zone Box Cricket. All rights reserved.</p>
        <div className="flex gap-4 text-xs opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
