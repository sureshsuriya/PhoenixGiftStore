'use client';

const footerLinks = [['Home','#home'],['Shop All','#collections'],['How It Works','#how-it-works'],['About','#about'],['Contact','#contact']];
const footerProducts = ['Classic Polaroids','Polaroids Spotify','Pencil Art','Spiral Album','Photo Frame','Greeting Card','Posters & Banners','Invitation'];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} style={{ display:'block', color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', marginBottom:10, transition:'color 0.2s, transform 0.2s' }}
      onMouseOver={e=>{e.currentTarget.style.color='white'; e.currentTarget.style.transform='translateX(4px)';}}
      onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.45)'; e.currentTarget.style.transform='translateX(0)';}}>
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ background:'#0f0f13', padding:'72px 20px 0', color:'rgba(255,255,255,0.75)' }}>
      <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:40 }}>
        {/* Brand */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#f43f5e,#be123c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🎁</div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700, color:'white' }}>Pheonix Gifts</span>
          </div>
          <p style={{ lineHeight:1.75, fontSize:'0.875rem', color:'rgba(255,255,255,0.45)', maxWidth:210 }}>
            Where memories turn into beautiful creations. Every product is crafted with creativity and care.
          </p>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <a href="https://www.instagram.com/phoenix._.gifts" target="_blank" rel="noreferrer"
              style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(45deg,#f09433,#dc2743,#bc1888)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', color:'white', textDecoration:'none' }}>📸</a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"
              style={{ width:38, height:38, borderRadius:10, background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', textDecoration:'none' }}>💬</a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ color:'white', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:18 }}>Quick Links</h4>
          {footerLinks.map(([l,h]) => <FooterLink key={l} href={h} label={l}/>)}
        </div>

        {/* Products */}
        <div>
          <h4 style={{ color:'white', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:18 }}>Our Products</h4>
          {footerProducts.map(p => <FooterLink key={p} href="#collections" label={p}/>)}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color:'white', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:18 }}>Get In Touch</h4>
          <div style={{ fontSize:'0.875rem', lineHeight:2.2, color:'rgba(255,255,255,0.45)' }}>
            <p>📸 @phoenix._.gifts</p>
            <p>💬 WhatsApp us</p>
            <p>📍 Pan-India Delivery</p>
            <p>⏰ 24/7 Support</p>
          </div>
          <div style={{ marginTop:20, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', borderRadius:14, padding:'16px' }}>
            <p style={{ color:'#f43f5e', fontWeight:800, fontSize:'0.85rem', marginBottom:6 }}>🎁 Referral Program</p>
            <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>Share your code. Give ₹100, Get ₹100 on every referral!</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ marginTop:60, borderTop:'1px solid rgba(255,255,255,0.07)', padding:'22px 0', textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:'0.82rem' }}>
        <div className="container">
          © {new Date().getFullYear()} Pheonix Gifts · Made with ❤️ in India · All rights reserved.
        </div>
      </div>
    </footer>
  );
}
