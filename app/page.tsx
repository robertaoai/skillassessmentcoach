'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionStartForm } from '@/components/session-start-form';
import { ChatBubble } from '@/components/chat-bubble';

interface SessionResponse {
  session_id: string;
  first_prompt: string;
}

export default function Home() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSessionStart = async (email: string, personaHint: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://robertcoach.app.n8n.cloud/webhook/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          persona_hint: personaHint,
          metadata: {
            source: 'web',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data: SessionResponse = await response.json();
      setSessionData(data);
      
      // Save session ID to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('session_id', data.session_id);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    if (sessionData?.session_id) {
      router.push(`/answer/${sessionData.session_id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF0080] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FFFF] rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#8AFF00 1px, transparent 1px),
            linear-gradient(90deg, #8AFF00 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {!sessionData ? (
          <SessionStartForm onSubmit={handleSessionStart} isLoading={isLoading} />
        ) : (
          <ChatBubble 
            message={sessionData.first_prompt}
            onStartAssessment={handleStartAssessment}
          />
        )}
      </div>

      {/* Glitch effect lines */}
      <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent opacity-50 animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30 animate-pulse" />
    </main>
  );
}
