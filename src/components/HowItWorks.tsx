'use client';
import { motion } from 'framer-motion';
import { Camera, Palette, Truck, Heart } from 'lucide-react';

const steps = [
  { icon: <Camera size={32} />, num: '01', title: 'Choose Your Gift', desc: 'Browse our curated collection of handcrafted, personalized gifts for every occasion.' },
  { icon: <Palette size={32} />, num: '02', title: 'Personalize It', desc: 'Upload your photo, choose the occasion, and add your custom message or names.' },
  { icon: <Truck size={32} />, num: '03', title: 'We Craft & Deliver', desc: 'Our artisans bring your vision to life and courier it directly to your doorstep.' },
  { icon: <Heart size={32} />, num: '04', title: 'Create Memories', desc: 'Watch their eyes light up! Every gift is unique, meaningful, and unforgettable.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: 'linear-gradient(145deg, #fff5f7, #f5f3ff, #fff)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 70 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Simple Process</div>
          <h2 className="heading-lg serif" style={{ marginBottom: 16 }}>How It <span className="text-gradient">Works</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto' }}>
            Order your personalized gift in 4 easy steps — no hassle, just love.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', top: '80px', left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg, var(--primary), var(--accent))', opacity: 0.15, zIndex: 0 }} className="desktop-only" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: 1 }}
            >
              <div className="step-number">{s.num}</div>
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, var(--primary-light), #fce7f3)'
                    : 'linear-gradient(135deg, var(--accent-light), #ede9fe)',
                  color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                }}
              >{s.icon}</motion.div>
              <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
