const STORAGE_KEY = 'mps_assessment_sessions';

export const AssessmentSessionType = {
  COURSE_EXAM: 'course_exam',
  STANDALONE_EXAM: 'standalone_exam',
  COMPETITION_MATCH: 'competition_match',
};

export const AssessmentSessionStatus = {
  IN_PROGRESS: 'in_progress',
  PENDING_SYNC: 'pending_sync',
  SYNCED: 'synced',
};

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAll(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function buildSessionKey(type, targetId, courseId = null, roundId = null) {
  if (type === AssessmentSessionType.COMPETITION_MATCH) {
    return `competition_${courseId ?? 0}_${targetId}_${roundId ?? 0}`;
  }
  if (type === AssessmentSessionType.STANDALONE_EXAM) {
    return `standalone_exam_${targetId}`;
  }
  return `course_exam_${targetId}`;
}

export function getSession(key) {
  const all = readAll();
  return all[key] || null;
}

export function saveSession(session) {
  const all = readAll();
  all[session.key] = session;
  writeAll(all);
}

export function deleteSession(key) {
  const all = readAll();
  delete all[key];
  writeAll(all);
}

export function getAllSessions() {
  return Object.values(readAll());
}

export function getNeedingSync() {
  return getAllSessions().filter(
    (s) =>
      s.status === AssessmentSessionStatus.IN_PROGRESS ||
      s.status === AssessmentSessionStatus.PENDING_SYNC,
  );
}

export function isCompetitionBlocked(key) {
  const session = getSession(key);
  if (!session) return false;
  if (session.type !== AssessmentSessionType.COMPETITION_MATCH) return false;
  return [
    AssessmentSessionStatus.SYNCED,
    AssessmentSessionStatus.PENDING_SYNC,
    AssessmentSessionStatus.IN_PROGRESS,
  ].includes(session.status);
}

export function startSession({
  type,
  targetId,
  courseId = null,
  roundId = null,
  questionIds = [],
  durationSeconds = 0,
  title = null,
}) {
  const key = buildSessionKey(type, targetId, courseId, roundId);
  const session = {
    key,
    type,
    target_id: targetId,
    course_id: courseId,
    round_id: roundId,
    question_ids: questionIds,
    answers: {},
    started_at: new Date().toISOString(),
    duration_seconds: durationSeconds,
    title,
    status: AssessmentSessionStatus.IN_PROGRESS,
    abandoned: false,
  };
  saveSession(session);
  return session;
}

export function updateAnswer(key, questionId, optionId) {
  const session = getSession(key);
  if (!session) return;
  session.answers = session.answers || {};
  session.answers[String(questionId)] = optionId;
  saveSession(session);
}

export function computeTimeTaken(session) {
  const started = new Date(session.started_at).getTime();
  const elapsed = Math.floor((Date.now() - started) / 1000);
  if (!session.duration_seconds) return elapsed;
  return elapsed > session.duration_seconds ? session.duration_seconds : elapsed;
}
