'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, ArrowRight, CheckCircle2, Truck, ShieldCheck, MessageCircle, Gift, User, X, Share2, Package, LogIn, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import CheckoutModal from '../components/CheckoutModal';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import WhyUs from '../components/WhyUs';

import ProductCustomizationModal from '../components/ProductCustomizationModal';
import MyOrdersModal from '../components/MyOrdersModal';

export interface Product { id: number; title: string; desc: string; price: number; category: string; image: string; rating: number; reviews: number; }
export interface Customization { image: string | null; imageName: string; occasion: string; customText: string; }
export interface CartItem extends Product { cartId: string; qty: number; customization: Customization; }

const defaultProducts: Product[] = [
  { id:1, title:"Classic Polaroids", desc:"Aesthetic high-quality polaroid prints of your best memories.", price:249, category:"Bestseller", image:"/classic_polaroids.png", rating:4.9, reviews:128 },
  { id:2, title:"Polaroids Keychain", desc:"A mini flipbook keychain featuring your favorite photos.", price:199, category:"Accessories", image:"/music_charm.png", rating:4.7, reviews:85 },
  { id:3, title:"Polaroids Spotify", desc:"Combine your favorite song barcode with your best photo.", price:299, category:"Trending", image:"/polaroids_spotify_1777545424535.png", rating:5.0, reviews:210 },
  { id:4, title:"Pencil Art", desc:"Hand-drawn pencil sketches that bring your memories to life.", price:899, category:"Premium", image:"/pencil_art_1777545376466.png", rating:4.8, reviews:64 },
  { id:5, title:"Customized Spiral Album", desc:"A collection of moments in a stunning spiral-bound album.", price:599, category:"Albums", image:"/spiral_album_1777545456061.png", rating:4.9, reviews:142 },
  { id:6, title:"Customized Photo Frame", desc:"Frame your best memories in beautiful, elegant designs.", price:499, category:"Decor", image:"/photo_frame_1777545474415.png", rating:4.8, reviews:92 },
  { id:7, title:"Customized Greeting Card", desc:"Heartfelt, personalized designs made just for your loved ones.", price:149, category:"Cards", image:"/greeting_card_1777545360535.png", rating:4.9, reviews:201 },
  { id:8, title:"Customized Posters & Banners", desc:"Make your celebrations bigger and more memorable.", price:399, category:"Decor", image:"/posters_banners_1777545345633.png", rating:4.7, reviews:54 },
  { id:9, title:"Customized Invitation", desc:"Unique and elegant invites for your special occasions.", price:199, category:"Cards", image:"/custom_invitation_1777545440777.png", rating:4.9, reviews:110 },
];

const trustItems = ['⚡ Fast Dispatch','🎁 100% Customized','🚚 Pan-India Delivery','⭐ 4.9 Rated','🔒 Secure Orders','💌 2000+ Happy Customers','🎨 Artisan Crafted','📦 Safe Packaging'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState<string|null>(null);
  const [filter, setFilter] = useState('All');
  const [loginStep, setLoginStep] = useState<'login' | 'signup' | 'referral' | 'success'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [orderNowCart, setOrderNowCart] = useState<CartItem[]>([]);

  useEffect(() => { 
    setMounted(true); 
    if (localStorage.getItem('pheonix_user')) setIsLoggedIn(true);
    
    // Dynamically fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((p: any) => ({
            id: p._id || p.id,
            title: p.name || p.title,
            desc: p.description || p.desc,
            price: p.price,
            category: p.category,
            image: (p.images && p.images[0]) || p.image || '/classic_polaroids.png',
            rating: p.rating || 4.9,
            reviews: p.reviews || 128
          }));
          setProducts(mapped);
        }
      }).catch(err => console.log('Products dynamic fetch error', err));
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    if (!loginForm.email || !loginForm.password) return setLoginError('Please enter both email and password.');
    if (!loginForm.email.includes('@') || !loginForm.email.includes('.')) return setLoginError('Please enter a valid email address.');
    if (loginForm.password.length < 6) return setLoginError('Password must be at least 6 characters.');

    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 800));

    const accountsStr = localStorage.getItem('pheonix_accounts');
    const accounts = accountsStr ? JSON.parse(accountsStr) : [];
    const user = accounts.find((a: any) => a.email === loginForm.email);

    if (!user) {
      setIsLoggingIn(false);
      return setLoginError('No account found with this email. Please sign up first.');
    }
    if (user.password !== loginForm.password) {
      setIsLoggingIn(false);
      return setLoginError('Incorrect password. Please try again.');
    }

    setIsLoggingIn(false);
    localStorage.setItem('pheonix_user', loginForm.email);
    localStorage.setItem('pheonix_user_name', user.name || 'User');
    setIsLoggedIn(true);
    setLoginStep('success');
    setLoginForm({email:'', password:''});
    setLoginError('');
    setTimeout(() => { setLoginOpen(false); setLoginStep('login'); }, 1800);
    setToast(`Welcome back, ${user.name || 'User'}! 🎉`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignup = async () => {
    setLoginError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password) return setLoginError('Please fill all fields.');
    if (!signupForm.email.includes('@') || !signupForm.email.includes('.')) return setLoginError('Please enter a valid email address.');
    if (signupForm.password.length < 6) return setLoginError('Password must be at least 6 characters.');

    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 800));

    const accountsStr = localStorage.getItem('pheonix_accounts');
    const accounts = accountsStr ? JSON.parse(accountsStr) : [];
    if (accounts.some((a: any) => a.email === signupForm.email)) {
      setIsLoggingIn(false);
      return setLoginError('An account with this email already exists. Try signing in.');
    }

    const newUser = { name: signupForm.name, email: signupForm.email, password: signupForm.password };
    accounts.push(newUser);
    localStorage.setItem('pheonix_accounts', JSON.stringify(accounts));

    setIsLoggingIn(false);
    localStorage.setItem('pheonix_user', signupForm.email);
    localStorage.setItem('pheonix_user_name', signupForm.name);
    setIsLoggedIn(true);
    setLoginStep('success');
    setSignupForm({name:'', email:'', password:''});
    setLoginError('');
    setTimeout(() => { setLoginOpen(false); setLoginStep('login'); }, 1800);
    setToast(`Welcome, ${signupForm.name}! Account created 🎉`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('pheonix_user');
    localStorage.removeItem('pheonix_user_name');
    setIsLoggedIn(false);
    setToast('Successfully signed out.');
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (p: Product) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      setToast("Please sign in first to add items to your cart.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setCustomizingProduct(p);
  };

  const handleConfirmCustomization = (product: Product, customization: Customization) => {
    setCart(prev => {
      const ex = prev.find(i => 
        i.id === product.id && 
        i.customization.occasion === customization.occasion && 
        i.customization.customText === customization.customText &&
        i.customization.imageName === customization.imageName
      );
      if (ex) {
        return prev.map(i => i.cartId === ex.cartId ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, { ...product, cartId: Math.random().toString(36).substr(2, 9), qty: 1, customization }];
    });
    setToast(`${product.title} added to cart! 🛒`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOrderNow = (product: Product, customization: Customization) => {
    // Build a single-item cart for direct checkout
    const singleItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
      qty: 1,
      customization,
    };
    setOrderNowCart([singleItem]);
    setCheckoutOpen(true);
  };

  const updateQty = (cartId: string, change: number) =>
    setCart(prev => prev.map(i => i.cartId===cartId ? {...i,qty:Math.max(1,i.qty+change)} : i));

  const removeFromCart = (cartId: string) => setCart(prev => prev.filter(i => i.cartId!==cartId));

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const CATEGORIES = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter==='All' ? products : products.filter(p=>p.category===filter);

  if (!mounted) return null;

  return (
    <div style={{overflowX:'hidden'}}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-60,x:'-50%'}} animate={{opacity:1,y:20,x:'-50%'}} exit={{opacity:0,y:-60,x:'-50%'}}
            style={{position:'fixed',top:0,left:'50%',zIndex:99999,background:'#1f2937',color:'white',padding:'12px 24px',borderRadius:'var(--radius-full)',display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 30px rgba(0,0,0,0.2)',fontSize:'0.95rem',fontWeight:600}}>
            <CheckCircle2 size={18} color="#10b981"/> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar cartCount={cartCount} isLoggedIn={isLoggedIn} onCartOpen={()=>setCartOpen(true)} onLoginOpen={()=>{setLoginOpen(true);setLoginStep('login');setLoginError('');setLoginForm({email:'',password:''});}} onOrdersOpen={()=>setOrdersOpen(true)} onLogout={handleLogout}/>

      {/* Cart */}
      <CartDrawer cart={cart} isOpen={cartOpen} onClose={()=>setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeFromCart}
        onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true);}}/>

      {/* Checkout */}
      <CheckoutModal 
        cart={orderNowCart.length > 0 ? orderNowCart : cart} 
        isOpen={checkoutOpen} 
        onClose={()=>{setCheckoutOpen(false); if(orderNowCart.length>0){setOrderNowCart([]);}else{setCart([]);}}} 
      />

      {/* My Orders */}
      <MyOrdersModal isOpen={ordersOpen} onClose={()=>setOrdersOpen(false)} />

      {/* Customization Modal */}
      <ProductCustomizationModal 
        product={customizingProduct} 
        isOpen={!!customizingProduct} 
        onClose={() => setCustomizingProduct(null)} 
        onConfirm={handleConfirmCustomization}
        onOrderNow={handleOrderNow}
      />

      {/* HERO */}
      <section id="home" style={{minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:90,background:'linear-gradient(145deg,#fff5f7 0%,#fdf2f8 50%,#f0f4ff 100%)',position:'relative',overflow:'hidden'}}>
        {/* BG Blobs */}
        <div style={{position:'absolute',top:'-10%',right:'-5%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(244,63,94,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-10%',left:'-5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center',position:'relative',zIndex:1}} id="hero-grid">
          {/* Left */}
          <motion.div initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}} className="hero-text-content">
            <motion.div className="highlight-chip" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
              <Star size={14} fill="var(--gold)" color="var(--gold)"/> Top Rated Gift Shop 2026
            </motion.div>
            <motion.h1 className="heading-xl serif" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.8}} style={{margin:'20px 0 24px',lineHeight:1.08}}>
              Memories,<br/>Crafted into<br/><span className="text-gradient">Art</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.45}} style={{fontSize:'1.15rem',color:'var(--text-secondary)',lineHeight:1.7,maxWidth:460,marginBottom:36}}>
              Every relationship is unique. Celebrate yours with fully personalized, handcrafted gifts delivered across India.
            </motion.p>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}} style={{display:'flex',gap:16,flexWrap:'wrap'}} className="hero-buttons">
              <a href="#collections" className="btn btn-primary" style={{padding:'16px 36px'}}>Shop Now <ArrowRight size={18}/></a>
              <a href="#how-it-works" className="btn btn-secondary" style={{padding:'16px 32px'}}>How It Works</a>
            </motion.div>
            {/* Mini Trust */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} style={{display:'flex',gap:20,marginTop:36,flexWrap:'wrap'}}>
              {[['🎁','Handcrafted'],['🚚','Fast Delivery'],['⭐','4.9 Rating']].map(([ic,lb])=>(
                <div key={lb} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.85rem',color:'var(--text-secondary)',fontWeight:600}}>
                  <span>{ic}</span>{lb}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Image Grid */}
          <motion.div initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} transition={{duration:0.9,ease:[0.16,1,0.3,1],delay:0.2}} style={{position:'relative',height:580}} className="hero-image-col">
            {/* Main Image */}
            <motion.div animate={{y:[0,-16,0]}} transition={{repeat:Infinity,duration:5.5,ease:'easeInOut'}}
              style={{position:'absolute',top:0,right:0,width:'72%',height:'75%',borderRadius:32,overflow:'hidden',boxShadow:'0 30px 80px rgba(244,63,94,0.2)'}}>
              <Image src="/classic_polaroids.png" alt="Classic Polaroids" fill sizes="50vw" style={{objectFit:'cover'}} priority/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.4) 100%)'}}/>
              <div style={{position:'absolute',bottom:20,left:20,color:'white'}}>
                <div style={{fontWeight:800,fontSize:'1rem'}}>Classic Polaroids</div>
                <div style={{fontSize:'0.8rem',opacity:0.8}}>Starting ₹249</div>
              </div>
            </motion.div>
            {/* Secondary */}
            <motion.div animate={{y:[0,14,0]}} transition={{repeat:Infinity,duration:4.5,ease:'easeInOut',delay:1}}
              style={{position:'absolute',bottom:0,left:0,width:'56%',height:'55%',borderRadius:24,overflow:'hidden',boxShadow:'0 20px 50px rgba(139,92,246,0.2)'}}>
              <Image src="/polaroids_spotify_1777545424535.png" alt="Spotify" fill sizes="30vw" style={{objectFit:'cover'}}/>
            </motion.div>
            {/* Floating badge */}
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.9,type:'spring',stiffness:200}}
              style={{position:'absolute',top:'38%',left:'20%',background:'white',borderRadius:16,padding:'12px 16px',boxShadow:'0 10px 30px rgba(0,0,0,0.12)',zIndex:10}}>
              <div style={{fontSize:'0.75rem',color:'var(--text-light)',marginBottom:2}}>Happy Customers</div>
              <div style={{fontWeight:900,fontSize:'1.2rem',color:'var(--primary-dark)'}}>2,000+ 🎉</div>
            </motion.div>
          </motion.div>
        </div>
        <style>{`@media(max-width:768px){#hero-grid{grid-template-columns:1fr!important; text-align:center;} .hero-text-content{display:flex; flex-direction:column; align-items:center;} .hero-buttons{justify-content:center;} .hero-image-col{display:none!important;}}`}</style>
      </section>

      {/* Trust Marquee */}
      <div style={{background:'linear-gradient(135deg,var(--primary),var(--primary-dark))',padding:'16px 0',overflow:'hidden'}}>
        <div className="marquee-track" style={{display:'flex',gap:48,animation:'marquee 22s linear infinite',width:'max-content'}}>
          {[...trustItems,...trustItems].map((t,i)=>(
            <span key={i} style={{color:'white',fontWeight:700,fontSize:'0.9rem',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:8}}>{t}</span>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section id="collections" className="section" style={{background:'white'}}>
        <div className="container">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:48}}>
            <div className="section-tag" style={{justifyContent:'center'}}>Our Collection</div>
            <h2 className="heading-lg serif">Trending <span className="text-gradient">Gifts</span></h2>
            <p style={{color:'var(--text-secondary)',fontSize:'1.05rem',maxWidth:480,margin:'16px auto 0'}}>The most loved personalized products this season.</p>
          </motion.div>

          {/* Filter Tabs */}
          <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginBottom:48}}>
            {CATEGORIES.map(c=>(
              <button key={c} className={`filter-btn${filter===c?' active':''}`} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>

          <motion.div layout style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:28}}>
            <AnimatePresence>
              {filtered.map((p,i)=>(
                <motion.div key={p.id} layout initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{duration:0.4}}>
                  <ProductCard product={p} onAdd={addToCart} index={i}/>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks/>

      {/* Testimonials */}
      <Testimonials/>

      {/* Why Us */}
      <WhyUs/>

      {/* Instagram CTA */}
      <section id="contact" className="section" style={{background:'linear-gradient(135deg,#fff1f2,#f5f3ff)',textAlign:'center'}}>
        <div className="container">
          <motion.div initial={{opacity:0,scale:0.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} className="glass" style={{maxWidth:700,margin:'0 auto',padding:'60px 40px',borderRadius:40}}>
            <motion.div animate={{rotate:[0,10,-10,0]}} transition={{repeat:Infinity,duration:3,ease:'easeInOut'}} style={{fontSize:'3.5rem',marginBottom:20}}>🎁</motion.div>
            <h2 className="heading-md serif" style={{marginBottom:16}}>Join the Pheonix Family</h2>
            <p style={{color:'var(--text-secondary)',fontSize:'1.05rem',marginBottom:28,lineHeight:1.7}}>
              Follow us on Instagram for new designs, behind-the-scenes crafting, and exclusive offers!
            </p>
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:32}}>
              {['#gifts','#giftshop','#handcrafted','#artgallery','#personalized'].map(t=>(
                <span key={t} style={{padding:'6px 16px',background:'white',borderRadius:'var(--radius-full)',fontWeight:600,fontSize:'0.85rem',boxShadow:'var(--shadow-sm)'}}>{t}</span>
              ))}
            </div>
            <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
              <button onClick={()=>window.open('https://www.instagram.com/phoenix._.gifts','_blank')} className="btn btn-primary" style={{background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'}}>
                📸 Follow @phoenix._.gifts
              </button>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="btn" style={{background:'#25D366',color:'white'}}>
                <MessageCircle size={18}/> WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <div style={{position:'fixed',inset:0,zIndex:99999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLoginOpen(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}/>
            <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9}} style={{position:'relative',width:'90%',maxWidth:440,background:'white',borderRadius:30,padding:'40px',boxShadow:'0 30px 80px rgba(0,0,0,0.25)'}}>
              <button onClick={()=>setLoginOpen(false)} style={{position:'absolute',top:20,right:20,background:'#f3f4f6',padding:8,borderRadius:'50%',display:'flex'}}><X size={18}/></button>
              {loginStep==='login' ? (
                <>
                  <div style={{textAlign:'center',marginBottom:28}}>
                    <div style={{width:60,height:60,background:'var(--primary-light)',color:'var(--primary)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><LogIn size={28}/></div>
                    <h2 className="serif heading-md">Welcome Back</h2>
                    <p style={{color:'var(--text-secondary)',marginTop:8}}>Login to manage orders & referrals.</p>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {loginError && <div style={{background:'#fee2e2',color:'#ef4444',padding:'10px 14px',borderRadius:10,fontSize:'0.85rem',textAlign:'center'}}>{loginError}</div>}
                    <input type="email" placeholder="Email Address" value={loginForm.email} onChange={e => setLoginForm(p => ({...p, email: e.target.value}))} style={{padding:'14px 16px',borderRadius:14,border:'2px solid #f3f4f6',outline:'none',fontSize:'1rem',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='#f3f4f6'}/>
                    <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm(p => ({...p, password: e.target.value}))} style={{padding:'14px 16px',borderRadius:14,border:'2px solid #f3f4f6',outline:'none',fontSize:'1rem',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='#f3f4f6'}/>
                    
                    <button className="btn btn-primary" style={{width:'100%',padding:'15px',marginTop:4,opacity:isLoggingIn?0.7:1}} disabled={isLoggingIn} onClick={handleLogin}>
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p style={{textAlign:'center',color:'var(--text-secondary)',fontSize:'0.875rem'}}>No account? <span style={{color:'var(--primary)',fontWeight:700,cursor:'pointer'}} onClick={()=>{setLoginStep('signup'); setLoginError('');}}>Sign up</span></p>
                  </div>
                </>
              ) : loginStep === 'signup' ? (
                <>
                  <div style={{textAlign:'center',marginBottom:28}}>
                    <div style={{width:60,height:60,background:'var(--primary-light)',color:'var(--primary)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><UserPlus size={28}/></div>
                    <h2 className="serif heading-md">Create Account</h2>
                    <p style={{color:'var(--text-secondary)',marginTop:8}}>Join us to track orders and earn rewards.</p>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {loginError && <div style={{background:'#fee2e2',color:'#ef4444',padding:'10px 14px',borderRadius:10,fontSize:'0.85rem',textAlign:'center'}}>{loginError}</div>}
                    <input type="text" placeholder="Full Name" value={signupForm.name} onChange={e => setSignupForm(p => ({...p, name: e.target.value}))} style={{padding:'14px 16px',borderRadius:14,border:'2px solid #f3f4f6',outline:'none',fontSize:'1rem',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='#f3f4f6'}/>
                    <input type="email" placeholder="Email Address" value={signupForm.email} onChange={e => setSignupForm(p => ({...p, email: e.target.value}))} style={{padding:'14px 16px',borderRadius:14,border:'2px solid #f3f4f6',outline:'none',fontSize:'1rem',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='#f3f4f6'}/>
                    <input type="password" placeholder="Create Password" value={signupForm.password} onChange={e => setSignupForm(p => ({...p, password: e.target.value}))} style={{padding:'14px 16px',borderRadius:14,border:'2px solid #f3f4f6',outline:'none',fontSize:'1rem',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='var(--primary)'} onBlur={e=>e.target.style.borderColor='#f3f4f6'}/>
                    
                  <button className="btn btn-primary" style={{width:'100%',padding:'15px',marginTop:4,opacity:isLoggingIn?0.7:1}} disabled={isLoggingIn} onClick={handleSignup}>
                    {isLoggingIn ? 'Creating...' : 'Sign Up'}
                  </button>
                  <p style={{textAlign:'center',color:'var(--text-secondary)',fontSize:'0.875rem'}}>Already have an account? <span style={{color:'var(--primary)',fontWeight:700,cursor:'pointer'}} onClick={()=>{setLoginStep('login'); setLoginError('');}}>Sign in</span></p>
                </div>
              </>
            ) : loginStep === 'success' ? (
              <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} style={{textAlign:'center',padding:'20px 0'}}>
                <motion.div
                  initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:300,damping:15}}
                  style={{width:80,height:80,background:'linear-gradient(135deg,#10b981,#059669)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 12px 30px rgba(16,185,129,0.35)'}}
                >
                  <CheckCircle2 size={40} color="white" strokeWidth={2.5}/>
                </motion.div>
                <h2 className="serif heading-md" style={{marginBottom:10}}>You're in! 🎉</h2>
                <p style={{color:'var(--text-secondary)',fontSize:'1rem'}}>
                  Welcome, <strong>{localStorage.getItem('pheonix_user_name') || 'User'}</strong>!<br/>Redirecting you now...
                </p>
                <motion.div style={{height:4,background:'#f3f4f6',borderRadius:99,marginTop:24,overflow:'hidden'}}>
                  <motion.div initial={{width:'0%'}} animate={{width:'100%'}} transition={{duration:1.8,ease:'linear'}} style={{height:'100%',background:'linear-gradient(90deg,#f43f5e,#be123c)',borderRadius:99}}/>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <div style={{textAlign:'center',marginBottom:24}}>
                  <div style={{width:60,height:60,background:'#ecfdf5',color:'#10b981',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Gift size={28}/></div>
                  <h2 className="serif heading-md">Give ₹100, Get ₹100</h2>
                  <p style={{color:'var(--text-secondary)',marginTop:8}}>Share your code. When your friend orders, you both save ₹100!</p>
                </div>
                <div style={{background:'#f8fafc',border:'2px dashed #cbd5e1',padding:'18px 20px',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <span style={{fontWeight:900,letterSpacing:'2px',fontSize:'1.15rem',color:'var(--text-primary)'}}>PHX-GFT-2026</span>
                  <button onClick={()=>{navigator.clipboard.writeText('PHX-GFT-2026');}} style={{color:'var(--primary)',fontWeight:800,background:'var(--primary-light)',padding:'6px 14px',borderRadius:8,fontSize:'0.85rem'}}>
                    <Share2 size={14} style={{display:'inline',marginRight:4}}/>Copy
                  </button>
                </div>
                <a href="whatsapp://send?text=Hey! Check out Pheonix Gifts. Use my code PHX-GFT-2026 for ₹100 off: https://pheonixgifts.in" className="btn" style={{width:'100%',background:'#25D366',color:'white',padding:'15px',display:'flex',justifyContent:'center',gap:8}}>
                  <MessageCircle size={18}/> Share via WhatsApp
                </a>
              </>
            )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919999999999?text=Hi! I'm interested in ordering from Pheonix Gifts." target="_blank" rel="noreferrer" className="whatsapp-float" title="Chat on WhatsApp">
        <svg width={28} height={28} viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .whatsapp-float { position:fixed; bottom:30px; right:30px; z-index:9990; width:58px; height:58px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(37,211,102,0.45); animation:float 3s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .whatsapp-float:hover { transform:scale(1.15)!important; }
        @media(max-width:768px){ .whatsapp-float{bottom:20px;right:16px;width:50px;height:50px;} }
      `}</style>
    </div>
  );
}
