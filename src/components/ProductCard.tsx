'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, Heart, Plus, Eye } from 'lucide-react';
import type { Product } from '../app/page';

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  index: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={12} height={12} fill={s <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: 4 }}>({rating})</span>
    </div>
  );
}

export default function ProductCard({ product, onAdd, index }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="product-image-container">
        <Image
          src={product.image} alt={product.title} fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="product-image"
          style={{ objectFit: 'cover' }}
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)',
          opacity: 0, transition: 'opacity 0.4s'
        }} className="card-overlay" />
        {/* Category Badge */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: 'var(--primary-dark)', margin: 0, fontSize: '0.72rem' }}>
            {product.category}
          </span>
        </div>
        {/* Like Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked(v => !v)}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 38, height: 38, background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Heart size={16} fill={liked ? '#f43f5e' : 'none'} color={liked ? '#f43f5e' : '#9ca3af'} />
        </motion.button>
        {/* Quick View */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', opacity: 0 }} className="quick-view-btn">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)' }}>
            <Eye size={14} /> Quick View
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <StarRating rating={product.rating} />
        <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, margin: '8px 0 6px', lineHeight: 1.3 }}>
          {product.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55, flexGrow: 1, marginBottom: 18 }}>
          {product.desc}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹{product.price}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: 6 }}>{product.reviews} reviews</span>
          </div>
          <AnimatePresence mode="wait">
            {added ? (
              <motion.div key="added"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={{ background: '#10b981', color: 'white', padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}
              >✓ Added!</motion.div>
            ) : (
              <motion.button key="add"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: 'white', padding: '10px 18px', borderRadius: 'var(--radius-full)',
                  display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem',
                  boxShadow: '0 6px 20px -6px rgba(244,63,94,0.5)'
                }}
              >
                <Plus size={16} /> Add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .product-card:hover .card-overlay { opacity: 1 !important; }
        .product-card:hover .quick-view-btn { opacity: 1 !important; }
      `}</style>
    </motion.div>
  );
}
