'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Palette, 
  Music, 
  Frame, 
  Book, 
  Mail, 
  Image as ImageIcon, 
  FileText,
  Star,
  Truck,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';

const products = [
  { 
    title: "Polaroids & Keychains", 
    desc: "Aesthetic keepsakes you can carry anywhere.", 
    icon: <Camera size={32} />,
    price: "Starting from ₹199"
  },
  { 
    title: "Pencil Art Portraits", 
    desc: "Hand-drawn sketches that bring memories to life.", 
    icon: <Palette size={32} />,
    price: "Starting from ₹899"
  },
  { 
    title: "Spotify Polaroids", 
    desc: "Combine your favorite song with your favorite moment.", 
    icon: <Music size={32} />,
    price: "Starting from ₹299"
  },
  { 
    title: "Custom Photo Frames", 
    desc: "Frame your best memories in beautiful designs.", 
    icon: <Frame size={32} />,
    price: "Starting from ₹499"
  },
  { 
    title: "Spiral Albums", 
    desc: "A collection of moments in a stunning album.", 
    icon: <Book size={32} />,
    price: "Starting from ₹699"
  },
  { 
    title: "Greeting Cards", 
    desc: "Heartfelt designs made just for your loved ones.", 
    icon: <Mail size={32} />,
    price: "Starting from ₹99"
  },
  { 
    title: "Posters & Banners", 
    desc: "Make celebrations bigger and more memorable.", 
    icon: <ImageIcon size={32} />,
    price: "Starting from ₹399"
  },
  { 
    title: "Custom Invitations", 
    desc: "Unique and elegant invites for special occasions.", 
    icon: <FileText size={32} />,
    price: "Starting from ₹149"
  }
];

const reasons = [
  { icon: <CheckCircle2 />, text: "100% Customization" },
  { icon: <Star />, text: "Premium Quality" },
  { icon: <Zap />, text: "Fast Processing" },
  { icon: <ShieldCheck />, text: "Secure Ordering" },
  { icon: <Truck />, text: "Safe Delivery" },
  { icon: <Clock />, text: "24/7 Support" },
];

export default function Home() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="section hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '24px', lineHeight: '1.1' }}
          >
            🎁 Turn Your Memories into <span style={{ color: 'var(--primary-dark)', fontStyle: 'italic' }}>Beautiful Gifts</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '700px', marginInline: 'auto' }}
          >
            Customized gifts made with love — perfect for every special moment.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
          >
            <a href="#products" className="btn btn-primary">Shop Now <ArrowRight size={18} /></a>
            <a href="#products" className="btn btn-secondary">Explore Products</a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section" style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', margin: '40px auto' }}>
        <div className="container grid grid-cols-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>💖 Our Story</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
              At Pheonix Gifts, we believe every memory deserves to be cherished forever. 
              We specialize in creating personalized gifts that capture emotions, relationships, and unforgettable moments.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              From handcrafted pencil art to aesthetic polaroids and customized albums — every product is designed with creativity, care, and attention to detail.
              Whether it’s a birthday, anniversary, or surprise gift — we help you make it truly special.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: '400px', 
              background: 'white', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>[Aesthetic Image Placeholder]</span>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'var(--primary)', color: 'white', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <strong>Made with Love ❤️</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>🎁 Our Products</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Handcrafted treasures for your loved ones</p>
          </div>
          <div className="grid grid-cols-4">
            {products.map((product, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass"
                style={{ padding: '32px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  {product.icon}
                </div>
                <h3 style={{ marginBottom: '12px' }}>{product.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{product.desc}</p>
                <p style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--primary-dark)', color: 'white', borderRadius: 'var(--radius-lg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚀 Why Choose Us</h2>
            <p style={{ opacity: 0.8 }}>We don’t just sell products — we create emotions.</p>
          </div>
          <div className="grid grid-cols-3">
            {reasons.map((reason, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                <div style={{ color: 'var(--primary)' }}>{reason.icon}</div>
                <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>{reason.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px' }}>🛒 How to Order</h2>
          <div className="grid grid-cols-3" style={{ textAlign: 'center' }}>
            {[
              "Browse our products",
              "Select your favorite item",
              "Upload photos & details",
              "Customize your design",
              "Place order securely",
              "Relax while we create"
            ].map((step, i) => (
              <div key={i} style={{ padding: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 'bold' }}>
                  {i + 1}
                </div>
                <p style={{ fontWeight: '500' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container glass" style={{ padding: '80px 40px', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Make your loved ones smile today 💫</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Limited slots per day — Order now and create something unforgettable
          </p>
          <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
            Order Now <ShoppingBag size={20} />
          </button>
          
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} /> Secure Checkout
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Truck size={18} /> Pan-India Delivery
            </span>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/yournumber" 
        style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px', 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
          color: 'white', 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100
        }}
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
