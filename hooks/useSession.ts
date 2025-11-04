import { useState, useEffect } from 'react';

interface SessionState {
  sessionId: string | null;
  firstPrompt: string | null;
  currentQuestionId: string | null;
  answeredQuestions: string[];
}

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstPrompt, setFirstPrompt] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    console.log('[useSession] Hydrating from localStorage...');
    
    const sid = localStorage.getItem('session_id');
    const prompt = localStorage.getItem('first_prompt');
    const qid = localStorage.getItem('current_question_id');
    const answered = localStorage.getItem('answered_questions');

    if (sid) {
      console.log('[useSession] Found session_id:', sid);
      setSessionId(sid);
    }
    if (prompt) {
      console.log('[useSession] Found first_prompt:', prompt.substring(0, 50) + '...');
      setFirstPrompt(prompt);
    }
    if (qid) {
      console.log('[useSession] Found current_question_id:', qid);
      setCurrentQuestionId(qid);
    }
    if (answered) {
      const parsedAnswered = JSON.parse(answered);
      console.log('[useSession] Found answered_questions:', parsedAnswered);
      setAnsweredQuestions(parsedAnswered);
    }

    setIsHydrated(true);
    console.log('[useSession] Hydration complete');
  }, []);

  // Sync sessionId to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    
    if (sessionId) {
      console.log('[useSession] Syncing session_id to localStorage:', sessionId);
      localStorage.setItem('session_id', sessionId);
    } else {
      console.log('[useSession] Clearing session_id from localStorage');
      localStorage.removeItem('session_id');
    }
  }, [sessionId, isHydrated]);

  // Sync firstPrompt to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    
    if (firstPrompt) {
      console.log('[useSession] Syncing first_prompt to localStorage');
      localStorage.setItem('first_prompt', firstPrompt);
    } else {
      console.log('[useSession] Clearing first_prompt from localStorage');
      localStorage.removeItem('first_prompt');
    }
  }, [firstPrompt, isHydrated]);

  // Sync currentQuestionId to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    
    if (currentQuestionId) {
      console.log('[useSession] Syncing current_question_id to localStorage:', currentQuestionId);
      localStorage.setItem('current_question_id', currentQuestionId);
    } else {
      console.log('[useSession] Clearing current_question_id from localStorage');
      localStorage.removeItem('current_question_id');
    }
  }, [currentQuestionId, isHydrated]);

  // Sync answeredQuestions to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    
    if (answeredQuestions.length > 0) {
      console.log('[useSession] Syncing answered_questions to localStorage:', answeredQuestions);
      localStorage.setItem('answered_questions', JSON.stringify(answeredQuestions));
    } else {
      console.log('[useSession] Clearing answered_questions from localStorage');
      localStorage.removeItem('answered_questions');
    }
  }, [answeredQuestions, isHydrated]);

  const clearSession = () => {
    console.log('[useSession] Clearing all session data');
    setSessionId(null);
    setFirstPrompt(null);
    setCurrentQuestionId(null);
    setAnsweredQuestions([]);
    localStorage.removeItem('session_id');
    localStorage.removeItem('first_prompt');
    localStorage.removeItem('current_question_id');
    localStorage.removeItem('answered_questions');
  };

  const addAnsweredQuestion = (questionId: string) => {
    console.log('[useSession] Adding answered question:', questionId);
    setAnsweredQuestions(prev => {
      if (prev.includes(questionId)) return prev;
      return [...prev, questionId];
    });
  };

  return {
    sessionId,
    setSessionId,
    firstPrompt,
    setFirstPrompt,
    currentQuestionId,
    setCurrentQuestionId,
    answeredQuestions,
    addAnsweredQuestion,
    clearSession,
    isHydrated,
  };
};
