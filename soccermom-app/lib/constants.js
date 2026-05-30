/**
 * SoccerMom (사커맘) Platform Constants
 * 광고 요금표, 커뮤니티 카테고리 등 — 형님 기존 자료 그대로.
 */

// 광고 요금표 (Ad Pricing)
export const AD_PRICING = {
  A: { label: '메인 배너 (상단)', periods: { 7: 500000, 15: 900000, 30: 1500000 } },
  B: { label: '사이드 배너', periods: { 7: 300000, 15: 550000, 30: 900000 } },
  C: { label: '분석 결과 페이지 배너', periods: { 7: 400000, 15: 700000, 30: 1200000 } },
  D: { label: '커뮤니티 피드 삽입형', periods: { 7: 200000, 15: 350000, 30: 600000 } },
  E: { label: '쇼츠 프리롤 (5초)', periods: { 7: 350000, 15: 600000, 30: 1000000 } },
  F: { label: '푸시 알림 스폰서', periods: { 7: 150000, 15: 250000, 30: 400000 } },
};

// AI 분석 요금 (Analysis Pricing)
export const ANALYSIS_PRICING = {
  individual: 3000, // 개인 분석 (원)
  team: 5000,       // 팀 분석 (원)
};

// 무료 분석 티켓
export const FREE_TICKETS = 2;

// 커뮤니티 카테고리 (Community Categories)
export const COMMUNITY_CATEGORIES = [
  { key: 'free',       label: '자유게시판',     description: '자유롭게 이야기해요' },
  { key: 'match',      label: '경기 후기',      description: '경기 리뷰 & 후기 공유' },
  { key: 'training',   label: '훈련 정보',      description: '훈련 팁 & 프로그램 공유' },
  { key: 'recruit',    label: '팀원 모집',       description: '선수·코치 모집 게시판' },
  { key: 'coaches',    label: '코치 게시판',     description: '코치 전용 (인증 필요)', requireRole: 'COACH' },
  { key: 'parents',    label: '학부모 게시판',   description: '학부모 소통 공간' },
  { key: 'equipment',  label: '장비 리뷰',      description: '축구 용품 리뷰 & 추천' },
  { key: 'notice',     label: '공지사항',       description: '운영진 공지', requireRole: 'ADMIN' },
];
