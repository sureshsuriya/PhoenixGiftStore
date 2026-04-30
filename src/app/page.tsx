'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { 
  ShoppingBag, Heart, Star, ArrowRight, CheckCircle2, 
  Truck, ShieldCheck, MessageCircle, Menu, X, Share2, 
  Gift, User, Camera, Plus, Minus, Trash2
} from 'lucide-react';

export interface Product {
  id: number;
  title: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  qty: number;
}

const products: Product[] = [
  { id: 1, title: "Classic Polaroids", desc: "Aesthetic high-quality polaroid prints of your best memories.", price: 249, category: "Bestseller", image: "/classic_polaroids.png", rating: 4.9, reviews: 128 },
  { id: 2, title: "Polaroids Keychain", desc: "A mini flipbook keychain featuring your favorite photos.", price: 199, category: "Accessories", image: "/music_charm.png", rating: 4.7, reviews: 85 },
  { id: 3, title: "Polaroids Spotify", desc: "Combine your favorite song barcode with your best photo.", price: 299, category: "Trending", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800", rating: 5.0, reviews: 210 },
  { id: 4, title: "Pencil Art", desc: "Hand-drawn pencil sketches that bring your memories to life.", price: 899, category: "Premium", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviews: 64 },
  { id: 5, title: "Customized Spiral Album", desc: "A collection of moments in a stunning spiral-bound album.", price: 599, category: "Albums", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviews: 142 },
  { id: 6, title: "Customized Photo Frame", desc: "Frame your best memories in beautiful, elegant designs.", price: 499, category: "Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800", rating: 4.8, reviews: 92 },
  { id: 7, title: "Customized Greeting Card", desc: "Heartfelt, personalized designs made just for your loved ones.", price: 149, category: "Cards", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviews: 201 },
  { id: 8, title: "Customized Posters & Banners", desc: "Make your celebrations bigger and more memorable.", price: 399, category: "Decor", image: "/classic_polaroids.png", rating: 4.7, reviews: 54 },
  { id: 9, title: "Customized Invitation", desc: "Unique and elegant invites for your special occasions.", price: 199, category: "Cards", image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800", rating: 4.9, reviews: 110 },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState('login');

  // Parallax Scroll for Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => { setIsMounted(true); }, []);

  // E-commerce logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToastMessage(`${product.title} added to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsCartOpen(true);
  };

  const updateQty = (id: number, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  // Animations
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

  if (!isMounted) return null;

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ position: 'fixed', top: 0, left: '50%', zIndex: 9999, background: 'var(--text-primary)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-lg)' }}
          >
            <CheckCircle2 size={18} color="var(--primary)" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation (Sticky Blur) */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: '16px 0', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.3s' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="logo serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', cursor: 'pointer' }}>
            Pheonix Gifts
          </motion.div>
          
          <div style={{ display: 'none', gap: '32px', fontWeight: 500 }} className="desktop-nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#collections" className="nav-link">Collections</a>
            <a href="#about" className="nav-link">Our Story</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => {setShowLoginModal(true); setLoginStep('login');}} className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={20} /> <span className="desktop-only" style={{ fontWeight: 600 }}>Login</span>
            </button>
            <button onClick={() => setIsCartOpen(true)} className="icon-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white', width: '22px', height: '22px', borderRadius: '50%', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white' }}>
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer Workflow */}
      <AnimatePresence>
        {isCartOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'relative', width: '100%', maxWidth: '400px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Cart ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: '#f3f4f6', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '40px' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                            <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</h4>
                            <p style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>₹{item.price}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: 'var(--radius-full)' }}>
                                <button onClick={() => updateQty(item.id, -1)} style={{ padding: '4px 8px' }}><Minus size={14} /></button>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} style={{ padding: '4px 8px' }}><Plus size={14} /></button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '24px', borderTop: '1px solid #f3f4f6', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>Proceed to Checkout <ArrowRight size={20} /></button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section (Parallax) */}
      <section id="home" className="section bg-gradient" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', overflow: 'hidden' }}>
        <div className="container grid grid-cols-2" style={{ alignItems: 'center', gap: '60px' }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ zIndex: 10 }}>
            <motion.div variants={itemVariants} className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--primary-light)' }}>
              <Star size={14} fill="var(--primary)" color="var(--primary)" /> Top Rated Gift Shop 2026
            </motion.div>
            <motion.h1 variants={itemVariants} className="heading-xl serif" style={{ marginBottom: '24px', marginTop: '16px' }}>
              Memories, <br/> Crafted into <span className="text-gradient">Art</span>
            </motion.h1>
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px' }}>
              Every relationship is unique. Celebrate yours with fully personalized, handcrafted gifts delivered to your doorstep.
            </motion.p>
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px' }}>
              <a href="#collections" className="btn btn-primary" style={{ padding: '18px 40px' }}>Shop Now</a>
            </motion.div>
          </motion.div>

          {/* Parallax Image with Continuous Motion */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity, position: 'relative', height: '650px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: '100%', height: '100%' }}
            >
              <Image src="/classic_polaroids.png" alt="Hero" fill style={{ objectFit: 'cover' }} priority />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
          </motion.div>
        </div>
      </section>

      {/* Collections (Advanced Grid) */}
      <section id="collections" className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <h2 className="heading-lg serif" style={{ marginBottom: '12px' }}>Trending Gifts</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>The most loved personalized products this week.</p>
            </div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem' }}>View All <ArrowRight size={20} /></a>
          </motion.div>

          <motion.div className="grid grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={containerVariants}>
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="product-card" whileHover={{ y: -12, boxShadow: 'var(--shadow-xl)' }} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="product-image-container" style={{ aspectRatio: '1/1', position: 'relative' }}>
                  <Image src={product.image} alt={product.title} fill className="product-image" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--text-primary)', margin: 0 }}>{product.category}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', padding: '10px', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }}>
                    <Heart size={20} color="var(--primary)" />
                  </motion.button>
                </div>
                
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="serif" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{product.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', flexGrow: 1 }}>{product.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{product.price}</span>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      style={{ background: 'var(--text-primary)', color: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Banner */}
      <section className="section" style={{ background: 'var(--primary-light)', padding: '120px 20px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="container glass" style={{ maxWidth: '800px', padding: '60px', borderRadius: '40px', background: 'rgba(255,255,255,0.7)' }}>
          <Camera size={48} color="var(--primary)" style={{ margin: '0 auto 24px' }} />
          <h2 className="heading-lg serif" style={{ marginBottom: '24px' }}>Join the Pheonix Family</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>Follow us on Instagram to see our latest creations and tag us to be featured!</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
            {['#gifts', '#giftshop', '#friends', '#artgallery'].map((tag, i) => (
              <span key={i} style={{ padding: '8px 20px', background: 'white', borderRadius: 'var(--radius-full)', fontWeight: 600, color: 'var(--text-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>{tag}</span>
            ))}
          </div>
          <button onClick={() => window.open('https://instagram.com/Pheonix._.gifts', '_blank')} className="btn btn-primary" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>Follow @Pheonix._.gifts</button>
        </motion.div>
      </section>

      {/* Login / Referral Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', width: '90%', maxWidth: '450px', background: 'white', borderRadius: '30px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
              <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--text-secondary)', background: '#f3f4f6', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
              
              {loginStep === 'login' ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', transform: 'rotate(-10deg)' }}><User size={32} /></div>
                    <h2 className="heading-md serif">Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Login to manage orders and access referrals.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="email" placeholder="Email Address" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f3f4f6', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#f3f4f6'} />
                    <input type="password" placeholder="Password" style={{ padding: '16px', borderRadius: '16px', border: '2px solid #f3f4f6', outline: 'none', fontSize: '1rem', transition: 'border-color 0.3s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#f3f4f6'} />
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '16px' }} onClick={() => setLoginStep('referral')}>Sign In</button>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '16px', fontSize: '0.9rem' }}>Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Sign up</span></p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', background: '#ecfdf5', color: '#10b981', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', transform: 'rotate(10deg)' }}><Gift size={32} /></div>
                    <h2 className="heading-md serif">Give ₹100, Get ₹100</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Share your unique link. When your friend buys, you both get a ₹100 discount.</p>
                  </div>
                  <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '2px', fontSize: '1.2rem' }}>PHX-GFT-2026</span>
                    <button style={{ color: 'var(--primary)', fontWeight: 800, background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '8px' }}>COPY</button>
                  </div>
                  <a href="whatsapp://send?text=Hey! Check out Pheonix Gifts. Use my code PHX-GFT-2026 for ₹100 off: http://localhost:3000" className="btn" style={{ width: '100%', background: '#25D366', color: 'white', padding: '16px', display: 'flex', justifyContent: 'center' }}>
                    <MessageCircle size={20} /> Share via WhatsApp
                  </a>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global CSS Adjustments for links/buttons inside component */}
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link { color: var(--text-primary); transition: color 0.3s; position: relative; }
        .nav-link:hover { color: var(--primary); }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background: var(--primary); transition: width 0.3s; }
        .nav-link:hover::after { width: 100%; }
        .icon-btn { color: var(--text-primary); transition: color 0.3s; }
        .icon-btn:hover { color: var(--primary); }
        @media (min-width: 769px) { .desktop-nav { display: flex !important; } .mobile-menu-btn { display: none !important; } .desktop-only { display: inline !important; } }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
      `}} />
    </div>
  );
}
