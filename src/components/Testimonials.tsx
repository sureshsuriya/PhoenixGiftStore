'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Priya M.', city: 'Chennai', text: "Ordered a Polaroid Spotify print for my boyfriend's birthday. He was absolutely speechless! The quality was stunning and delivery was super fast.", rating: 5, product: 'Polaroids Spotify', avatar: '👩' },
  { name: 'Rahul K.', city: 'Bangalore', text: "The pencil art portrait of my parents is a masterpiece. Every detail was captured perfectly. My mom cried happy tears. 10/10 would recommend!", rating: 5, product: 'Pencil Art', avatar: '👨' },
  { name: 'Sneha V.', city: 'Mumbai', text: "Got the Spiral Album for our anniversary — it's so premium and personal. The team was super responsive and the packaging was gorgeous.", rating: 5, product: 'Spiral Album', avatar: '👩' },
  { name: 'Arjun S.', city: 'Hyderabad', text: "The custom greeting card was beautifully designed. It was delivered before the deadline and my friend loved it. Will definitely order again!", rating: 5, product: 'Greeting Card', avatar: '👦' },
  { name: 'Divya P.', city: 'Coimbatore', text: "Pheonix Gifts made my sister's wedding invitation so elegant and unique. Everyone at the wedding complimented the design. Amazing work!", rating: 5, product: 'Custom Invitation', avatar: '👩' },
  { name: 'Karthik R.', city: 'Pune', text: "Ordered classic polaroids for our friend group. The prints are crisp, vibrant, and feel so premium. Perfect gift for any occasion!", rating: 5, product: 'Classic Polaroids', avatar: '👨' },
];

function StarRow({ n }: { n: number }) {
  return <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
    {Array.from({ length: n }).map((_, i) => (
      <svg key={i} width={16} height={16} fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    ))}
  </div>;
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>Customer Love</div>
          <h2 className="heading-lg serif">Real Stories, <span className="text-gradient">Real Smiles</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 460, margin: '16px auto 0' }}>
            Over 2,000+ happy customers across India. Read what they say about us.
          </p>
        </motion.div>

        {/* Carousel */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            ref={trackRef}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${testimonials.length}, minmax(320px, 1fr))`,
              gap: 24,
              transform: `translateX(calc(-${active} * (320px + 24px)))`,
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              width: 'max-content',
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ width: 320 }}>
                <StarRow n={t.rating} />
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: 24, paddingTop: 8 }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>{t.city} · {t.product}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span className="badge" style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#065f46' }}>✓ Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 28 : 10, height: 10, borderRadius: 5,
              background: i === active ? 'var(--primary)' : '#e5e7eb',
              transition: 'all 0.3s', border: 'none', cursor: 'pointer'
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
