'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, RefreshCw, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import type { CartItem } from '../app/page';

interface LocalOrder {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  phone?: string;
  name?: string;
}

interface ServerOrder {
  id: string;
  status: string;
  placedAt: string;
  total: number;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; border: string; icon: React.ReactNode; label: string; desc: string }> = {
  Processing: {
    bg: '#fefce8', color: '#854d0e', border: '#fde047',
    icon: <Clock size={16} />,
    label: '⏳ Processing',
    desc: 'Your order is being prepared and will be dispatched soon.',
  },
  Shipped: {
    bg: '#eef2ff', color: '#3730a3', border: '#a5b4fc',
    icon: <Truck size={16} />,
    label: '🚚 Shipped',
    desc: 'Your order is on the way! Expected delivery in 2–4 days.',
  },
  Delivered: {
    bg: '#f0fdf4', color: '#166534', border: '#86efac',
    icon: <CheckCircle2 size={16} />,
    label: '✅ Delivered',
    desc: 'Your order has been delivered. Enjoy your gift! 🎁',
  },
};

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyOrdersModal({ isOpen, onClose }: MyOrdersModalProps) {
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadOrders = () => {
    const saved = localStorage.getItem('pheonix_orders');
    if (saved) {
      try {
        const parsed: LocalOrder[] = JSON.parse(saved).reverse();
        setOrders(parsed);
        return parsed;
      } catch {}
    }
    return [];
  };

  const fetchLiveStatuses = async (localOrders: LocalOrder[]) => {
    if (localOrders.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        const serverOrders: ServerOrder[] = data.orders;
        const statusMap: Record<string, string> = {};
        localOrders.forEach(lo => {
          // Match by order ID (exact match with server ID)
          const match = serverOrders.find(so => so.id === lo.id);
          if (match) statusMap[lo.id] = match.status;
        });
        setLiveStatuses(statusMap);
      }
    } catch { /* use local status as fallback */ }
    finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    if (isOpen) {
      const loaded = loadOrders();
      fetchLiveStatuses(loaded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleRefresh = () => {
    const loaded = loadOrders();
    fetchLiveStatuses(loaded);
  };

  const getStatus = (order: LocalOrder) => liveStatuses[order.id] || order.status || 'Processing';

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{ position: 'relative', width: '100%', maxWidth: 620, background: '#f8fafc', borderRadius: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.3)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ background: 'white', padding: '22px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'var(--primary-light)', padding: 10, borderRadius: 12, color: 'var(--primary)' }}><Package size={22} /></div>
                <div>
                  <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>My Orders</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>
                    {lastRefreshed ? `Live status · Updated ${lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Track your recent purchases'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  style={{ background: 'var(--primary-light)', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <motion.div animate={{ rotate: loading ? 360 : 0 }} transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: 'linear' }}>
                    <RefreshCw size={14} />
                  </motion.div>
                  {loading ? 'Updating...' : 'Refresh'}
                </button>
                <button onClick={onClose} style={{ background: '#f1f5f9', borderRadius: '50%', padding: 8, color: 'var(--text-secondary)', display: 'flex', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '70px 20px' }}>
                  <Package size={52} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: 8 }}>No orders yet</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {orders.map((order, idx) => {
                    const status = getStatus(order);
                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Processing;
                    const isLive = !!liveStatuses[order.id];

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                        style={{ background: 'white', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
                      >
                        {/* Order Header */}
                        <div style={{ background: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ display: 'flex', gap: 24, fontSize: '0.82rem' }}>
                            <div>
                              <div style={{ color: 'var(--text-light)', marginBottom: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</div>
                              <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'monospace' }}>{order.id}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-light)', marginBottom: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Placed On</div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-light)', marginBottom: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                              <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>₹{order.total}</div>
                            </div>
                          </div>

                          {/* Live Status Badge */}
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                            background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}`,
                          }}>
                            {cfg.icon} {status}
                            {isLive && (
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, opacity: 0.7, marginLeft: 2, animation: 'pulse 2s ease-in-out infinite' }} />
                            )}
                          </div>
                        </div>

                        {/* Status Description */}
                        <div style={{ padding: '12px 20px', background: cfg.bg, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: cfg.color }}>
                          {isLive
                            ? <><span style={{ fontWeight: 700 }}>🔴 Live:</span> {cfg.desc}</>
                            : <><AlertCircle size={14} /> Status may not be updated yet. Click Refresh to get the latest.</>
                          }
                        </div>

                        {/* Items */}
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {order.items.map((item, iIdx) => (
                            <div key={`${item.cartId}-${iIdx}`} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                              <div style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden', position: 'relative', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                                <Image
                                  src={item.customization?.image || item.image || '/classic_polaroids.png'}
                                  alt={item.title}
                                  fill sizes="60px"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                                  Qty: {item.qty} · ₹{item.price * item.qty}
                                  {item.customization?.occasion && ` · ${item.customization.occasion}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Progress Tracker */}
                        <div style={{ padding: '0 20px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
                            {['Processing', 'Shipped', 'Delivered'].map((step, sIdx) => {
                              const stepStatuses = ['Processing', 'Shipped', 'Delivered'];
                              const currentIdx = stepStatuses.indexOf(status);
                              const isDone = sIdx <= currentIdx;
                              const stepCfg = STATUS_CONFIG[step];
                              return (
                                <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                  {sIdx < 2 && (
                                    <div style={{ position: 'absolute', top: 14, left: '50%', width: '100%', height: 3, background: sIdx < currentIdx ? '#f43f5e' : '#e2e8f0', zIndex: 0, transition: 'background 0.4s' }} />
                                  )}
                                  <div style={{
                                    width: 28, height: 28, borderRadius: '50%', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isDone ? '#f43f5e' : '#e2e8f0',
                                    color: isDone ? 'white' : '#9ca3af',
                                    border: sIdx === currentIdx ? '3px solid #be123c' : '3px solid transparent',
                                    transition: 'all 0.4s',
                                    boxSizing: 'border-box',
                                  }}>
                                    {stepCfg.icon}
                                  </div>
                                  <span style={{ fontSize: '0.68rem', marginTop: 6, fontWeight: sIdx === currentIdx ? 800 : 500, color: isDone ? '#be123c' : '#9ca3af' }}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
