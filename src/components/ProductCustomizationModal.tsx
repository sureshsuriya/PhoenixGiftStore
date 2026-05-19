'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ShoppingCart, Zap } from 'lucide-react';
import type { Product } from '../app/page';

interface Customization {
  image: string | null;
  imageName: string;
  occasion: string;
  customText: string;
}

interface ProductCustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, customization: Customization) => void;
  onOrderNow?: (product: Product, customization: Customization) => void;
}

const OCCASIONS = ['Birthday 🎂','Anniversary 💍',"Valentine's Day 💝",'Wedding 💒','Friendship Day 🤝',"Mother's Day 👩","Father's Day 👨",'Graduation 🎓','Just Because 💫','Other'];

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '2px solid #f3f4f6', outline: 'none', fontSize: '0.95rem',
  fontFamily: 'inherit', boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
};

export default function ProductCustomizationModal({ product, isOpen, onClose, onConfirm, onOrderNow }: ProductCustomizationModalProps) {
  const [form, setForm] = useState<Customization>({ image: null, imageName: '', occasion: '', customText: '' });

  const handleClose = () => {
    onClose();
    setTimeout(() => setForm({ image: null, imageName: '', occasion: '', customText: '' }), 300);
  };

  const validate = (): boolean => {
    if (!form.image) { alert('Please upload a photo for your gift.'); return false; }
    if (!form.occasion) { alert('Please select an occasion.'); return false; }
    if (!form.customText.trim()) { alert('Please enter a custom message.'); return false; }
    return true;
  };

  const handleAddToCart = () => {
    if (!product || !validate()) return;
    onConfirm(product, form);
    handleClose();
  };

  const handleOrderNow = () => {
    if (!product || !validate()) return;
    if (onOrderNow) onOrderNow(product, form);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'white', borderRadius: 28, boxShadow: '0 30px 80px rgba(0,0,0,0.3)', maxHeight: '92vh', overflowY: 'auto' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)', padding: '24px 28px', borderRadius: '28px 28px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Customize {product.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: 4 }}>₹{product.price} · Add your personal touch</p>
              </div>
              <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 8, color: 'white', display: 'flex' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '28px' }}>
              {/* Image Upload */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>📸 Upload Photo *</label>
                <label htmlFor="modal-img-upload" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  border: `2px dashed ${form.image ? '#10b981' : 'var(--primary)'}`,
                  borderRadius: 14, padding: '24px 16px', cursor: 'pointer',
                  background: form.image ? '#f0fdf4' : 'var(--primary-light)', transition: 'all 0.3s'
                }}>
                  {form.image ? (
                    <>
                      <img src={form.image} alt="preview" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>✅ {form.imageName}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Click to change</span>
                    </>
                  ) : (
                    <>
                      <Camera size={32} color="var(--primary)" />
                      <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.9rem' }}>Click to upload</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>JPG, PNG — Max 10MB</span>
                    </>
                  )}
                </label>
                <input id="modal-img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = ev => setForm(p => ({ ...p, image: ev.target?.result as string, imageName: f.name }));
                    reader.readAsDataURL(f);
                  }
                }} />
              </div>

              {/* Occasion */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-secondary)' }}>🎉 Occasion *</label>
                <select value={form.occasion} onChange={e => setForm(p => ({ ...p, occasion: e.target.value }))}
                  style={{ ...inputStyle, background: 'white', color: form.occasion ? 'var(--text-primary)' : '#9ca3af' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#f3f4f6'}>
                  <option value="">Select occasion...</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Custom Text */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-secondary)' }}>✍️ Custom Message *</label>
                <textarea value={form.customText} onChange={e => setForm(p => ({ ...p, customText: e.target.value }))}
                  placeholder="e.g. Happy Birthday Priya! — With love, Rahul"
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
              </div>

              {/* Two Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  style={{
                    padding: '14px 12px', borderRadius: 14, border: '2px solid var(--primary)',
                    background: 'white', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2, boxShadow: '0 8px 24px rgba(244,63,94,0.4)' }} whileTap={{ scale: 0.97 }}
                  onClick={handleOrderNow}
                  style={{
                    padding: '14px 12px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #f43f5e, #be123c)', color: 'white',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(244,63,94,0.3)',
                  }}
                >
                  <Zap size={18} /> Order Now
                </motion.button>
              </div>

              <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--text-light)' }}>
                🔒 Secure checkout · 🚚 Pan-India delivery · ⭐ 4.9 rated
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
