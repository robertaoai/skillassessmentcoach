'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { AnswerForm } from '@/components/answer-form';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock questions - 9 questions in 3x3 pattern
const QUESTIONS = [
  { id: 'q1', text: 'What are your biggest challenges with AI adoption in your team?' },
  { id: 'q2', text: 'How much time does your team spend on repetitive tasks each week?' },
  { id: 'q3', text: 'What manual processes would you like to automate first?' },
  { id: 'q4', text: 'How comfortable is your team with using AI tools?' },
  { id: 'q5', text: 'What outcomes would make AI adoption successful for you?' },
  { id: 'q6', text: 'What concerns do you have about implementing AI?' },
  { id: 'q7', text: 'How do you currently measure team productivity?' },
  { id: 'q8', text: 'What training or support would your team need?' },
  { id: 'q9', text: 'What is your timeline for seeing results from AI adoption?' },
];

export default function AnswerPage() {
  const params = useParams();
  const router = useRouter();
  const urlSessionId = params.sessionId as string;
  
  const { 
    sessionId, 
    currentQuestionId, 
    setCurrentQuestionId,
    answeredQuestions,
    addAnsweredQuestion,
    isHydrated 
  } = useSession();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate session on mount
  useEffect(() => {
    if (!isHydrated) return;

    console.log('[AnswerPage] Validating session...', {
      urlSessionId,
      storedSessionId: sessionId,
      isHydrated,
    });

    // Session mismatch - redirect to home
    if (!sessionId || sessionId !== urlSessionId) {
      console.error('[AnswerPage] Session mismatch, redirecting to home');
      setValidationError('Session not found. Please start a new assessment.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    console.log('[AnswerPage] Session validated successfully');

    // Restore question index from answered questions
    if (answeredQuestions.length > 0) {
      const lastAnsweredIndex = QUESTIONS.findIndex(
        q => q.id === answeredQuestions[answeredQuestions.length - 1]
      );
      if (lastAnsweredIndex >= 0 && lastAnsweredIndex < QUESTIONS.length - 1) {
        const nextIndex = lastAnsweredIndex + 1;
        console.log('[AnswerPage] Resuming from question', nextIndex + 1);
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestionId(QUESTIONS[nextIndex].id);
      }
    } else {
      // Start from first question
      setCurrentQuestionId(QUESTIONS[0].id);
    }
  }, [isHydrated, sessionId, urlSessionId, answeredQuestions, router, setCurrentQuestionId]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((answeredQuestions.length) / QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const handleAnswerSubmitted = () => {
    console.log('[AnswerPage] Answer submitted for question:', currentQuestion.id);
    
    // Mark current question as answered
    addAnsweredQuestion(currentQuestion.id);

    // If last question, navigate to completion page
    if (isLastQuestion) {
      console.log('[AnswerPage] Last question answered, navigating to completion');
      setTimeout(() => {
        router.push(`/complete/${sessionId}`);
      }, 1500);
    } else {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      console.log('[AnswerPage] Moving to next question:', nextIndex + 1);
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestionId(QUESTIONS[nextIndex].id);
      }, 1000);
    }
  };

  const handleBackToHome = () => {
    console.log('[AnswerPage] Navigating back to home');
    router.push('/');
  };

  // Show loading during hydration
  if (!isHydrated) {
    console.log('[AnswerPage] Waiting for hydration...');
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00FFFF] animate-spin" />
          <p className="text-gray-400 font-['Exo',sans-serif]">Loading assessment...</p>
        </div>
      </main>
    );
  }

  // Show validation error
  if (validationError) {
    console.log('[AnswerPage] Showing validation error:', validationError);
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

  console.log('[AnswerPage] Rendering question', currentQuestionIndex + 1, 'of', QUESTIONS.length);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1B1B1B] relative overflow-hidden">
      {/* Background effects */}
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="text-gray-400 hover:text-white font-['Exo',sans-serif]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-right">
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-sm tracking-wider">
                QUESTION {currentQuestionIndex + 1} / {QUESTIONS.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-[#1B1B1B] rounded-full overflow-hidden border border-[#00FFFF]/30">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Answer Form */}
        <div className="max-w-2xl mx-auto">
          <AnswerForm
            sessionId={sessionId!}
            questionId={currentQuestion.id}
            questionText={currentQuestion.text}
            onAnswerSubmitted={handleAnswerSubmitted}
            isLastQuestion={isLastQuestion}
          />
        </div>
      </div>

      {/* Glitch effect lines */}
      <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF0080] to-transparent opacity-50 animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30 animate-pulse" />
    </main>
  );
}
