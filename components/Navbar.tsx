"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-primary font-bold">
          Liv Villa
        </Link>
        <div className="hidden md:flex gap-8 items-center text-foreground font-medium">
          <Link href="#home" className="hover:text-primary transition-colors">Home</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="#villas" className="hover:text-primary transition-colors">Villas</Link>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">Sign In</Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
