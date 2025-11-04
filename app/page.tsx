'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { SessionStartForm } from '@/components/session-start-form';
import { ChatBubble } from '@/components/chat-bubble';
import { Loader2 } from 'lucide-react';

interface SessionResponse {
  session_id: string;
  first_prompt: string;
}

export default function Home() {
  const router = useRouter();
  const { sessionId, setSessionId, firstPrompt, setFirstPrompt, isHydrated } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSessionStart = async (email: string, personaHint: string) => {
    console.log('[Home] Starting session with email:', email);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[Home] Sending POST to session/start webhook...');
      const response = await fetch('https://robertcoach.app.n8n.cloud/webhook/session/start', {
        method: 'POST',
        mode: 'cors',
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      console.log('[Home] Session started successfully:', {
        session_id: data.session_id,
        first_prompt_length: data.first_prompt?.length || 0,
      });

      // Update state - this will trigger localStorage sync via useSession hook
      setSessionId(data.session_id);
      setFirstPrompt(data.first_prompt);
      
      console.log('[Home] State updated, form should now be hidden');
    } catch (err) {
      console.error('[Home] Error starting session:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    console.log('[Home] Starting assessment, navigating to /answer/' + sessionId);
    if (sessionId) {
      router.push(`/answer/${sessionId}`);
    } else {
      console.error('[Home] Cannot start assessment: sessionId is null');
      setError('Session ID not found. Please refresh and try again.');
    }
  };

  // Show loading spinner during hydration
  if (!isHydrated) {
    console.log('[Home] Waiting for hydration...');
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00FFFF] animate-spin" />
          <p className="text-gray-400 font-['Exo',sans-serif]">Loading...</p>
        </div>
      </main>
    );
  }

  console.log('[Home] Render state:', {
    sessionId: sessionId ? 'exists' : 'null',
    firstPrompt: firstPrompt ? 'exists' : 'null',
    isLoading,
    error,
  });

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
        {/* Show form only when no session exists */}
        {!sessionId && !isLoading && (
          <SessionStartForm 
            onSubmit={handleSessionStart} 
            isLoading={false}
            error={error}
          />
        )}

        {/* Show loading state during API call */}
        {isLoading && (
          <div className="max-w-md mx-auto text-center">
            <div className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin" />
              <p className="text-[#00FFFF] font-['Exo',sans-serif] text-lg">
                Initializing your AI assessment...
              </p>
            </div>
          </div>
        )}

        {/* Show chat bubble only when session exists and prompt is loaded */}
        {sessionId && firstPrompt && !isLoading && (
          <ChatBubble 
            message={firstPrompt}
            onStartAssessment={handleStartAssessment}
          />
        )}

        {/* Fallback: session exists but no prompt (shouldn't happen) */}
        {sessionId && !firstPrompt && !isLoading && (
          <div className="max-w-md mx-auto text-center">
            <div className="p-8 border border-red-500/50 rounded-xl bg-red-500/10">
              <p className="text-red-400 font-['Exo',sans-serif]">
                Session started but prompt not loaded. Please refresh the page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Glitch effect lines */}
      <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent opacity-50 animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30 animate-pulse" />
    </main>
  );
}
