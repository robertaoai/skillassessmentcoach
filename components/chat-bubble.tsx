'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  onStartAssessment: () => void;
}

export function ChatBubble({ message, onStartAssessment }: ChatBubbleProps) {
  console.log('[ChatBubble] Rendering with message length:', message?.length || 0);

  // Fallback guard
  if (!message) {
    console.warn('[ChatBubble] No message provided, showing fallback');
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-6 border border-yellow-500/50 rounded-xl bg-yellow-500/10">
          <p className="text-yellow-400 font-['Exo',sans-serif]">
            Loading your personalized prompt...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* AI Coach Message Bubble */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] via-[#8AFF00] to-[#FCEE09] rounded-2xl blur-lg opacity-20" />
        
        <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#00FFFF]/50 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#0F0F0F]" />
            </div>
            <div className="flex-1">
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-sm tracking-wider uppercase">
                AI COACH
              </p>
            </div>
          </div>
          
          <p className="text-white text-base md:text-lg leading-relaxed font-['Exo',sans-serif] pl-13">
            {message}
          </p>
        </div>
      </div>

      {/* Start Assessment Button */}
      <div className="flex justify-center">
        <Button
          onClick={onStartAssessment}
          className="h-14 px-8 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 text-[#0F0F0F] font-bold text-lg font-['Orbitron',sans-serif] tracking-wider uppercase relative overflow-hidden group transition-all duration-300 shadow-lg shadow-[#8AFF00]/50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            START ASSESSMENT
            <ArrowRight className="w-5 h-5" />
          </span>
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
}
