import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-4">Umbu Houses</h2>
            <p className="text-primary-foreground/80 max-w-xs mx-auto md:mx-0">
              Experience the Mediterranean lifestyle in the heart of Bali. Six exclusive villas waiting for your arrival.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-primary-foreground/80 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +62 812 3456 7890</li>
              <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> hello@umbuhouses.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="p-3 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60 text-sm">
          &copy; {new Date().getFullYear()} Umbu Houses. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
