import { BurnoutQuestion } from '../types';

export const BURNOUT_QUESTIONS: BurnoutQuestion[] = [
  {
    id: 1,
    question: '아침에 일어날 때, 또 하루를 학교에서 마주해야 한다는 생각에 온몸이 무겁고 지칩니다.',
    subtext: '출근길 발걸음이 떨어지지 않거나 차 안에서 한숨을 푹 내쉬는 빈도',
    category: 'emotional'
  },
  {
    id: 2,
    question: '수업이나 학생 지도 후 감정적으로 완전히 털려 방전된 느낌을 받습니다.',
    subtext: '누군가 말을 걸어도 대답할 기운조차 남아있지 않은 정서적 탈진',
    category: 'emotional'
  },
  {
    id: 3,
    question: '아이들이나 학부모의 사소한 요구에도 쉽게 짜증이 나고 마음의 여유가 없습니다.',
    subtext: '이전에는 웃으며 넘겼을 일에도 속에서 불쑥 울컥하거나 화가 치미는 상태',
    category: 'emotional'
  },
  {
    id: 4,
    question: '아이들을 진심으로 사랑하고 아끼기보다 그저 "사고 없이 하루만 넘어가자"는 방어적 마음이 듭니다.',
    subtext: '교육적 열정보다 무사안일과 거리두기가 앞서는 탈인격화 경향',
    category: 'depersonalization'
  },
  {
    id: 5,
    question: '학생이나 학부모와의 관계에서 나도 모르게 차갑고 냉소적인 시선을 갖게 되었습니다.',
    subtext: '“어차피 말해봤자 안 바뀔 텐데”라며 마음의 벽을 치는 방어기제',
    category: 'depersonalization'
  },
  {
    id: 6,
    question: '과거에 비해 내가 교사로서 아이들에게 긍정적인 영향을 주고 있는지 확신이 없습니다.',
    subtext: '“내가 여기서 무얼 하고 있나”라는 교육적 효능감의 심각한 저하',
    category: 'accomplishment'
  },
  {
    id: 7,
    question: '교실에서 아이들이 떠들거나 충돌할 때, 통제할 수 없을 것 같아 공포나 무력감이 듭니다.',
    subtext: '상황을 주도적으로 이끌지 못한다는 심리적 압박감',
    category: 'accomplishment'
  },
  {
    id: 8,
    question: '끝없는 공문과 행정 업무 때문에 정작 중요한 수업 준비와 아이들 상담은 뒷전이 되어 허탈합니다.',
    subtext: '본질과 주객이 전도된 학교 환경에서 오는 회의감',
    category: 'emotional'
  },
  {
    id: 9,
    question: '퇴근 후에도 학교에서 겪었던 불쾌한 대화나 불안한 상황이 머릿속에서 계속 맴돕니다.',
    subtext: '잠자리에 누워서도 멈추지 않는 반추(Rumination)와 가슴 답답함',
    category: 'emotional'
  },
  {
    id: 10,
    question: '“차라리 교직을 그만두거나 휴직하고 싶다”는 생각이 주 2~3회 이상 자주 스쳐 지나갑니다.',
    subtext: '정신적·신체적 한계점에 도달해 도피를 갈망하는 심리',
    category: 'accomplishment'
  }
];

export interface BurnoutScoreLevel {
  level: string;
  badge: string;
  color: string;
  description: string;
  advice: string[];
}

export function getBurnoutDiagnosis(score: number): BurnoutScoreLevel {
  // Max score: 10 questions * 4 = 40 (0: 전혀 아니다 ~ 4: 항상 그렇다)
  if (score <= 12) {
    return {
      level: '안정 (초록불)',
      badge: '회복 탄력성 양호',
      color: '#059669',
      description: '선생님의 심리적 에너지는 현재 비교적 안정적인 균형을 유지하고 있습니다. 교직의 일상적인 피로는 있지만, 스스로를 보호하는 힘이 작동하고 있습니다.',
      advice: [
        '현재 가지고 계신 나만의 힐링 루틴과 취미 생활을 계속 이어가세요.',
        '아이들과 나눈 작은 보람의 순간들을 교단 일기에 기록해 두면 슬럼프가 올 때 큰 힘이 됩니다.',
        '체력 관리를 위해 가벼운 스트레칭과 규칙적인 수면 리듬을 지켜주세요.'
      ]
    };
  } else if (score <= 24) {
    return {
      level: '주의 (노란불)',
      badge: '초기 번아웃 및 정서 피로',
      color: '#D97706',
      description: '업무와 관계의 스트레스로 인해 마음의 방전이 시작되었습니다. 감정 기복이나 피로감이 잦아지고 있으니, 지금 멈추어 쉼을 채워 넣어야 할 타이밍입니다.',
      advice: [
        '“완벽하게 해내야 한다”는 높은 기준을 잠시 내려놓고 80% 완성을 목표로 삼으세요.',
        '퇴근 후 업무 연락 차단과 물리적 휴식을 철저히 지켜주세요.',
        '마음이 맞는 동료 교사나 지인에게 힘든 마음을 털어놓고 공감을 받으세요.'
      ]
    };
  } else {
    return {
      level: '위험 (빨간불)',
      badge: '고도 번아웃 및 긴급 돌봄 필요',
      color: '#DC2626',
      description: '선생님의 마음과 몸이 비명을 지르고 있습니다. 감정적 고갈과 무력감이 깊어져 혼자만의 의지로는 버티기 버거운 상태입니다. 지금 당장 공식적인 휴식과 전문적 도움이 필요합니다.',
      advice: [
        '선생님, 더 이상 혼자 참지 마세요. 병가, 연가, 또는 질병휴직을 적극 고려해 뇌와 신경계를 쉬게 해주어야 합니다.',
        '교원치유지원센터(1395) 무료 심리상담 또는 정신건강의학과/전문 심리상담센터의 조력을 받으세요.',
        '“내가 부족해서”라는 죄책감을 즉시 멈추세요. 선생님은 지극히 척박한 환경 속에서 너무 오랫동안 과중한 짐을 져왔을 뿐입니다.'
      ]
    };
  }
}
