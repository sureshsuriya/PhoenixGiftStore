'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { CartItem } from '../app/page';

interface CheckoutModalProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = 'idle' | 'sending' | 'done' | 'error';

export default function CheckoutModal({ cart, isOpen, onClose }: CheckoutModalProps) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', city:'', state:'', pincode:'', note:'' });
  const [status, setStatus] = useState<OrderStatus>('idle');
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) { alert('Fill all delivery fields.'); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: cart, total })
      });
      const d = await res.json();
      if (d.success) {
        // Use the real server-generated orderId
        const realOrderId = d.orderId || ('ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase());
        const newOrder = { 
          id: realOrderId, 
          date: new Date().toISOString(), 
          items: cart, 
          total, 
          status: 'Processing',
          phone: form.phone, // save phone for live status lookup
          name: form.name,
        };
        const ex = localStorage.getItem('pheonix_orders');
        const orders = ex ? JSON.parse(ex) : [];
        localStorage.setItem('pheonix_orders', JSON.stringify([...orders, newOrder]));
        setStatus('done'); 
      } else setStatus('error');
    } catch { setStatus('error'); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '2px solid #f3f4f6', outline: 'none', fontSize: '0.95rem',
    fontFamily: 'inherit', boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            style={{ position: 'relative', width: '100%', maxWidth: 560, background: 'white', borderRadius: 28, boxShadow: '0 30px 80px rgba(0,0,0,0.3)', maxHeight: '92vh', overflowY: 'auto' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)', padding: '24px 28px', borderRadius: '28px 28px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  {status === 'done' ? '🎉 Order Placed!' : '🚚 Delivery Details'}
                </h2>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 8, color: 'white', display: 'flex' }}><X size={18} /></button>
            </div>

            {status === 'done' ? (
              <div style={{ padding: '60px 32px', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} style={{ fontSize: '5rem', marginBottom: 20 }}>🎁</motion.div>
                <h2 className="serif" style={{ color: 'var(--primary-dark)', fontSize: '2rem', marginBottom: 12 }}>Order Confirmed!</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 8px' }}>Your order has been sent to our team. We'll contact you within <strong>24 hours</strong> to confirm and start crafting your special gift.</p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: 32 }}>Check your email for confirmation 💌</p>
                <button className="btn btn-primary" onClick={() => { onClose(); setStatus('idle'); }}>Continue Shopping</button>
              </div>
            ) : (
              <div style={{ padding: '28px' }}>
                {/* Order Summary */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
                  <p style={{ fontWeight: 800, marginBottom: 10, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>🛍️ Your Order</p>
                  {cart.map(i => (
                    <div key={i.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                      <span>{i.title} × {i.qty}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{i.price * i.qty}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(244,63,94,0.15)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.05rem' }}>
                    <span>Total</span><span>₹{total}</span>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {[
                    { label: 'Full Name *', key: 'name', type: 'text', ph: 'Your full name' },
                    { label: 'Phone *', key: 'phone', type: 'tel', ph: '10-digit mobile' },
                    { label: 'Email', key: 'email', type: 'email', ph: 'yourmail@gmail.com' },
                    { label: 'Address *', key: 'address', type: 'text', ph: 'House, Street, Area' },
                    { label: 'City *', key: 'city', type: 'text', ph: 'City' },
                    { label: 'State *', key: 'state', type: 'text', ph: 'State' },
                    { label: 'Pincode *', key: 'pincode', type: 'text', ph: '6-digit pincode' },
                    { label: 'Note', key: 'note', type: 'text', ph: 'Gift wrap, special packing?' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 5, color: 'var(--text-secondary)' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]} onChange={e => set(f.key, e.target.value)} style={inputStyle}
                        onFocus={e => e.target.style.borderColor='var(--primary)'} onBlur={e => e.target.style.borderColor='#f3f4f6'} />
                    </div>
                  ))}
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#166534' }}>
                    🚚 <strong>Courier delivery</strong> across India. Tracking info sent after dispatch (2–3 business days).
                  </div>
                  {status === 'error' && <div style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 10, padding: 12, marginBottom: 14, textAlign: 'center', fontSize: '0.85rem' }}>❌ Something went wrong. DM us @Pheonix._.gifts</div>}
                  <button onClick={handleOrder} className="btn btn-primary" style={{ width: '100%', padding: '14px', opacity: status === 'sending' ? 0.7 : 1 }} disabled={status === 'sending'}>
                    {status === 'sending' ? '⏳ Placing...' : '✅ Place Order'}
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
