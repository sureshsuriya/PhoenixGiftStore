'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import type { CartItem } from '../app/page';

interface CartDrawerProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQty: (cartId: string, change: number) => void;
  onRemove: (cartId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout }: CartDrawerProps) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 420,
              background: 'white', height: '100%', display: 'flex', flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.12)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px', borderBottom: '1px solid #f3f4f6',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'linear-gradient(135deg, #fff1f2, white)'
            }}>
              <div>
                <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 2 }}>
                  🛍️ Your Cart
                </h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{count} item{count !== 1 ? 's' : ''} selected</p>
              </div>
              <button onClick={onClose} style={{ background: '#f3f4f6', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-light)' }}>
                  <ShoppingBag size={52} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600 }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Add some beautiful gifts!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div key={item.cartId} layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        style={{
                          display: 'flex', gap: 14, background: '#fafafa',
                          borderRadius: 16, padding: '14px', border: '1px solid #f3f4f6'
                        }}
                      >
                        <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                          <Image src={item.customization?.image || item.image} alt={item.title} fill sizes="72px" style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{item.title}</h4>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.3 }}>
                            <span style={{fontWeight: 600}}>Occasion:</span> {item.customization?.occasion}<br/>
                            <span style={{fontWeight: 600}}>Msg:</span> {item.customization?.customText.substring(0, 20)}{item.customization?.customText.length > 20 ? '...' : ''}
                          </div>
                          <p style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '1rem' }}>₹{item.price}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 'var(--radius-full)', border: '1px solid #e5e7eb' }}>
                              <button onClick={() => onUpdateQty(item.cartId, -1)} style={{ padding: '4px 10px', color: 'var(--text-secondary)' }}><Minus size={13} /></button>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, width: 24, textAlign: 'center' }}>{item.qty}</span>
                              <button onClick={() => onUpdateQty(item.cartId, 1)} style={{ padding: '4px 10px', color: 'var(--primary)' }}><Plus size={13} /></button>
                            </div>
                            <button onClick={() => onRemove(item.cartId)} style={{ color: '#ef4444', padding: 4 }}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid #f3f4f6', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({count} items)</span><span>₹{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: '1.1rem', fontWeight: 800 }}>
                  <span>Total</span><span style={{ color: 'var(--primary-dark)' }}>₹{total}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onCheckout}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                >
                  Checkout <ArrowRight size={18} />
                </motion.button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 10 }}>
                  🔒 Secure & Trusted Checkout
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
