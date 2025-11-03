interface PostAnswerRequest {
  session_id: string;
  question_id: string;
  answer_text: string;
}

interface PostAnswerResponse {
  reply_text: string;
  recommended_action: string;
  tags: string[];
  explainability: string;
}

interface CompleteSessionRequest {
  session_id: string;
  opt_in_email: boolean;
}

interface CompleteSessionResponse {
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
): Promise<PostAnswerResponse> {
  const url = `${process.env.NEXT_PUBLIC_N8N_URL}/session/${sessionId}/answer`;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      answer_text: answerText,
    } as PostAnswerRequest),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to submit answer: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function completeSession(
  sessionId: string,
  optInEmail: boolean
): Promise<CompleteSessionResponse> {
  const url = `${process.env.NEXT_PUBLIC_N8N_URL}/webhook/session/complete`;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      opt_in_email: optInEmail,
    } as CompleteSessionRequest),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to complete assessment: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export function saveSessionState(sessionId: string, questionId: string, answerText: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('current_question_id', questionId);
    localStorage.setItem('last_answer', answerText);
  }
}

export function getSessionState() {
  if (typeof window !== 'undefined') {
    return {
      sessionId: localStorage.getItem('session_id'),
      questionId: localStorage.getItem('current_question_id'),
      lastAnswer: localStorage.getItem('last_answer'),
    };
  }
  return { sessionId: null, questionId: null, lastAnswer: null };
}
