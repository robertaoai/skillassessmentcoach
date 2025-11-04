interface SessionResponse {
  session_id: string;
  first_prompt: string;
}

interface LLMReply {
  reply_text: string;
  recommended_action: string;
  tags: string[];
  explainability: string;
}

interface CompletionResponse {
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

export async function postAnswer(
  sessionId: string,
  questionId: string,
  answerText: string
): Promise<LLMReply> {
  console.log('[API] Posting answer:', {
    sessionId,
    questionId,
    answerLength: answerText.length,
  });

  try {
    const response = await fetch(
      `https://robertcoach.app.n8n.cloud/webhook-test/6a535534-b0e8-48b5-9bbe-c5b72c35b895/session/${sessionId}/answer`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          answer_text: answerText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Answer posted successfully:', {
      replyLength: data.reply_text?.length || 0,
      tagsCount: data.tags?.length || 0,
    });

    return data;
  } catch (error) {
    console.error('[API] Error posting answer:', error);
    throw error;
  }
}

export async function completeSession(
  sessionId: string,
  optInEmail: boolean
): Promise<CompletionResponse> {
  console.log('[API] Completing session:', {
    sessionId,
    optInEmail,
  });

  try {
    const response = await fetch(
      'https://robertcoach.app.n8n.cloud/webhook/session/complete',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          opt_in_email: optInEmail,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[API] Session completed successfully:', {
      status: data.status,
      readinessScore: data.readiness_score,
      summaryLength: data.summary_html?.length || 0,
    });

    return data;
  } catch (error) {
    console.error('[API] Error completing session:', error);
    throw error;
  }
}

export function getSessionState() {
  if (typeof window === 'undefined') {
    return {
      sessionId: null,
      firstPrompt: null,
      currentQuestionId: null,
      answeredQuestions: [],
    };
  }

  const sessionId = localStorage.getItem('session_id');
  const firstPrompt = localStorage.getItem('first_prompt');
  const currentQuestionId = localStorage.getItem('current_question_id');
  const answeredQuestions = JSON.parse(
    localStorage.getItem('answered_questions') || '[]'
  );

  console.log('[API] Retrieved session state:', {
    sessionId: sessionId ? 'exists' : 'null',
    firstPrompt: firstPrompt ? 'exists' : 'null',
    currentQuestionId,
    answeredQuestionsCount: answeredQuestions.length,
  });

  return {
    sessionId,
    firstPrompt,
    currentQuestionId,
    answeredQuestions,
  };
}

export function saveSessionState(
  sessionId: string,
  questionId: string,
  answerText: string
) {
  console.log('[API] Saving session state:', {
    sessionId,
    questionId,
    answerLength: answerText.length,
  });

  if (typeof window === 'undefined') return;

  localStorage.setItem('session_id', sessionId);
  localStorage.setItem('current_question_id', questionId);

  // Add to answered questions
  const answered = JSON.parse(
    localStorage.getItem('answered_questions') || '[]'
  );
  if (!answered.includes(questionId)) {
    answered.push(questionId);
    localStorage.setItem('answered_questions', JSON.stringify(answered));
  }

  console.log('[API] Session state saved successfully');
}
