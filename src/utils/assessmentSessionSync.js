import { studentApi } from '../api';
import {
  AssessmentSessionStatus,
  AssessmentSessionType,
  buildSessionKey,
  computeTimeTaken,
  deleteSession,
  getNeedingSync,
  getSession,
  isCompetitionBlocked,
  saveSession,
} from './assessmentSessionStorage';

function formatAnswers(answers = {}) {
  const formatted = {};
  Object.entries(answers).forEach(([qId, oId]) => {
    formatted[`question_${qId}`] = oId;
  });
  return formatted;
}

function isExamType(type) {
  return type === AssessmentSessionType.COURSE_EXAM || type === AssessmentSessionType.STANDALONE_EXAM;
}

export async function submitSession(session) {
  const formattedAnswers = formatAnswers(session.answers);
  const timeTaken = computeTimeTaken(session);

  try {
    if (session.type === AssessmentSessionType.COURSE_EXAM) {
      await studentApi.submitExam(session.target_id, {
        exam_id: session.target_id,
        answers: formattedAnswers,
        time_taken: timeTaken,
        is_auto_submitted: !!session.abandoned,
      });
    } else if (session.type === AssessmentSessionType.STANDALONE_EXAM) {
      await studentApi.submitStandaloneExam(session.target_id, {
        answers: formattedAnswers,
        time_taken: timeTaken,
        is_auto_submitted: !!session.abandoned,
      });
    } else if (session.type === AssessmentSessionType.COMPETITION_MATCH) {
      await studentApi.submitCompetitionMatch(session.course_id, session.target_id, {
        time_taken: timeTaken,
        answers: formattedAnswers,
      });
    }

    if (isExamType(session.type)) {
      deleteSession(session.key);
    } else {
      saveSession({ ...session, status: AssessmentSessionStatus.SYNCED, abandoned: false });
    }
    return true;
  } catch {
    saveSession({ ...session, status: AssessmentSessionStatus.PENDING_SYNC, abandoned: true });
    return false;
  }
}

async function submitIfNeeded(session) {
  if (session.status === AssessmentSessionStatus.SYNCED) return;
  const toSubmit =
    session.status === AssessmentSessionStatus.IN_PROGRESS
      ? { ...session, status: AssessmentSessionStatus.PENDING_SYNC, abandoned: true }
      : session;
  saveSession(toSubmit);
  await submitSession(toSubmit);
}

export async function flushAllPending() {
  const sessions = getNeedingSync();
  for (const session of sessions) {
    await submitIfNeeded(session);
  }
}

export async function abandonSession(key) {
  const session = getSession(key);
  if (!session) return;
  if (session.status === AssessmentSessionStatus.SYNCED && session.type === AssessmentSessionType.COMPETITION_MATCH) {
    return;
  }
  const abandoned = {
    ...session,
    status: AssessmentSessionStatus.PENDING_SYNC,
    abandoned: true,
  };
  saveSession(abandoned);
  await submitSession(abandoned);
}

export async function markCompleted(key) {
  const session = getSession(key);
  if (!session) return;
  if (isExamType(session.type)) {
    deleteSession(key);
    return;
  }
  saveSession({ ...session, status: AssessmentSessionStatus.SYNCED, abandoned: false });
}

/** Exams: submit saved attempt then always allow opening. */
export async function prepareForExam(type, examId) {
  const key = buildSessionKey(type, examId);
  const session = getSession(key);
  if (session) {
    await submitIfNeeded(session);
    deleteSession(key);
  }
  return { allowed: true };
}

/** Competitions: submit pending attempt, then block if already played. */
export async function prepareForCompetition(courseId, matchId, roundId) {
  const key = buildSessionKey(AssessmentSessionType.COMPETITION_MATCH, matchId, courseId, roundId);
  const session = getSession(key);
  if (session && session.status !== AssessmentSessionStatus.SYNCED) {
    await submitIfNeeded(session);
  }

  if (isCompetitionBlocked(key)) {
    return {
      allowed: false,
      message: 'لقد لعبت هذه الجولة مسبقاً ولا يمكن إعادة اللعب.',
    };
  }
  return { allowed: true };
}
