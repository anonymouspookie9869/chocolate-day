
import React, { useState } from 'react';
import { generateLoveNote } from '../services/geminiService';
import { audio } from '../audio';

export const PoemGenerator: React.FC = () => {
  const [note, setNote] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Trigger tactile audio feedback
    audio.playSonar();
    
    try {
      const result = await generateLoveNote();
      if (result) {
        setNote(result);
        // Play revealing sound effect
        audio.playUnveil();
      }
    } catch (error) {
      console.error("Failed to generate AI note:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      {note && (
        <div className="p-6 glass rounded-2xl border border-amber-500/20 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-lg md:text-xl font-romantic text-amber-200 text-center italic leading-relaxed">
            "{note}"
          </p>
        </div>
      )}
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="group relative px-8 py-3 bg-amber-500/5 border border-amber-500/10 text-amber-600 rounded-full hover:bg-amber-500 hover:text-black transition-all font-bold tracking-[0.3em] uppercase text-[9px] disabled:opacity-50 active:scale-95 overflow-hidden"
      >
        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10"></div>
        <span className="relative">
          {isGenerating ? 'Whispering to the stars...' : 'Request AI Love Note'}
        </span>
      </button>
    </div>
  );
};
