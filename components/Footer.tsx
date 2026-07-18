export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Liv Villa</h2>
        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
          Experience the Mediterranean lifestyle in the heart of Bali.
        </p>
        <div className="border-t border-primary-foreground/20 pt-8 text-primary-foreground/60 text-sm">
          &copy; {new Date().getFullYear()} Liv Villa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
