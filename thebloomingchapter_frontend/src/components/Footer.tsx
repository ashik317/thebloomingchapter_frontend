import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-forest text-cream">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">The Blooming Chapter</p>
          <p className="mt-2 text-sm text-cream/70">Books · Coffee · Flowers. A slow corner of the city to read, sip and gift.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Shop</p>
          <Link href="/books" className="text-cream/70 hover:text-white">Books &amp; PDFs</Link>
          <Link href="/cafe" className="text-cream/70 hover:text-white">Café menu</Link>
          <Link href="/flowers" className="text-cream/70 hover:text-white">Flowers</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Account</p>
          <Link href="/dashboard" className="text-cream/70 hover:text-white">My dashboard</Link>
          <Link href="/dashboard/messages" className="text-cream/70 hover:text-white">Message us</Link>
          <p className="text-cream/70">Pay with bKash, Nagad, cards and banking</p>
        </div>
      </div>
      <p className="border-t border-cream/10 py-5 text-center text-xs text-cream/60">© {new Date().getFullYear()} The Blooming Chapter</p>
    </footer>
  );
}
