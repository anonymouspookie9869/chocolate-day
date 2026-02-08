
import React, { useState } from 'react';
import { Chocolate } from '../types';

interface ChocolateCardProps {
  chocolate: Chocolate;
  onClick: (choco: Chocolate) => void;
}

export const ChocolateCard: React.FC<ChocolateCardProps> = ({ chocolate, onClick }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply 3D tilt on devices with a mouse
    if (window.matchMedia('(hover: hover)').matches) {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const resetRotate = () => {
    setRotate({ x: 0, y: 0 });
    setIsPressed(false);
  };

  return (
    <div 
      onClick={() => onClick(chocolate)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotate}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="group relative flex flex-col items-center reveal transition-all duration-300 active:scale-95"
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl 
                   shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out
                   group-hover:shadow-[0_30px_80px_rgba(212,175,55,0.2)]
                   relative overflow-hidden border border-white/[0.03]
                   ${isPressed ? 'scale-90 shadow-none' : ''}`}
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${chocolate.color}, #050302)`,
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Luminous Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <span className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10 transition-transform duration-700 group-hover:scale-110">
          {chocolate.emoji}
        </span>

        {/* Tactile Inner Border */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-amber-500/10 group-hover:border-amber-500/30 transition-colors duration-700" />
      </div>

      {/* Refined Label */}
      <div className="mt-8 text-center px-2">
        <h3 className="text-amber-100/60 font-serif italic text-lg md:text-2xl transition-all duration-700 group-hover:text-amber-400">
          {chocolate.name}
        </h3>
        <div className="w-8 h-px bg-amber-900 mx-auto mt-2 transition-all duration-700 group-hover:w-full group-hover:bg-amber-600/50"></div>
        <p className="mt-3 text-[9px] tracking-[0.4em] uppercase text-amber-900/60 font-bold group-hover:text-amber-700 transition-colors">
          {chocolate.type}
        </p>
      </div>
    </div>
  );
};
