'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { SummaryCard } from '@/components/summary-card';
import { completeSession } from '@/lib/api';
import { ArrowLeft, Download, Copy, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CompletionData {
  status: string;
  message: string;
  readiness_score: number;
  roi_estimate: {
    annual_hours_saved: number;
    estimated_dollars: number;
    team_efficiency_gain: string;
  };
  summary_html: string;
}

export default function CompletePage() {
  const params = useParams();
  const router = useRouter();
  const urlSessionId = params.sessionId as string;
  
  const { sessionId, isHydrated } = useSession();
  
  const [optInEmail, setOptInEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate session on mount
  useEffect(() => {
    if (!isHydrated) return;

    console.log('[CompletePage] Validating session...', {
      urlSessionId,
      storedSessionId: sessionId,
      isHydrated,
    });

    // Session mismatch - redirect to home
    if (!sessionId || sessionId !== urlSessionId) {
      console.error('[CompletePage] Session mismatch, redirecting to home');
      setValidationError('Session not found. Please start a new assessment.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    console.log('[CompletePage] Session validated successfully');
  }, [isHydrated, sessionId, urlSessionId, router]);

  const handleComplete = async () => {
    console.log('[CompletePage] Completing assessment for session:', sessionId);
    setIsLoading(true);
    setError(null);

    try {
      const data = await completeSession(sessionId!, optInEmail);
      console.log('[CompletePage] Assessment completed successfully');
      setCompletionData(data);
    } catch (err) {
      console.error('[CompletePage] Error completing assessment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete assessment. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!completionData?.summary_html) return;

    console.log('[CompletePage] Copying summary to clipboard');

    // Extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = completionData.summary_html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    navigator.clipboard.writeText(plainText).then(() => {
      console.log('[CompletePage] Summary copied successfully');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('[CompletePage] Failed to copy summary:', err);
    });
  };

  const handleDownloadPDF = () => {
    console.log('[CompletePage] PDF download requested (not implemented)');
    alert('PDF download feature coming soon!');
  };

  const handleBackToHome = () => {
    console.log('[CompletePage] Navigating back to home');
    router.push('/');
  };

  // Show loading during hydration
  if (!isHydrated) {
    console.log('[CompletePage] Waiting for hydration...');
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00FFFF] animate-spin" />
          <p className="text-gray-400 font-['Exo',sans-serif]">Loading completion...</p>
        </div>
      </main>
    );
  }

  // Show validation error
  if (validationError) {
    console.log('[CompletePage] Showing validation error:', validationError);
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="p-6 border border-red-500/50 rounded-xl bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-['Exo',sans-serif] text-lg">
                  {validationError}
                </p>
                <p className="text-gray-400 text-sm mt-2 font-['Exo',sans-serif]">
                  Redirecting to home...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show completion results
  if (completionData) {
    console.log('[CompletePage] Rendering completion results');
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8AFF00] rounded-full blur-[120px]" />
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

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={handleBackToHome}
                variant="ghost"
                className="text-gray-400 hover:text-white font-['Exo',sans-serif]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopySummary}
                  variant="outline"
                  className="border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 font-['Exo',sans-serif]"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Summary
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-[#FF0080] to-[#00FFFF] hover:from-[#FF0080]/80 hover:to-[#00FFFF]/80 text-white font-['Orbitron',sans-serif] tracking-wider"
                >
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD PDF
                </Button>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#8AFF00] via-[#FCEE09] to-[#00FFFF] bg-clip-text text-transparent font-['Orbitron',sans-serif] tracking-wider">
                ASSESSMENT COMPLETE
              </h1>
              <p className="text-gray-300 text-lg font-['Exo',sans-serif]">
                {completionData.message}
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="max-w-4xl mx-auto mb-8">
            <SummaryCard
              readinessScore={completionData.readiness_score}
              roiEstimate={completionData.roi_estimate}
            />
          </div>

          {/* HTML Summary */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00] rounded-2xl blur-xl opacity-20" />
              
              <div className="relative bg-[#1B1B1B] border border-[#00FFFF]/50 rounded-2xl p-8 shadow-2xl">
                <div className="prose prose-invert max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: completionData.summary_html }}
                    className="[&>*]:text-gray-300 [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>h1]:font-['Orbitron',sans-serif] [&>h2]:font-['Orbitron',sans-serif] [&>h3]:font-['Orbitron',sans-serif] [&>p]:font-['Exo',sans-serif] [&>ul]:font-['Exo',sans-serif] [&>ol]:font-['Exo',sans-serif]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glitch effect lines */}
        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8AFF00] to-transparent opacity-50 animate-pulse" />
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30 animate-pulse" />
      </main>
    );
  }

  // Show finalization form
  console.log('[CompletePage] Rendering finalization form');
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FCEE09] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF0080] rounded-full blur-[120px]" />
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF] rounded-2xl blur-xl opacity-30" />
            
            <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#FCEE09]/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF] bg-clip-text text-transparent font-['Orbitron',sans-serif] tracking-wider">
                  FINALIZE ASSESSMENT
                </h1>
                <p className="text-gray-300 text-lg font-['Exo',sans-serif]">
                  You've completed all questions. Ready to see your results?
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-400 text-sm font-['Exo',sans-serif]">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-[#0F0F0F]/50 border border-[#00FFFF]/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="opt-in"
                    checked={optInEmail}
                    onCheckedChange={(checked) => setOptInEmail(checked as boolean)}
                    className="mt-1 border-[#00FFFF]/50 data-[state=checked]:bg-[#00FFFF] data-[state=checked]:border-[#00FFFF]"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="opt-in"
                      className="text-white font-['Exo',sans-serif] cursor-pointer"
                    >
                      Send me my personalized AI readiness report and tips
                    </Label>
                    <p className="text-gray-400 text-sm mt-1 font-['Exo',sans-serif]">
                      We'll email you a copy of your assessment results and recommendations
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF] hover:from-[#FCEE09]/80 hover:via-[#FF0080]/80 hover:to-[#00FFFF]/80 text-white font-bold font-['Orbitron',sans-serif] tracking-wider uppercase text-lg relative overflow-hidden group transition-all duration-300 shadow-lg shadow-[#FF0080]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      GENERATING RESULTS...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      COMPLETE ASSESSMENT
                    </>
                  )}
                </span>
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </Button>

              {error && (
                <Button
                  onClick={handleComplete}
                  variant="outline"
                  className="w-full mt-4 border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/10 font-['Exo',sans-serif]"
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
