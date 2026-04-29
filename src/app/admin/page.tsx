'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  MoreVertical,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Box
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '₹45,231', icon: <DollarSign size={20} />, trend: '+12.5%' },
  { label: 'Total Orders', value: '156', icon: <ShoppingBag size={20} />, trend: '+8.2%' },
  { label: 'Active Products', value: '32', icon: <Package size={20} />, trend: '+2' },
  { label: 'Total Customers', value: '1,240', icon: <Users size={20} />, trend: '+54' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #eee', padding: '30px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px' }}>
            <Box size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Admin Panel</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'products', label: 'Products', icon: <Package size={18} /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: activeTab === item.id ? 'var(--primary-dark)' : '#666',
                background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                fontWeight: activeTab === item.id ? '600' : '400',
                width: '100%',
                textAlign: 'left'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>Welcome back, Admin!</h1>
            <p style={{ color: '#666' }}>Here's what's happening with Pheonix Gifts today.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                style={{ padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <Plus size={18} /> Add Product
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass" style={{ padding: '24px', borderRadius: '16px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '10px', borderRadius: '10px' }}>
                  {stat.icon}
                </div>
                <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.85rem' }}>{stat.trend}</span>
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Recent Orders / Product Table */}
        <div className="glass" style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Recent Orders</h2>
            <button style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}>Product</th>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px 8px', color: '#666', fontWeight: '600' }}></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px 8px', fontWeight: '500' }}>#PG-2024-{1000 + item}</td>
                  <td style={{ padding: '16px 8px' }}>Rahul Sharma</td>
                  <td style={{ padding: '16px 8px' }}>Pencil Art Portrait</td>
                  <td style={{ padding: '16px 8px' }}>₹1,499</td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      background: item % 2 === 0 ? 'var(--primary-light)' : '#f3e8ff', 
                      color: item % 2 === 0 ? 'var(--primary)' : 'var(--primary-dark)' 
                    }}>
                      {item % 2 === 0 ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                    <button style={{ color: '#999' }}><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .icon-btn { color: #666; }
        .icon-btn:hover { color: var(--primary); }
      `}</style>
    </div>
  );
}

// Minimal ArrowRight for the View all link since I didn't import it in this file's specific import block (fixed below)
function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
