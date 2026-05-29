import React, { useState } from 'react';
import { ShoppingCart, Menu, User, LogOut, Shield, Truck, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/be661e8251bd4a685dcda726669280963e85c443.png';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onAdminClick?: () => void;
  onTrackOrderClick?: () => void;
  isAdmin?: boolean;
}

export function Header({
  cartItemsCount, onCartClick, onLogoClick,
  isAuthenticated, userName, onLoginClick,
  onLogoutClick, onAdminClick, onTrackOrderClick, isAdmin,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const iconBtn = (onClick: () => void, title: string, child: React.ReactNode) => (
    <button onClick={onClick} title={title}
      style={{ background:'none', border:'none', cursor:'pointer', padding:'7px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,79,166,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
    >{child}</button>
  );

  return (
    <React.Fragment>
      <div style={{ height:'3px', background:'linear-gradient(90deg,#7B4FA6 0%,#C9A84C 40%,#7B4FA6 70%,#3BAF7A 100%)' }} />

      <header style={{ background:'#1A1225', borderBottom:'1px solid rgba(201,168,76,0.25)', position:'sticky', top:0, zIndex:50, boxShadow:'0 2px 20px rgba(26,18,37,0.6)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'68px' }}>

            <button onClick={onLogoClick}
              style={{ display:'flex', alignItems:'center', gap:'10px', background:'none', border:'none', cursor:'pointer', padding:'4px', borderRadius:'8px' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <ImageWithFallback src={logo} alt="Tlahtolli Studio Logo" className="w-11 h-11 object-contain" />
              <div style={{ textAlign:'left' }}>
                <span style={{ display:'block', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:'1.1rem', color:'#C9A84C', letterSpacing:'0.05em', lineHeight:1.1 }}>Tlahtolli</span>
                <span style={{ display:'block', fontFamily:'Cinzel,serif', fontWeight:400, fontSize:'0.65rem', color:'#A97CC7', letterSpacing:'0.15em', textTransform:'uppercase' }}>Studio</span>
              </div>
            </button>

            <nav className="hidden md:flex" style={{ alignItems:'center', gap:'2rem' }}>
              {['Productos','Colecciones','Sobre nosotros'].map(label => (
                <span key={label}
                  onClick={() => {}}
                  style={{ fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'0.9rem', color:'#D4B8E8', cursor:'pointer', letterSpacing:'0.03em', padding:'4px 0', borderBottom:'2px solid transparent', transition:'color 0.2s,border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#C9A84C'; e.currentTarget.style.borderBottomColor='#C9A84C'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#D4B8E8'; e.currentTarget.style.borderBottomColor='transparent'; }}
                >{label}</span>
              ))}
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              {isAuthenticated && userName ? (
                <div className="hidden md:flex" style={{ alignItems:'center', gap:'6px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 12px', background:'rgba(123,79,166,0.2)', border:'1px solid rgba(123,79,166,0.4)', borderRadius:'999px' }}>
                    <User size={14} color="#A97CC7" />
                    <span style={{ fontSize:'0.85rem', color:'#D4B8E8', fontWeight:600 }}>{userName}</span>
                  </div>
                  {isAdmin && onAdminClick && iconBtn(onAdminClick, 'Panel admin', <Shield size={18} color="#C9A84C" />)}
                  {onTrackOrderClick && iconBtn(onTrackOrderClick, 'Rastrear pedido', <Truck size={18} color="#A97CC7" />)}
                  {onLogoutClick && iconBtn(onLogoutClick, 'Cerrar sesion', <LogOut size={18} color="#A97CC7" />)}
                </div>
              ) : onLoginClick ? (
                <button onClick={onLoginClick} className="hidden md:flex"
                  style={{ alignItems:'center', gap:'6px', padding:'7px 18px', background:'linear-gradient(135deg,#7B4FA6,#5C3280)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:'8px', color:'#FBF6EE', fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'; }}
                >
                  <User size={15} />
                  Ingresar
                </button>
              ) : null}

              <button onClick={onCartClick} aria-label="Carrito"
                style={{ position:'relative', background:'none', border:'none', cursor:'pointer', padding:'8px', borderRadius:'8px' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(201,168,76,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='none'; }}
              >
                <ShoppingCart size={22} color="#C9A84C" />
                {cartItemsCount > 0 && (
                  <span style={{ position:'absolute', top:'2px', right:'2px', width:'18px', height:'18px', background:'#7B4FA6', border:'2px solid #1A1225', borderRadius:'50%', color:'#FBF6EE', fontSize:'0.65rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background:'none', border:'none', cursor:'pointer', padding:'8px', borderRadius:'8px' }}
              >
                {menuOpen ? <X size={22} color="#C9A84C" /> : <Menu size={22} color="#C9A84C" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div style={{ background:'#231830', borderTop:'1px solid rgba(201,168,76,0.2)', padding:'1rem 1.5rem 1.5rem' }}>
            {['Productos','Colecciones','Sobre nosotros'].map(label => (
              <span key={label} onClick={() => setMenuOpen(false)}
                style={{ display:'block', padding:'10px 0', borderBottom:'1px solid rgba(123,79,166,0.2)', color:'#D4B8E8', fontWeight:600, fontSize:'0.95rem', cursor:'pointer' }}
              >{label}</span>
            ))}
            {!isAuthenticated && onLoginClick && (
              <button onClick={() => { onLoginClick(); setMenuOpen(false); }}
                style={{ marginTop:'1rem', width:'100%', padding:'10px', background:'linear-gradient(135deg,#7B4FA6,#5C3280)', border:'none', borderRadius:'8px', color:'#FBF6EE', fontWeight:700, fontSize:'0.95rem', cursor:'pointer' }}
              >Ingresar</button>
            )}
          </div>
        )}
      </header>
    </React.Fragment>
  );
}
