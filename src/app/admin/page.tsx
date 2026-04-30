'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingCart, DollarSign, Package, 
  Settings, LogOut, TrendingUp, Menu, Bell
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid credentials. Hint: admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  if (!isMounted) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary-light), var(--bg-primary))' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: '400px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="serif" style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>Admin Login</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Access the advanced dashboard</p>
          </div>
          
          {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Username</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '16px' }}>Login</button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard View
  const stats = [
    { title: 'Total Revenue', value: '₹1,24,500', icon: DollarSign, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Active Orders', value: '45', icon: ShoppingCart, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Total Customers', value: '1,204', icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Products', value: '32', icon: Package, color: '#f59e0b', bg: '#fffbeb' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Rahul Sharma', product: 'Classic Polaroids', amount: '₹249', status: 'Processing' },
    { id: '#ORD-002', customer: 'Priya Patel', product: 'Pencil Art', amount: '₹899', status: 'Shipped' },
    { id: '#ORD-003', customer: 'Amit Kumar', product: 'Customized Photo Frame', amount: '₹499', status: 'Delivered' },
    { id: '#ORD-004', customer: 'Neha Singh', product: 'Polaroids Keychain', amount: '₹199', status: 'Processing' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1f2937' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Pheonix Gifts</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</span>
        </div>
        <nav style={{ padding: '24px 12px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Dashboard', 'Orders', 'Products', 'Customers', 'Analytics'].map((item, i) => (
            <button key={i} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: i === 0 ? 'var(--primary-light)' : 'transparent', color: i === 0 ? 'var(--primary-dark)' : 'var(--text-secondary)', fontWeight: 600, textAlign: 'left' }}>
              {i === 0 && <TrendingUp size={20} />}
              {i === 1 && <ShoppingCart size={20} />}
              {i === 2 && <Package size={20} />}
              {i === 3 && <Users size={20} />}
              {i === 4 && <Settings size={20} />}
              {item}
            </button>
          ))}
        </nav>
        <div style={{ padding: '24px' }}>
          <button onClick={handleLogout} style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#ef4444', background: 'transparent', fontWeight: 600, width: '100%', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fee2e2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ background: 'white', padding: '20px 32px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}><Menu size={24} /></button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Overview</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', color: 'var(--text-secondary)' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin User</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>admin@pheonix.gifts</div>
              </div>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: '32px', flexGrow: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> +12.5% from last month
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Recent Orders</h2>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View All</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Order ID</th>
                    <th style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Customer</th>
                    <th style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Product</th>
                    <th style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Amount</th>
                    <th style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600 }}>{order.id}</td>
                      <td style={{ padding: '16px 8px' }}>{order.customer}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{order.product}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 600 }}>{order.amount}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                          background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Shipped' ? '#e0e7ff' : '#fef9c3',
                          color: order.status === 'Delivered' ? '#166534' : order.status === 'Shipped' ? '#3730a3' : '#854d0e'
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
