import type { Metadata } from "next";
import "./globals.css";
import { Heart, ShoppingBag, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Pheonix Gifts | Turn Your Memories into Beautiful Gifts",
  description: "Customized gifts made with love — perfect for every special moment. Personalized posters, banners, pencil art, polaroids and more.",
  keywords: "customized gifts India, personalized gifts online, birthday gift ideas, polaroid prints India, pencil art portrait custom, unique gift shop online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header glass">
          <div className="container nav">
            <div className="logo">
              <Heart size={24} fill="currentColor" style={{ marginRight: '8px' }} />
              Pheonix Gifts
            </div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <ThemeToggle />
              <button className="icon-btn"><ShoppingBag size={24} /></button>
              <button className="icon-btn md-hide"><Menu size={24} /></button>
            </div>
          </div>
        </header>
        
        <main style={{ marginTop: '80px' }}>
          {children}
        </main>

        <footer style={{ background: 'var(--bg-secondary)', padding: '60px 0', marginTop: '80px', borderTop: '1px solid var(--glass-border)' }}>
          <div className="container grid grid-cols-4">
            <div>
              <h3 style={{ marginBottom: '20px' }}>Pheonix Gifts</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Where Memories Turn into Beautiful Creations. Every product is crafted with creativity and care.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', lineHeight: '2' }}>
                <li><a href="/">Home</a></li>
                <li><a href="#products">Shop All</a></li>
                <li><a href="#about">Our Story</a></li>
                <li><a href="#contact">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Products</h4>
              <ul style={{ listStyle: 'none', lineHeight: '2' }}>
                <li>Polaroids</li>
                <li>Pencil Art</li>
                <li>Photo Frames</li>
                <li>Spiral Albums</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Follow Us</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Stay updated with new designs and offers.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Social icons would go here */}
                <span>Instagram</span>
                <span>Facebook</span>
              </div>
            </div>
          </div>
          <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} Pheonix Gifts. Made with ❤️ in India.
          </div>
        </footer>
      </body>
    </html>
  );
}
