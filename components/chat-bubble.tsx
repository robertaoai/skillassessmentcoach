'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Bot } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  onStartAssessment: () => void;
}

export function ChatBubble({ message, onStartAssessment }: ChatBubbleProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] mb-4 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] blur-xl opacity-50 animate-pulse" />
          <Bot className="w-8 h-8 text-[#0F0F0F] relative z-10" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[#00FFFF] font-['Orbitron',sans-serif] tracking-wider">
          SESSION INITIALIZED
        </h2>
      </div>

      {/* Chat bubble */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] via-[#8AFF00] to-[#FCEE09] rounded-2xl blur-lg opacity-30 animate-pulse" />
        
        {/* Message container */}
        <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#00FFFF]/50 rounded-2xl p-6 md:p-8 shadow-2xl">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0080] rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0080] rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8AFF00] rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8AFF00] rounded-br-2xl" />
          
          {/* Bot indicator */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#00FFFF]/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#0F0F0F]" />
            </div>
            <div>
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-sm tracking-wider">AI COACH</p>
              <p className="text-gray-500 text-xs font-['Exo',sans-serif]">Neural Assistant</p>
            </div>
          </div>
          
          {/* Message */}
          <p className="text-white text-base md:text-lg leading-relaxed font-['Exo',sans-serif] mb-6">
            {message}
          </p>
          
          {/* Action button */}
          <Button
            onClick={onStartAssessment}
            className="w-full h-12 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 text-[#0F0F0F] font-bold font-['Orbitron',sans-serif] tracking-wider uppercase relative overflow-hidden group transition-all duration-300 shadow-lg shadow-[#8AFF00]/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              START ASSESSMENT
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          </Button>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#8AFF00] animate-pulse" />
          <span className="text-[#8AFF00] text-sm font-['Exo',sans-serif]">CONNECTED</span>
        </div>
        <div className="w-px h-4 bg-gray-700" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FFFF] animate-pulse" />
          <span className="text-[#00FFFF] text-sm font-['Exo',sans-serif]">READY</span>
        </div>
      </div>
    </div>
  );
}
