'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Zap } from 'lucide-react';

interface SessionStartFormProps {
  onSubmit: (email: string, personaHint: string) => void;
  isLoading: boolean;
}

export function SessionStartForm({ onSubmit, isLoading }: SessionStartFormProps) {
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email, personaHint);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FF0080] to-[#00FFFF] mb-4 md:mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF0080] to-[#00FFFF] blur-xl opacity-50 animate-pulse" />
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00] bg-clip-text text-transparent font-['Orbitron',sans-serif] tracking-wider">
          AI SKILLS COACH
        </h1>
        
        <p className="text-[#00FFFF] text-sm md:text-base font-['Exo',sans-serif] tracking-wide">
          NEURAL ASSESSMENT PROTOCOL v2.0
        </p>
        
        <div className="mt-4 md:mt-6 p-4 border border-[#8AFF00]/30 rounded-lg bg-[#1B1B1B]/50 backdrop-blur-sm">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Initialize your personalized AI readiness evaluation. 
            <span className="text-[#FCEE09] font-semibold"> 9 quantum questions</span> to unlock your potential.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-[#00FFFF] font-['Exo',sans-serif] tracking-wide text-sm uppercase flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="neural.link@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-[#1B1B1B] border-[#FF0080]/50 text-white placeholder:text-gray-500 focus:border-[#00FFFF] focus:ring-[#00FFFF]/50 h-12 font-['Exo',sans-serif] transition-all duration-300"
          />
        </div>

        <div className="space-y-2">
          <Label 
            htmlFor="persona" 
            className="text-[#8AFF00] font-['Exo',sans-serif] tracking-wide text-sm uppercase flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Role Identifier (Optional)
          </Label>
          <Input
            id="persona"
            type="text"
            placeholder="e.g., team lead in marketing"
            value={personaHint}
            onChange={(e) => setPersonaHint(e.target.value)}
            disabled={isLoading}
            className="bg-[#1B1B1B] border-[#8AFF00]/50 text-white placeholder:text-gray-500 focus:border-[#FCEE09] focus:ring-[#FCEE09]/50 h-12 font-['Exo',sans-serif] transition-all duration-300"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-[#FF0080] to-[#00FFFF] hover:from-[#FF0080]/80 hover:to-[#00FFFF]/80 text-white font-bold text-lg font-['Orbitron',sans-serif] tracking-wider uppercase relative overflow-hidden group transition-all duration-300 shadow-lg shadow-[#FF0080]/50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                INITIALIZING...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                BEGIN ASSESSMENT
              </>
            )}
          </span>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080] to-[#00FFFF] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
        </Button>
      </form>

      {/* Footer info */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs md:text-sm font-['Exo',sans-serif]">
          Secure • Encrypted • AI-Powered Analysis
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-[#8AFF00] animate-pulse" />
          <span className="text-[#8AFF00] text-xs font-['Exo',sans-serif]">SYSTEM ONLINE</span>
        </div>
      </div>
    </div>
  );
}
