'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Sparkles, Target, Info, CheckCircle2 } from 'lucide-react';
import { postAnswer, saveSessionState } from '@/lib/api';

interface LLMReply {
  reply_text: string;
  recommended_action: string;
  tags: string[];
  explainability: string;
}

interface AnswerFormProps {
  sessionId: string;
  questionId: string;
  questionText: string;
  isLastQuestion?: boolean;
  onAnswerSubmitted?: (reply: LLMReply) => void;
}

export function AnswerForm({ 
  sessionId, 
  questionId, 
  questionText,
  isLastQuestion = false,
  onAnswerSubmitted 
}: AnswerFormProps) {
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [llmReply, setLlmReply] = useState<LLMReply | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reply = await postAnswer(sessionId, questionId, answer.trim());
      
      // Save state to localStorage
      saveSessionState(sessionId, questionId, answer.trim());
      
      // Update UI with reply
      setLlmReply(reply);
      
      // Notify parent component
      if (onAnswerSubmitted) {
        onAnswerSubmitted(reply);
      }
      
      // Clear input
      setAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Display */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] via-[#8AFF00] to-[#FCEE09] rounded-2xl blur-lg opacity-20" />
        
        <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#00FFFF]/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#0F0F0F]" />
            </div>
            <div className="flex-1">
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase">
                Question {questionId}
              </p>
            </div>
          </div>
          
          <p className="text-white text-base md:text-lg leading-relaxed font-['Exo',sans-serif] pl-11">
            {questionText}
          </p>
        </div>
      </div>

      {/* Answer Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isLoading}
            className="min-h-[120px] bg-[#1B1B1B] border-[#FF0080]/50 text-white placeholder:text-gray-500 focus:border-[#00FFFF] focus:ring-[#00FFFF]/50 font-['Exo',sans-serif] resize-none transition-all duration-300"
          />
          
          {error && (
            <p className="text-red-400 text-sm mt-2 font-['Exo',sans-serif] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-400" />
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !answer.trim()}
          className={`w-full h-12 ${
            isLastQuestion 
              ? 'bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF] hover:from-[#FCEE09]/80 hover:via-[#FF0080]/80 hover:to-[#00FFFF]/80 shadow-[#FCEE09]/50'
              : 'bg-gradient-to-r from-[#FF0080] to-[#00FFFF] hover:from-[#FF0080]/80 hover:to-[#00FFFF]/80 shadow-[#FF0080]/50'
          } text-white font-bold font-['Orbitron',sans-serif] tracking-wider uppercase relative overflow-hidden group transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PROCESSING...
              </>
            ) : isLastQuestion ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                FINAL ANSWER
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                REPLY MESSAGE
              </>
            )}
          </span>
          
          <div className={`absolute inset-0 ${
            isLastQuestion 
              ? 'bg-gradient-to-r from-[#FCEE09] via-[#FF0080] to-[#00FFFF]'
              : 'bg-gradient-to-r from-[#FF0080] to-[#00FFFF]'
          } opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />
        </Button>
      </form>

      {/* LLM Reply Display */}
      {llmReply && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Reply */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] rounded-2xl blur-lg opacity-20" />
            
            <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#8AFF00]/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8AFF00] to-[#FCEE09] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#0F0F0F]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#8AFF00] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase">
                    AI COACH RESPONSE
                  </p>
                </div>
              </div>
              
              <p className="text-white text-base md:text-lg leading-relaxed font-['Exo',sans-serif] mb-4 pl-11">
                {llmReply.reply_text}
              </p>

              {/* Tags */}
              {llmReply.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-11">
                  {llmReply.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-[#8AFF00]/20 text-[#8AFF00] border border-[#8AFF00]/50 font-['Exo',sans-serif] text-xs px-3 py-1"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Action */}
          {llmReply.recommended_action && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FCEE09] to-[#FF0080] rounded-xl blur-lg opacity-20" />
              
              <div className="relative bg-[#1B1B1B] border border-[#FCEE09]/50 rounded-xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[#FCEE09] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[#FCEE09] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase mb-2">
                      RECOMMENDED ACTION
                    </p>
                    <p className="text-white text-sm leading-relaxed font-['Exo',sans-serif]">
                      {llmReply.recommended_action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explainability */}
          {llmReply.explainability && (
            <div className="relative">
              <div className="relative bg-[#0F0F0F]/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs font-['Exo',sans-serif] leading-relaxed">
                      {llmReply.explainability}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
