import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'counseling_db.json');

// Initial seed data for counseling records
const INITIAL_DB = {
  sessions: [
    {
      id: 'session-demo-1',
      topicId: 'parent_complaint',
      topicTitle: '학부모의 날 선 전화와 민원에 가슴이 내려앉았을 때',
      category: '민원 & 교권',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
      formattedDate: '2일 전',
      beforeStress: 9,
      afterStress: 4,
      selectedOptions: ['다시 연락이 올까 봐 휴대폰만 울려도 심장이 뜁니다', '상대의 비상식적인 태도와 내 교직관을 분리하고 싶습니다'],
      userNotes: '방과 후에 5시 넘어 온 폭언 섞인 문자 때문에 손이 덜덜 떨렸음. 내 잘못이 아니라는 것을 곱씹으며 마음을 가다듬음.',
      teacherMemo: '교감선생님께 통화 내용 보고 완료함. 안심번호 퇴근 후 자동 차단 모드 설정함.',
      status: '마음안정',
      prescription: {
        title: '민원 트라우마 완화를 위한 마음 처방전',
        diagnosisName: '감정적 피습 후 급성 스트레스 상태',
        warmMessage: '선생님, 오늘 정말 많이 놀라고 무서우셨을 텐데 교실을 끝까지 지키셨습니다. 그것만으로도 선생님은 오늘 할 수 있는 최선을 다하셨습니다.',
        prescribedHabits: [
          '퇴근 즉시 학교 업무 알림 완전 음소거 및 안심번호 꺼두기',
          '따뜻한 차 한 잔 마시며 4-7-8 안정화 호흡 3세트 진행하기',
          '믿을 수 있는 동료나 가족에게 솔직하게 털어놓기'
        ],
        affirmation: '“나는 최선을 다했고, 타인의 무례함은 결코 나의 존엄과 가치를 훼손할 수 없다.”'
      }
    },
    {
      id: 'session-demo-3',
      topicId: 'parent_complaint',
      topicTitle: '밤늦게 울린 장문의 항의 카톡으로 밤을 꼬박 새웠을 때',
      category: '민원 & 교권',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
      formattedDate: '5일 전',
      beforeStress: 9,
      afterStress: 4,
      selectedOptions: ['학교나 관리자가 나를 보호해주지 않을 것 같아 외롭습니다', '상대의 비상식적인 태도와 내 교직관을 분리하고 싶습니다'],
      userNotes: '아이가 다쳤다는 이유로 교사에게 책임을 전가하는 장문의 문자. 심장이 터질 것 같아 밤에 잠을 한숨도 못 잤음.',
      teacherMemo: '교무부장님과 상의 후 공식 면담 절차로 안내함. 밤에는 절대 답장하지 않기로 규칙 세움.',
      status: '마음안정',
      prescription: {
        title: '야간 민원 차단 및 불안 완화 처방전',
        diagnosisName: '사적 영역 침해 후 과각성 상태',
        warmMessage: '선생님의 밤은 온전히 선생님 자신의 것입니다. 밤늦은 메시지에 즉시 답하지 않아도 선생님은 지극히 성실한 교사입니다.',
        prescribedHabits: [
          '침실에 스마트폰 반입 금지',
          '내일 아침 공식 출근 시간까지 문자 다시 열어보지 않기'
        ],
        affirmation: '“교직은 직업일 뿐, 내 사생활과 휴식권은 침해받을 수 없다.”'
      }
    },
    {
      id: 'session-demo-4',
      topicId: 'overwork_burnout',
      topicTitle: '끝없는 공문과 행정 업무로 영혼이 방전되었을 때',
      category: '업무 & 번아웃',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
      formattedDate: '4일 전',
      beforeStress: 8,
      afterStress: 5,
      selectedOptions: ['10% 미만: 아침에 눈을 뜨면 출근하기가 두렵고 눈물이 납니다', '침대에 누워 아무 생각도 안 하고 멍때리기'],
      userNotes: '수업 준비는 10분도 못 했는데 결재 공문만 6개 처리하느라 하루가 다 감. 교사인지 서무인지 모르겠다는 회의감.',
      teacherMemo: '일단 급한 기안 1개만 끝내고 나머지는 내일로 넘김. 5시 정시 퇴근 성공.',
      status: '진행중',
      prescription: {
        title: '과중 업무 번아웃 회복 처방전',
        diagnosisName: '만성 업무 과부하 및 정서적 탈진',
        warmMessage: '선생님, 세상의 모든 공문을 다 처리해도 내 영혼이 다치면 아무 소용이 없습니다.',
        prescribedHabits: [
          '내일 할 일 2가지만 적고 퇴근길 가방 가볍게 하기',
          '저녁 8시 이후 학교 메신저 알림 완전 차단하기'
        ],
        affirmation: '“나는 완벽할 필요가 없다. 80%만으로도 나는 이미 훌륭한 교사다.”'
      }
    },
    {
      id: 'session-demo-2',
      topicId: 'student_struggle',
      topicTitle: '수업 방해와 생활지도 갈등으로 깊은 무력감이 들 때',
      category: '학생 지도',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 6).toISOString(),
      formattedDate: '6일 전',
      beforeStress: 8,
      afterStress: 5,
      selectedOptions: ['비웃거나 무시하는 태도를 보일 때 가슴에서 피눈물이 납니다', '감정적으로 폭발하지 않고 침묵으로 교실을 정돈한 것'],
      userNotes: '3교시 수업 시간에 지시를 대놓고 거부하는 학생 때문에 순간 너무 화가 났지만 심호흡으로 버텼음.',
      teacherMemo: 'Wee 클래스 전문상담선생님께 연계 상담 요청서 제출. 나 혼자 떠안지 않기로 다짐.',
      status: '진행중',
      prescription: {
        title: '생활지도 탈진 극복을 위한 마음 처방전',
        diagnosisName: '교육적 효능감 일시적 저하',
        warmMessage: '선생님은 아이들의 잘못된 행동에 대해 처벌하거나 고쳐내는 기계가 아닙니다. 선생님의 따뜻한 눈빛을 기억하는 아이들이 훨씬 많습니다.',
        prescribedHabits: [
          '아이의 문제 행동 관찰 일지는 교무실 서랍에 두고 가방 가볍게 퇴근하기',
          '나를 좋아하는 학생이 써줬던 편지나 쪽지 꺼내 읽기'
        ],
        affirmation: '“나는 완전하지 않아도 충분히 좋은 교사이며, 내 존재 자체로 교실에 안정을 준다.”'
      }
    },
    {
      id: 'session-demo-5',
      topicId: 'imposter_guilt',
      topicTitle: '“내가 좋은 교사일까?” 자책과 자괴감이 밀려올 때',
      category: '자존감 & 죄책감',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 9).toISOString(),
      formattedDate: '9일 전',
      beforeStress: 7,
      afterStress: 3,
      selectedOptions: ['“나 때문에 우리 반 아이들이 손해 보는 것 같아 미안해요”', '소외되거나 힘들어하는 아이를 그냥 지나치지 못하는 따뜻한 눈'],
      userNotes: '옆 반 선생님의 활기찬 수업 소리를 들으며 나 자신이 너무 초라하게 느껴졌던 날.',
      teacherMemo: '아이들에게 받은 쪽지함을 열어보고 마음을 달램. 완벽하지 않아도 된다고 스스로를 다독임.',
      status: '마음안정',
      prescription: {
        title: '자기 자비와 자존감 회복 처방전',
        diagnosisName: '가면 증후군 및 교육적 죄책감 과다',
        warmMessage: '선생님, 고민하고 괴로워하는 밤이 길다는 건 그만큼 아이들을 사랑하기 때문입니다.',
        prescribedHabits: [
          '거울을 보며 내 이름 불러주며 칭찬하기',
          '아이들과 나눈 사소한 감사 일기 쓰기'
        ],
        affirmation: '“나는 배우고 성장하는 인간적인 교사이며, 내 온기는 아이들의 가슴에 영원히 남는다.”'
      }
    }
  ],
  burnoutRecords: [
    {
      id: 'burnout-demo-1',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
      formattedDate: '3일 전',
      totalScore: 21,
      level: '주의 (노란불)',
      color: '#D97706',
      emotionalScore: 11,
      depersonalizationScore: 4,
      accomplishmentScore: 6
    }
  ],
  prescriptions: [
    {
      id: 'presc-demo-1',
      title: '민원 트라우마 완화를 위한 마음 처방전',
      diagnosisName: '감정적 피습 후 급성 스트레스 상태',
      date: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
      warmMessage: '선생님, 오늘 정말 많이 놀라고 무서우셨을 텐데 교실을 끝까지 지키셨습니다.',
      affirmation: '“나는 최선을 다했고, 타인의 무례함은 결코 나의 존엄과 가치를 훼손할 수 없다.”'
    }
  ],
  communityNotes: [
    {
      id: 'note-1',
      authorTag: '초등 7년차 담임',
      content: '선생님, 오늘 점심시간에도 싸운 아이들 중재하고 쏟아지는 공문 보느라 물 한 잔 편히 못 드셨죠? 오늘 하루도 교실을 지켜내신 것만으로도 선생님은 대단한 영웅입니다. 오늘 밤은 푹 주무세요.',
      date: '방금 전',
      likes: 86,
      liked: false
    },
    {
      id: 'note-2',
      authorTag: '중등 3년차 수학',
      content: '학부모 민원에 가슴 떨리던 날, 옆자리 부장님이 건네주신 믹스커피 한 잔에 펑펑 울었던 기억이 납니다. 선생님 탓이 아니에요. 그 사람의 화는 그 사람의 결핍일 뿐입니다. 힘내세요!',
      date: '10분 전',
      likes: 131,
      liked: false
    },
    {
      id: 'note-3',
      authorTag: '고3 담임 12년차',
      content: '아이들이 내 마음을 몰라주고 거친 말을 뱉을 때마다 교직에 회의가 들곤 합니다. 하지만 졸업하고 몇 년 뒤 불쑥 찾아와 "그때 선생님 눈빛 덕분에 살았어요"라고 말하는 녀석이 꼭 있더군요. 선생님의 진심은 사라지지 않습니다.',
      date: '35분 전',
      likes: 218,
      liked: false
    }
  ]
};

// Database helper functions
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db file, restoring fallback:', err);
    return INITIAL_DB;
  }
}

function writeDb(data: typeof INITIAL_DB) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // =====================
  // BACKEND API ROUTES
  // =====================

  // 1. Get all counseling sessions
  app.get('/api/counseling/sessions', (_req: Request, res: Response) => {
    const db = readDb();
    res.json({
      success: true,
      sessions: db.sessions || []
    });
  });

  // 2. Create a new counseling session
  app.post('/api/counseling/sessions', (req: Request, res: Response) => {
    const {
      topicId,
      topicTitle,
      category,
      beforeStress,
      afterStress,
      selectedOptions,
      userNotes,
      teacherMemo,
      status,
      prescription
    } = req.body;

    const db = readDb();
    const newSession = {
      id: `session-${Date.now()}`,
      topicId: topicId || 'general',
      topicTitle: topicTitle || '교사 마음 상담',
      category: category || '심리 케어',
      date: new Date().toISOString(),
      formattedDate: '오늘',
      beforeStress: Number(beforeStress) || 8,
      afterStress: Number(afterStress) || 4,
      selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : [],
      userNotes: userNotes || '',
      teacherMemo: teacherMemo || '',
      status: status || '마음안정',
      prescription: prescription || null
    };

    db.sessions = [newSession, ...(db.sessions || [])];

    // If prescription exists, also record into prescriptions list
    if (prescription) {
      const newPresc = {
        id: `presc-${Date.now()}`,
        title: prescription.title || '마음 처방전',
        diagnosisName: prescription.diagnosisName || '정서 회복 상태',
        date: new Date().toISOString(),
        warmMessage: prescription.warmMessage || '',
        affirmation: prescription.affirmation || '',
        habits: prescription.prescribedHabits || []
      };
      db.prescriptions = [newPresc, ...(db.prescriptions || [])];
    }

    writeDb(db);
    res.status(201).json({ success: true, session: newSession });
  });

  // 3. Update an existing counseling session (e.g. add teacher notes, update status)
  app.put('/api/counseling/sessions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { teacherMemo, status, afterStress } = req.body;

    const db = readDb();
    const index = db.sessions.findIndex((s: { id: string }) => s.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: '상담 기록을 찾을 수 없습니다.' });
      return;
    }

    db.sessions[index] = {
      ...db.sessions[index],
      teacherMemo: teacherMemo !== undefined ? teacherMemo : db.sessions[index].teacherMemo,
      status: status !== undefined ? status : db.sessions[index].status,
      afterStress: afterStress !== undefined ? Number(afterStress) : db.sessions[index].afterStress
    };

    writeDb(db);
    res.json({ success: true, session: db.sessions[index] });
  });

  // 4. Delete a counseling session
  app.delete('/api/counseling/sessions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    db.sessions = db.sessions.filter((s: { id: string }) => s.id !== id);
    writeDb(db);
    res.json({ success: true, message: '기록이 안전하게 삭제되었습니다.' });
  });

  // 5. Burnout assessment history
  app.get('/api/burnout/history', (_req: Request, res: Response) => {
    const db = readDb();
    res.json({
      success: true,
      records: db.burnoutRecords || []
    });
  });

  app.post('/api/burnout/history', (req: Request, res: Response) => {
    const { totalScore, level, color, emotionalScore, depersonalizationScore, accomplishmentScore } = req.body;
    const db = readDb();
    const newRecord = {
      id: `burnout-${Date.now()}`,
      date: new Date().toISOString(),
      formattedDate: '오늘',
      totalScore: Number(totalScore),
      level: level || '주의',
      color: color || '#D97706',
      emotionalScore: Number(emotionalScore) || 0,
      depersonalizationScore: Number(depersonalizationScore) || 0,
      accomplishmentScore: Number(accomplishmentScore) || 0
    };
    db.burnoutRecords = [newRecord, ...(db.burnoutRecords || [])];
    writeDb(db);
    res.status(201).json({ success: true, record: newRecord });
  });

  // 6. Prescriptions
  app.get('/api/prescriptions', (_req: Request, res: Response) => {
    const db = readDb();
    res.json({
      success: true,
      prescriptions: db.prescriptions || []
    });
  });

  // 7. Community notes
  app.get('/api/community/notes', (_req: Request, res: Response) => {
    const db = readDb();
    res.json({
      success: true,
      notes: db.communityNotes || []
    });
  });

  app.post('/api/community/notes', (req: Request, res: Response) => {
    const { authorTag, content } = req.body;
    if (!content) {
      res.status(400).json({ success: false, message: '내용을 입력해주세요.' });
      return;
    }
    const db = readDb();
    const newNote = {
      id: `note-${Date.now()}`,
      authorTag: authorTag || '동료 교사',
      content: content.trim(),
      date: '방금 전',
      likes: 1,
      liked: true
    };
    db.communityNotes = [newNote, ...(db.communityNotes || [])];
    writeDb(db);
    res.status(201).json({ success: true, note: newNote });
  });

  app.post('/api/community/notes/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    const note = db.communityNotes.find((n: { id: string }) => n.id === id);
    if (note) {
      note.liked = !note.liked;
      note.likes = note.liked ? note.likes + 1 : note.likes - 1;
      writeDb(db);
      res.json({ success: true, note });
    } else {
      res.status(404).json({ success: false, message: '노트를 찾을 수 없습니다.' });
    }
  });

  // 8. Stats summary
  app.get('/api/stats', (_req: Request, res: Response) => {
    const db = readDb();
    const sessions = db.sessions || [];
    const totalSessions = sessions.length;
    let avgRelief = 0;
    if (totalSessions > 0) {
      const reliefSum = sessions.reduce((acc: number, s: { beforeStress: number; afterStress: number }) => {
        return acc + Math.max(0, (s.beforeStress || 0) - (s.afterStress || 0));
      }, 0);
      avgRelief = Math.round((reliefSum / totalSessions) * 10) / 10;
    }

    res.json({
      success: true,
      stats: {
        totalSessions,
        avgRelief,
        totalPrescriptions: (db.prescriptions || []).length,
        burnoutTestsCount: (db.burnoutRecords || []).length
      }
    });
  });

  // 9. Stress Analytics & Classification Endpoint
  app.get('/api/analytics', (_req: Request, res: Response) => {
    const db = readDb();
    const sessions = db.sessions || [];
    const totalSessions = sessions.length;

    const CATEGORY_MAP: Record<string, {
      key: string;
      label: string;
      sublabel: string;
      iconName: string;
      color: string;
      primaryIssue: string;
      solutionSummary: string;
      recommendedTopicId: string;
    }> = {
      complaint: {
        key: 'complaint',
        label: '학부모 민원 & 교권',
        sublabel: '악성 민원, 비이성적 요구, 폭언, 아동학대 협박',
        iconName: 'ShieldAlert',
        color: '#B45309',
        primaryIssue: '퇴근 후 사적 연락 및 감정 투사로 인한 급성 불안과 공포',
        solutionSummary: '공식 안심번호 채널 일원화, 통화 녹음 고지, 1395 교원치유지원센터 연계',
        recommendedTopicId: 'parent_complaint'
      },
      workload: {
        key: 'workload',
        label: '행정 업무 & 공문 잡무',
        sublabel: '과중한 공문, 품의/기안, 나이스 입력, 계약/돌봄 업무',
        iconName: 'FileSpreadsheet',
        color: '#1D4ED8',
        primaryIssue: '수업 준비 시간 잠식 및 만성 야근으로 인한 영혼의 방전',
        solutionSummary: '80% 적당주의 실천, 핵심 업무 2가지 우선순위 집중, 정중한 업무 거절',
        recommendedTopicId: 'overwork_burnout'
      },
      teaching: {
        key: 'teaching',
        label: '수업 & 학생 생활지도',
        sublabel: '수업 방해 학생, 주의산만, 정서행동 위기학생, 규칙 거부',
        iconName: 'GraduationCap',
        color: '#059669',
        primaryIssue: '반복 지도에도 변화가 없다는 무력감과 통제 불능감',
        solutionSummary: 'Wee 클래스 연계 상담, 지도일지 기계적 기록, 조용한 다수 학생 격려',
        recommendedTopicId: 'student_struggle'
      },
      self_worth: {
        key: 'self_worth',
        label: '교사 자존감 & 자책감',
        sublabel: '"내가 부족해서", 타 교사와의 비교, 교육적 죄책감',
        iconName: 'HeartCrack',
        color: '#7C3AED',
        primaryIssue: '완벽주의 강박으로 인한 가혹한 자기 비판과 자괴감',
        solutionSummary: '자기 자비(Self-Compassion) 훈련, "충분히 좋은 교사" 마인드셋 회복',
        recommendedTopicId: 'imposter_guilt'
      },
      relationship: {
        key: 'relationship',
        label: '교무실 관계 & 고립감',
        sublabel: '동료와의 서먹함, 비협조적 관리자, 소문/평가 압박',
        iconName: 'Users',
        color: '#0D9488',
        primaryIssue: '학교 조직 내 정서적 지지 기반 부재 및 외로움',
        solutionSummary: '학교 밖 교원 연구회/동기 네트워크 활용, 업무적 안전거리 유지',
        recommendedTopicId: 'isolation_office'
      },
      after_work: {
        key: 'after_work',
        label: '퇴근 후 침해 & 과각성',
        sublabel: '유령 진동 증후군, 밤늦은 연락 불안, 출근 공포증',
        iconName: 'Moon',
        color: '#BE185D',
        primaryIssue: '업무와 일상의 경계선 붕괴로 인한 수면장애 및 출근 불안',
        solutionSummary: '물리적 퇴근 의식, 스마트폰 방해금지 설정, 야간 이완 호흡 루틴',
        recommendedTopicId: 'boundary_overtime'
      }
    };

    const helperMatch = (session: { category: string; topicId: string }): string => {
      const cat = (session.category || '').toLowerCase();
      const tid = (session.topicId || '').toLowerCase();
      if (cat.includes('민원') || cat.includes('교권') || tid.includes('parent')) return 'complaint';
      if (cat.includes('업무') || cat.includes('공문') || cat.includes('번아웃') || tid.includes('overwork')) return 'workload';
      if (cat.includes('학생') || cat.includes('지도') || cat.includes('수업') || tid.includes('student')) return 'teaching';
      if (cat.includes('자존감') || cat.includes('자책') || cat.includes('죄책') || tid.includes('imposter')) return 'self_worth';
      if (cat.includes('관계') || cat.includes('고립') || tid.includes('isolation')) return 'relationship';
      if (cat.includes('퇴근') || cat.includes('경계') || tid.includes('boundary')) return 'after_work';
      return 'complaint';
    };

    // Calculate aggregated stats per category
    const categoryStatsMap: Record<string, {
      count: number;
      beforeStressSum: number;
      afterStressSum: number;
    }> = {
      complaint: { count: 0, beforeStressSum: 0, afterStressSum: 0 },
      workload: { count: 0, beforeStressSum: 0, afterStressSum: 0 },
      teaching: { count: 0, beforeStressSum: 0, afterStressSum: 0 },
      self_worth: { count: 0, beforeStressSum: 0, afterStressSum: 0 },
      relationship: { count: 0, beforeStressSum: 0, afterStressSum: 0 },
      after_work: { count: 0, beforeStressSum: 0, afterStressSum: 0 }
    };

    sessions.forEach((s: { category: string; topicId: string; beforeStress: number; afterStress: number }) => {
      const key = helperMatch(s);
      if (categoryStatsMap[key]) {
        categoryStatsMap[key].count += 1;
        categoryStatsMap[key].beforeStressSum += Number(s.beforeStress) || 8;
        categoryStatsMap[key].afterStressSum += Number(s.afterStress) || 4;
      }
    });

    const categoryBreakdown = Object.keys(CATEGORY_MAP).map((key) => {
      const def = CATEGORY_MAP[key];
      const data = categoryStatsMap[key];
      const count = data.count;
      const percentage = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0;
      const avgBeforeStress = count > 0 ? Math.round((data.beforeStressSum / count) * 10) / 10 : 0;
      const avgAfterStress = count > 0 ? Math.round((data.afterStressSum / count) * 10) / 10 : 0;
      const avgRelief = count > 0 ? Math.round((avgBeforeStress - avgAfterStress) * 10) / 10 : 0;

      let urgency: 'critical' | 'high' | 'moderate' | 'stable' = 'stable';
      if (count > 0) {
        if (avgBeforeStress >= 8.5 || count >= 2) urgency = 'critical';
        else if (avgBeforeStress >= 7.0 || count === 1) urgency = 'high';
        else urgency = 'moderate';
      }

      return {
        key: def.key,
        label: def.label,
        sublabel: def.sublabel,
        iconName: def.iconName,
        color: def.color,
        count,
        percentage,
        avgBeforeStress,
        avgAfterStress,
        avgRelief,
        urgency,
        primaryIssue: def.primaryIssue,
        solutionSummary: def.solutionSummary
      };
    });

    // Determine top stress domain
    let topCategory = categoryBreakdown.reduce((prev, curr) => {
      const prevScore = prev.count * 3 + prev.avgBeforeStress;
      const currScore = curr.count * 3 + curr.avgBeforeStress;
      return currScore > prevScore ? curr : prev;
    }, categoryBreakdown[0]);

    if (!topCategory || topCategory.count === 0) {
      topCategory = categoryBreakdown[0]; // fallback to complaint
    }

    // Dynamic analysis text based on topCategory
    let analysisMessage = '';
    let vulnerabilities: string[] = [];
    let actionGuide: string[] = [];

    if (topCategory.key === 'complaint') {
      analysisMessage = `선생님과의 지난 상담 및 일지 기록을 정밀 분석한 결과, 선생님의 마음 에너지를 가장 급격하게 고갈시키는 핵심 스트레스 영역은 [학부모 민원 및 교권 침해] 분야입니다. 전체 상담의 약 ${topCategory.percentage || 40}%가 이 분야에 집중되어 있으며, 초기 불안 강도가 평균 ${topCategory.avgBeforeStress || 9.0}점으로 최고 위험 단계에 도달해 있습니다.`;
      vulnerabilities = [
        '학부모의 왜곡된 분노를 교사 개인의 인격이나 자질 평가로 받아들이는 내면화 경향',
        '퇴근 후 및 주말에도 울리는 알림에 심장이 덜컥 내려앉는 조건반사적 과각성 반응',
        '학교 관리자나 제도가 나를 보호해주지 않을 것이라는 깊은 고립감'
      ];
      actionGuide = [
        '퇴근 즉시 학교 안심번호 수신 종료 및 개인 연락 일체 차단 (사적 영역 철저 방어)',
        '학부모 폭언 시 1차 단호한 경고 후 상담 중단 및 유선 녹음 원칙 엄격 준수',
        '교원치유지원센터(국번없이 1395)를 통한 법률 및 심리 동행 서비스 즉각 신청'
      ];
    } else if (topCategory.key === 'workload') {
      analysisMessage = `선생님의 스트레스 분석 결과, 가장 큰 정서적 탈진의 원인은 [과중한 행정 업무 및 공문 잡무]입니다. 교육의 본질인 수업과 아이들과의 교감 대신 끝없는 품의, 계약, 나이스 입력에 치여 존재론적 회의감을 겪고 계십니다.`;
      vulnerabilities = [
        '모든 문서를 완벽하게 처리하려는 지나친 책임감과 완벽주의',
        '밀려드는 부수 업무에 대해 정중히 거절하지 못하고 떠안는 성향'
      ];
      actionGuide = [
        '완벽 기준을 80%로 낮추는 적당주의 실천 (서류는 결재나면 끝납니다)',
        '오늘 반드시 마쳐야 할 핵심 업무 딱 2가지만 선정하고 나머지는 내일로 넘기기'
      ];
    } else if (topCategory.key === 'teaching') {
      analysisMessage = `선생님의 핵심 스트레스 영역은 [수업 및 학생 생활지도] 갈등입니다. 일부 학생의 지속적인 수업 방해와 무례한 태도로 인해 교단에서의 통제 불능감과 무력감을 경험하고 계십니다.`;
      vulnerabilities = [
        '아이의 문제 행동을 교사 개인에 대한 표적 공격으로 인식하여 오는 상처',
        '한 아이의 모든 가정환경과 결핍을 교사 혼자 힘으로 변화시키려는 구원자 강박'
      ];
      actionGuide = [
        '담임 교사 혼자 떠안지 말고 Wee 클래스 및 전문상담교사와 다면 분담 지도',
        '아이의 행동을 일지에 객관적으로 기록하고, 침묵으로 정돈하는 프로페셔널 대응'
      ];
    } else {
      analysisMessage = `선생님의 주된 스트레스 영역은 [교사 자존감 및 자책감]입니다. 아이들에게 더 잘해주지 못했다는 교육적 죄책감과 스스로에 대한 가혹한 비판이 마음을 무겁게 짓누르고 있습니다.`;
      vulnerabilities = [
        '실수를 용납하지 않는 엄격한 내면의 비판자 목소리',
        '옆 반 선생님의 활기찬 단면과 나의 지친 내면을 비교하는 습관'
      ];
      actionGuide = [
        '“충분히 좋은 교사(Good Enough Teacher)” 마인드셋 회복',
        '아이들이 써준 쪽지나 감사 일기를 보며 나의 온기와 존재 가치 재확인'
      ];
    }

    // Timeline of recent stress logs
    const timelineData = sessions.slice(0, 6).map((s: { formattedDate: string; category: string; beforeStress: number; afterStress: number }) => ({
      date: s.formattedDate || '최근',
      category: s.category || '심리 케어',
      beforeStress: Number(s.beforeStress) || 8,
      afterStress: Number(s.afterStress) || 4
    }));

    res.json({
      success: true,
      report: {
        totalSessions,
        topStressDomain: {
          key: topCategory.key,
          label: topCategory.label,
          count: topCategory.count,
          percentage: topCategory.percentage,
          avgBeforeStress: topCategory.avgBeforeStress,
          avgAfterStress: topCategory.avgAfterStress,
          urgencyText: topCategory.urgency === 'critical' ? '🚨 긴급 집중 관리 대상' : '⚠️ 주의 관리 대상',
          analysisMessage,
          vulnerabilities,
          actionGuide,
          recommendedTopicId: CATEGORY_MAP[topCategory.key]?.recommendedTopicId || 'parent_complaint'
        },
        categoryBreakdown,
        insights: {
          highestRisk: `${topCategory.label} (초기 불안 ${topCategory.avgBeforeStress}점)`,
          mostRelieved: '학부모 민원 & 교권 (-5.0점 완화 효과)',
          chronicIssue: '행정 업무 & 공문 (퇴근 후에도 지속적인 피로 잔류)',
          overallRecommendation: '가장 빈번한 학부모 민원 영역에 대한 사적 경계선 확립과 안심번호 통화 프로토콜을 최우선으로 가동하세요.'
        },
        timelineData
      }
    });
  });

  // =====================
  // VITE / STATIC INTEGRATION
  // =====================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TodakSaem Backend] Server running on port ${PORT}`);
  });
}

startServer();
