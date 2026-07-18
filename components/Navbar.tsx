"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Villas", href: "/villas" },
    { name: "Contact Us", href: "#contact" },
    { name: "My Reservations", href: "/reservations" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-primary font-bold">
          Umbu Houses
        </Link>
        <div className="hidden lg:flex gap-6 items-center text-foreground font-medium">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={link.href} className="hover:text-primary transition-colors">
                {link.name}
              </Link>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Sign In
            </Button>
          </motion.div>
        </div>
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full mt-2">
                Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
