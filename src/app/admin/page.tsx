'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingCart, DollarSign, Package, LogOut, TrendingUp, Bell, BarChart2, Settings, Eye, CheckCircle, Truck, Clock, Menu, X, Plus } from 'lucide-react';

const CREDS = { user: 'tripletechpheonix@gmail.com', pass: 'Pheonix_Gifts' };

type Order = {
  id: string; name: string; phone: string; email: string;
  address: string; city: string; state: string; pincode: string;
  note: string;
  items: { title: string; qty: number; price: number; customization?: { occasion: string; customText: string; image?: string | null } }[];
  total: number; status: string; placedAt: string;
};

type Product = {
  _id?: string;
  id?: number;
  title?: string;
  name?: string;
  price: number;
  category: string;
  stock?: number;
  isAvailable?: boolean;
};

const statusColors: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  Processing: { bg: '#fef9c3', color: '#854d0e', icon: <Clock size={12} /> },
  Shipped: { bg: '#e0e7ff', color: '#3730a3', icon: <Truck size={12} /> },
  Delivered: { bg: '#dcfce7', color: '#166534', icon: <CheckCircle size={12} /> },
};

const navItems = [
  { label: 'Dashboard', icon: BarChart2 },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Products', icon: Package },
  { label: 'Customers', icon: Users },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Settings', icon: Settings },
];

const defaultProducts = [
  { id:1, title:"Classic Polaroids", price:249, category:"Bestseller", stock: 120 },
  { id:2, title:"Polaroids Keychain", price:199, category:"Accessories", stock: 45 },
  { id:3, title:"Polaroids Spotify", price:299, category:"Trending", stock: 88 },
  { id:4, title:"Pencil Art", price:899, category:"Premium", stock: 15 },
  { id:5, title:"Customized Spiral Album", price:599, category:"Albums", stock: 32 },
  { id:6, title:"Customized Photo Frame", price:499, category:"Decor", stock: 64 },
  { id:7, title:"Customized Greeting Card", price:149, category:"Cards", stock: 200 },
  { id:8, title:"Customized Posters & Banners", price:399, category:"Decor", stock: 40 },
  { id:9, title:"Customized Invitation", price:199, category:"Cards", stock: 150 },
];


export default function AdminDashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuth(true);
      fetchData();
    }
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    handleResize(); // initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    fetchOrders();
    fetchProducts();
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders.reverse());
    } catch { /* silent */ } finally { setLoadingOrders(false); }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setProducts(data.data);
      } else {
        setProducts(defaultProducts as Product[]);
      }
    } catch { 
      setProducts(defaultProducts as Product[]);
    } finally { 
      setLoadingProducts(false); 
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update — change UI immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch {
      // If it fails, refresh to get real state
      fetchOrders();
    }
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === CREDS.user && pass === CREDS.pass) {
      setIsAuth(true);
      localStorage.setItem('adminAuth', 'true');
      fetchData();
    } else {
      setErr('Invalid credentials. Access denied.');
    }
  };

  const logout = () => { setIsAuth(false); localStorage.removeItem('adminAuth'); };

  const closeSidebar = () => setSidebarOpen(false);

  if (!mounted) return null;

  if (!isAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 60% 40%, #3d0020 0%, #1a0010 60%, #000 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} style={{ position: 'absolute', width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, background: 'rgba(244,63,94,0.6)', borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [-20, 20, -20], opacity: [0.3, 1, 0.3] }} transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '16px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '28px', padding: '48px 40px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ fontSize: '3.5rem', marginBottom: '16px', display: 'block' }}>🔥</motion.div>
          <h1 style={{ color: 'white', fontSize: '1.9rem', fontWeight: 900, margin: '0 0 6px', fontFamily: 'Playfair Display, serif', letterSpacing: '-0.5px' }}>Pheonix Gifts</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Portal</p>
        </div>
        <AnimatePresence>{err && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.875rem', textAlign: 'center' }}>{err}</motion.div>}</AnimatePresence>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[{ label: 'Email', val: user, set: setUser, type: 'email', ph: 'Enter your email address' }, { label: 'Password', val: pass, set: setPass, type: showPass ? 'text' : 'password', ph: '••••••••••••' }].map((f, i) => (
            <div key={i}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'white', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = 'rgba(244,63,94,0.7)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}><input type="checkbox" onChange={e => setShowPass(e.target.checked)} style={{ accentColor: '#f43f5e' }} /> Show password</label>
          <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(244,63,94,0.5)' }} whileTap={{ scale: 0.98 }} style={{ marginTop: '8px', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg,#f43f5e,#be123c)', color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', letterSpacing: '0.5px' }}>Enter Dashboard →</motion.button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>🔒 Secure · Private · Triple Tech Phoenix</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f13', color: 'white', fontFamily: 'Outfit, Inter, sans-serif' }}>
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 90 }} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ x: isMobile ? (sidebarOpen ? 0 : -280) : 0 }} 
        transition={{ duration: 0.3, ease: 'easeOut' }} 
        style={{ width: '260px', background: 'linear-gradient(180deg,#1a0010 0%,#0f0007 100%)', borderRight: '1px solid rgba(244,63,94,0.15)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 }}
      >
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(244,63,94,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <motion.div animate={{ rotate: [0,5,-5,0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ fontSize: '2rem', marginBottom: '8px', display: 'inline-block' }}>🔥</motion.div>
            <h2 style={{ margin: '0 0 2px', fontSize: '1.2rem', fontWeight: 800, color: 'white', fontFamily: 'Playfair Display, serif' }}>Pheonix Gifts</h2>
            <span style={{ fontSize: '0.7rem', color: 'rgba(244,63,94,0.8)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Admin Panel</span>
          </div>
          {isMobile && (
            <button onClick={closeSidebar} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}>
              <X size={20} />
            </button>
          )}
        </div>
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
            return (
            <motion.button key={i} whileHover={{ x: 4 }} onClick={() => { setActiveNav(i); if (isMobile) closeSidebar(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: activeNav === i ? 'linear-gradient(135deg,rgba(244,63,94,0.2),rgba(190,18,60,0.1))' : 'transparent', color: activeNav === i ? '#f43f5e' : 'rgba(255,255,255,0.5)', fontWeight: activeNav === i ? 700 : 500, fontSize: '0.9rem', textAlign: 'left', borderLeft: activeNav === i ? '3px solid #f43f5e' : '3px solid transparent', transition: 'all 0.2s' }}>
              <item.icon size={18} />{item.label}
              {i === 1 && activeOrders > 0 && <span style={{ marginLeft: 'auto', background: '#f43f5e', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>{activeOrders}</span>}
            </motion.button>
          )})}
        </nav>
        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(244,63,94,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#be123c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>P</div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pheonix Gifts</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@pheonix.in</div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ marginLeft: isMobile ? '0' : '260px', flex: 1, display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : 'calc(100% - 260px)', transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <div style={{ background: 'rgba(15,15,19,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{navItems[activeNav].label}</h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Welcome back, Pheonix Gifts 👋</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button whileHover={{ scale: 1.05 }} style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
              <Bell size={18} /><span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#f43f5e', borderRadius: '50%', border: '2px solid #0f0f13' }} />
            </motion.button>
            {!isMobile && <div style={{ background: 'linear-gradient(135deg,#f43f5e,#be123c)', borderRadius: '12px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>🔥 Live</div>}
          </div>
        </div>

        <div style={{ padding: isMobile ? '20px 16px' : '32px', overflowY: 'auto' }}>
          {/* Dashboard Stats */}
          {(activeNav === 0 || activeNav === 4) && (() => {
            const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
            const uniqueCustomers = new Set(orders.map(o => o.phone)).size;
            const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
            const realStats = [
              { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: '#f43f5e', bg: '#fff1f2' },
              { title: 'Total Orders', value: String(orders.length), icon: ShoppingCart, color: '#3b82f6', bg: '#eff6ff' },
              { title: 'Unique Customers', value: String(uniqueCustomers), icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
              { title: 'Active / Pending', value: String(activeOrders), icon: Package, color: '#f59e0b', bg: '#fffbeb' },
            ];
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px', marginBottom: '32px' }}>
                {realStats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', cursor: 'default' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><s.icon size={22} color={s.color} /></div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{s.title}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{s.value}</div>
                  </motion.div>
                ))}
              </div>
            );
          })()}

          {/* Orders Table */}
          {(activeNav === 0 || activeNav === 1) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: isMobile ? '20px 16px' : '28px' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.1rem' }}>Live Orders</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} received · courier-based delivery</p>
              </div>
              <button onClick={fetchOrders} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} /> Refresh
              </button>
            </div>

            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>No orders yet. Orders will appear here once customers place them.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -16px', padding: '0 16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Order ID','Customer','Items','City','Amount','Status','Date'].map((h, i) => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: i === 4 ? 'right' : 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px', fontWeight: 700, color: '#f43f5e', whiteSpace: 'nowrap' }}>{o.id}</td>
                        <td style={{ padding: '16px', color: 'white', fontWeight: 600 }}>
                          <div>{o.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{o.email || o.phone}</div>
                        </td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                          {o.items.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: idx !== o.items.length - 1 ? '8px' : 0 }}>
                              <span style={{ fontWeight: 600, color: '#f43f5e' }}>{item.qty}x</span> {item.title}
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{o.city}</td>
                        <td style={{ padding: '16px', fontWeight: 800, color: 'white', textAlign: 'right', whiteSpace: 'nowrap' }}>₹{o.total}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '20px',
                              border: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              outline: 'none',
                              background: statusColors[o.status]?.bg || '#f3f4f6',
                              color: statusColors[o.status]?.color || '#374151',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              paddingRight: '28px',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 8px center',
                            }}
                          >
                            <option value="Processing">⏳ Processing</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(o.placedAt).toLocaleDateString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          )}

          {/* Products View */}
          {activeNav === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: isMobile ? '20px 16px' : '28px' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.1rem' }}>Product Catalog</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Manage your active products and inventory</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={fetchProducts} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Refresh
                  </button>
                  <button style={{ padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg,#f43f5e,#be123c)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>
              
              {loadingProducts ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>Loading products...</div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -16px', padding: '0 16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Product Name','Category','Base Price','Stock','Status','Actions'].map((h, i) => (
                          <th key={h} style={{ padding: '14px 16px', textAlign: i === 2 ? 'right' : 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <motion.tr key={p._id || p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '16px', color: 'white', fontWeight: 700 }}>{p.title || p.name}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{p.category}</td>
                          <td style={{ padding: '16px', fontWeight: 800, color: '#f43f5e', textAlign: 'right' }}>₹{p.price}</td>
                          <td style={{ padding: '16px', color: 'white' }}>{p.stock !== undefined ? p.stock : 'Unlimited'} units</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: (p.isAvailable === false) ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: (p.isAvailable === false) ? '#ef4444' : '#10b981' }}>
                              {(p.isAvailable === false) ? 'Out of Stock' : 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>Edit</button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Customers View */}
          {activeNav === 3 && (() => {
            const customersMap = new Map();
            orders.forEach(o => {
              if (!customersMap.has(o.phone)) {
                customersMap.set(o.phone, { name: o.name, email: o.email, phone: o.phone, city: o.city, totalSpent: 0, orderCount: 0, lastOrder: o.placedAt });
              }
              const c = customersMap.get(o.phone);
              c.totalSpent += o.total;
              c.orderCount += 1;
              if (new Date(o.placedAt) > new Date(c.lastOrder)) c.lastOrder = o.placedAt;
            });
            const customersList = Array.from(customersMap.values()).sort((a,b) => b.totalSpent - a.totalSpent);
            
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: isMobile ? '20px 16px' : '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.1rem' }}>Customer Database</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{customersList.length} total unique customers</p>
                  </div>
                </div>
                {customersList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)' }}>No customers yet.</div>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -16px', padding: '0 16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '650px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          {['Name','Contact','City','Total Orders','Total Spent','Last Order'].map((h, i) => (
                            <th key={h} style={{ padding: '14px 16px', textAlign: i === 4 ? 'right' : 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customersList.map((c: any, i) => (
                          <motion.tr key={c.phone} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '16px', color: 'white', fontWeight: 700, whiteSpace: 'nowrap' }}>{c.name}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>
                              <div style={{ color: 'white', fontWeight: 600 }}>{c.phone}</div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{c.email || 'No email'}</div>
                            </td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{c.city}</td>
                            <td style={{ padding: '16px', color: 'white', fontWeight: 700 }}>{c.orderCount}</td>
                            <td style={{ padding: '16px', fontWeight: 800, color: '#10b981', textAlign: 'right' }}>₹{c.totalSpent}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(c.lastOrder).toLocaleDateString('en-IN')}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* Settings View */}
          {activeNav === 5 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: isMobile ? '20px 16px' : '32px', maxWidth: 800 }}>
              <h3 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: '1.2rem' }}>Store Settings</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>Store Name</label>
                  <input type="text" defaultValue="Pheonix Gifts" style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#f43f5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>Admin Contact Email</label>
                  <input type="email" defaultValue="tripletechpheonix@gmail.com" style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#f43f5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 16px', color: 'white', fontSize: '1.05rem', fontWeight: 700 }}>Notifications</h4>
                {[
                  { label: 'Email me when a new order is placed', checked: true },
                  { label: 'Send daily sales summary report', checked: false },
                  { label: 'Notify on low product stock', checked: true },
                ].map((n, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '14px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={n.checked} style={{ accentColor: '#f43f5e', width: '18px', height: '18px' }} />
                    {n.label}
                  </label>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <button style={{ padding: '14px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#f43f5e,#be123c)', color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: isMobile ? '100%' : 'auto' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>Save Changes</button>
              </div>
            </motion.div>
          )}

          {/* Fallback for completely unknown tabs */}
          {activeNav > 5 && (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>Invalid Tab</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', paddingBottom: '20px' }}>
            Built by <span style={{ color: '#f43f5e', fontWeight: 700 }}>Triple Tech Phoenix</span><br/>
            Pheonix Gifts Admin v2.0 · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
