'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, X, Menu, Package, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  isLoggedIn: boolean;
  onCartOpen: () => void;
  onLoginOpen: () => void;
  onOrdersOpen: () => void;
  onLogout: () => void;
}

export default function Navbar({ cartCount, isLoggedIn, onCartOpen, onLoginOpen, onOrdersOpen, onLogout }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#collections', label: 'Shop' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 1000,
          padding: scrolled ? '10px 0' : '18px 0',
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          borderBottom: scrolled ? '1px solid rgba(244,63,94,0.1)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #f43f5e, #be123c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(244,63,94,0.3)'
            }}>🎁</div>
            <span className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#be123c' }}>
              Pheonix Gifts
            </span>
          </a>

          <div className="desktop-nav" style={{ display: 'none', gap: '4px', alignItems: 'center' }}>
            {links.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isLoggedIn ? (
              <button onClick={onLoginOpen} className="icon-btn desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <LogIn size={18} /> Login
              </button>
            ) : (
              <div className="desktop-only" style={{ display: 'flex', gap: 6 }}>
                <button onClick={onOrdersOpen} className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Package size={18} /> Orders
                </button>
                <button onClick={onLogout} className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            )}
            <button onClick={onCartOpen} className="icon-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{
                      position: 'absolute', top: -6, right: -6,
                      background: 'linear-gradient(135deg,#f43f5e,#be123c)',
                      color: 'white', width: 20, height: 20,
                      borderRadius: '50%', fontSize: '0.7rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, border: '2px solid white'
                    }}
                  >{cartCount}</motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
              background: 'white', borderBottom: '1px solid rgba(244,63,94,0.1)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)', overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {links.map(l => (
                <a key={l.href} href={l.href} className="nav-link" onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', padding: '12px 16px' }}
                >{l.label}</a>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div style={{ borderTop: '1px solid rgba(244,63,94,0.1)', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!isLoggedIn ? (
                  <button onClick={() => { onLoginOpen(); setMobileOpen(false); }} className="nav-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                    <LogIn size={18} /> Login / Sign Up
                  </button>
                ) : (
                  <>
                    <button onClick={() => { onOrdersOpen(); setMobileOpen(false); }} className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                      <Package size={18} /> My Orders
                    </button>
                    <button onClick={() => { onLogout(); setMobileOpen(false); }} className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: '#ef4444' }}>
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
