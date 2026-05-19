'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Palette, Award, Phone } from 'lucide-react';

const features = [
  { icon: <Palette size={24} />, color: '#f43f5e', bg: '#fff1f2', title: '100% Customized', desc: 'Every product is uniquely designed just for you — no two gifts are the same.' },
  { icon: <ShieldCheck size={24} />, color: '#10b981', bg: '#ecfdf5', title: 'Quality Guaranteed', desc: 'Premium materials and artisan craftsmanship in every single order.' },
  { icon: <Truck size={24} />, color: '#3b82f6', bg: '#eff6ff', title: 'Pan-India Delivery', desc: 'Safe courier delivery to any corner of India with tracking updates.' },
  { icon: <Clock size={24} />, color: '#f59e0b', bg: '#fef3c7', title: 'On-Time Dispatch', desc: 'We value your special occasions. Orders dispatched within 2–3 days.' },
  { icon: <Award size={24} />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Top Rated in 2026', desc: 'Trusted by 2000+ customers with 4.9★ average satisfaction rating.' },
  { icon: <Phone size={24} />, color: '#ec4899', bg: '#fdf2f8', title: '24/7 Support', desc: 'Our friendly team is always reachable via WhatsApp or Instagram.' },
];

export default function WhyUs() {
  return (
    <section id="about" className="section" style={{ background: 'white' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Why Choose Us</div>
          <h2 className="heading-lg serif">Crafted with <span className="text-gradient">Heart & Soul</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 520, margin: '16px auto 0' }}>
            Pheonix Gifts stands for quality, creativity, and making every moment unforgettable.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="about-feature"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="about-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 60, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            borderRadius: 24, overflow: 'hidden'
          }}
        >
          {[
            { num: '2000+', label: 'Happy Customers' },
            { num: '9', label: 'Gift Collections' },
            { num: '4.9★', label: 'Avg. Rating' },
            { num: '2 Days', label: 'Avg. Dispatch' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
