"use client";
// SoccerMom 커뮤니티 — 기존 자료(게시글·카테고리·광고배너·모달) 그대로 포팅.
// 의존성(framer-motion/lucide) 없이 자체 완결. 다크 테마 + 연두 액센트 유지.
import { useState } from "react";
import Link from "next/link";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";

const ACCENT = "rgb(197,255,48)";
const BG = "#0B0E0C";
const CARD = "#121614";
const BORDER = "#23282500".replace("00", "");

const INITIAL_POSTS = [
  {
    id: "post-1", category: "parents", author: "김민수 어머니", avatar: "김", time: "2시간 전",
    title: "U-12 여름 캠프 추천 부탁드립니다",
    content: "올 여름에 아이를 축구 캠프에 보내려고 하는데, 경기도 근처에서 좋은 유소년 축구 캠프가 있을까요? 아이가 GK 포지션인데 수비 조율 및 공중볼 훈련이 특화된 세션이 포함되었으면 좋겠어요. 경험 있으신 사커맘분들의 소중한 추천 부탁 기다리겠습니다!",
    likes: 24, comments: 12, views: 156,
  },
  {
    id: "post-2", category: "recruit", author: "용인FC 감독", avatar: "용", time: "5시간 전",
    title: "2026 하반기 U-12 주전 공격수 추가 모집",
    content: "용인 유나이티드 U-12 클럽에서 하반기 전국 리그를 위해 성실하고 폭발력 있는 주전 스트라이커(FW) 및 미드필더 선수를 추가 모집합니다. 주 4회 전용 구장 훈련 제공하며 장학생 혜택 지원됩니다. 텔레스트 문의는 연락주세요.",
    likes: 38, comments: 21, views: 289,
  },
  {
    id: "post-3", category: "equipment", author: "이수진 어머니", avatar: "이", time: "어제",
    title: "성장기 유소년 축구화 사이즈 고르는 노하우 공유",
    content: "아이들 발이 워낙 빨리 자라서 매번 축구화 살 때마다 고민 많으시죠? 저만의 팁은 발 사이즈보다 0.5~1cm 여유를 두고 앞코를 눌렀을 때 엄지발가락이 살짝 여유 있게 들어가는 편이 부상 예방에 좋습니다. 아디다스 콘파 라인이 발볼 넓은 아이들에게 좋네요.",
    likes: 52, comments: 8, views: 432,
  },
  {
    id: "post-4", category: "training", author: "박준호 코치", avatar: "박", time: "2일 전",
    title: "집에서 할 수 있는 유소년 볼 마스터리 기본기 5가지",
    content: "코로나 이후 훈련량이 대세가 되었듯이, 집 거실에서도 매트 한 장 깔고 매일 10분씩 할 수 있는 볼 감각 훈련 루틴입니다. 1. 발바닥 롤링, 2. 인사이드-아웃사이드 터치, 3. 발등 탭핑... 이것만 매일 연습해도 터치 정확도가 비약적으로 올라갑니다.",
    likes: 67, comments: 15, views: 521,
  },
  {
    id: "post-5", category: "free", author: "정유미 어머니", avatar: "정", time: "3일 전",
    title: "사커맘 AI 분석 처음 써봤는데요 신세계네요 ㅎㅎ",
    content: "주말 리그 시합 유튜브 중계된 거 돌려보면서 우리 아이 영상 분석 시청해봤는데 진짜 기발하네요!! 히트맵 나온 거 보니까 말날 오른쪽 구석에만 서있던 게 수치로 딱 보여서 아이한테 됱 보여서 말해주기 너무 편해졌어요. 코칭 분석 제대로 굉장히 전문적입니다.",
    likes: 45, comments: 9, views: 310,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCat, setNewCat] = useState("free");
  const [newAuthor, setNewAuthor] = useState("익명 사커맘");

  const handleLike = (e, postId) => {
    e.stopPropagation();
    setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 채워주세요!");
      return;
    }
    const newPost = {
      id: "post-" + Math.random().toString(36).substr(2, 9),
      category: newCat, author: newAuthor, avatar: newAuthor.substring(0, 1),
      time: "방금 전", title: newTitle, content: newContent,
      likes: 0, comments: 0, views: 1,
    };
    setPosts([newPost, ...posts]);
    setShowWriteModal(false);
    setNewTitle("");
    setNewContent("");
  };

  const filteredPosts = posts.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  const getCategoryLabel = (catKey) => {
    const m = COMMUNITY_CATEGORIES.find((c) => c.key === catKey);
    return m ? m.label : "자유게시판";
  };

  const catBtn = (active) => ({
    padding: "10px 12px", borderRadius: 8, fontSize: 14, textAlign: "left",
    border: "none", cursor: "pointer", transition: "all .15s",
    fontWeight: active ? 800 : 500,
    color: active ? "#000" : "#9aa0a6",
    background: active ? ACCENT : "transparent",
  });

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", padding: "32px 20px" }}>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 28, maxWidth: 1100, margin: "0 auto 28px" }}>
        <div>
          <span style={{ display: "inline-block", marginBottom: 6, padding: "3px 10px", borderRadius: 6, background: "rgba(197,255,48,0.1)", color: ACCENT, fontWeight: 900, fontSize: 11 }}>
            SOCCERMOM LOUNGE
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em", margin: 0 }}>
            학부모 &amp; 코치 커뮤니티
          </h1>
          <p style={{ color: "#9aa0a6", fontSize: 14, marginTop: 4, fontWeight: 500 }}>
            유소년 축구 훈련, 진학 상담, 축구 장비 리뷰 정보를 실시간으로 공유하고 소통하세요.
          </p>
        </div>
        <button
          onClick={() => setShowWriteModal(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, background: ACCENT, color: "#000", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 14 }}
        >
          ✏️ 새로운 글쓰기
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 3fr", gap: 24, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>
        {/* 카테고리 사이드바 */}
        <div style={{ padding: 16, background: CARD, border: "1px solid #232825", borderRadius: 12, position: "sticky", top: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: "1px solid #232825", marginTop: 0 }}>
            🏷️ CATEGORIES
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button onClick={() => setSelectedCategory("All")} style={catBtn(selectedCategory === "All")}>
              🌍 전체보기
            </button>
            {COMMUNITY_CATEGORIES.map((cat) => (
              <button key={cat.key} onClick={() => setSelectedCategory(cat.key)} style={catBtn(selectedCategory === cat.key)}>
                ⚽ {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 게시글 목록 + 인라인 광고 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <div key={post.id}>
                {/* 광고 카드 (피드 3번째 위치) */}
                {idx === 2 && (
                  <div style={{ background: "linear-gradient(135deg,#121614 0%,#0B0E0C 100%)", border: `1.8px dashed ${ACCENT}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden", marginBottom: 12 }}>
                    <span style={{ position: "absolute", top: 8, right: 12, fontSize: 8, color: ACCENT, fontWeight: 900, opacity: 0.8 }}>AD D-TYPE</span>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ fontSize: 32 }}>🏫</div>
                      <div>
                        <h4 style={{ fontSize: 13, fontWeight: 900, margin: 0 }}>
                          [ JoinKFA 연동 ] U-12 전국 유소년 축구리그 하반기 선수 등록 대진행!
                        </h4>
                        <p style={{ fontSize: 11, color: "#9aa0a6", marginTop: 4, lineHeight: 1.4, fontWeight: 500 }}>
                          대한축구협회 하반기 주니어 전국 대회 공식 차가를 위한 클럽/학교 선수 등록 기간입니다.
                        </p>
                        <a href="https://www.joinkfa.com" target="_blank" rel="noopener noreferrer"
                           style={{ color: ACCENT, fontSize: 11, fontWeight: 900, textDecoration: "underline", marginTop: 6, display: "inline-block" }}>
                          JoinKFA 공식 전산망 바로가기 →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 게시글 카드 */}
                <div onClick={() => setSelectedPost(post)} style={{ padding: 18, background: CARD, border: "1px solid #232825", borderRadius: 12, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a2f2b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                        {post.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800 }}>{post.author}</div>
                        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{post.time}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: "rgba(197,255,48,0.1)", color: ACCENT, fontWeight: 800 }}>
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 900, marginTop: 14, marginBottom: 0 }}>{post.title}</h3>
                  <p style={{ fontSize: 12, color: "#9aa0a6", lineHeight: 1.6, marginTop: 6, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.content}
                  </p>

                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280", marginTop: 14, paddingTop: 8, borderTop: "1px solid #232825" }}>
                    <button onClick={(e) => handleLike(e, post.id)} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", background: "transparent", border: "none", color: "#9aa0a6", fontWeight: 700 }}>
                      ❤️ 좋아요 {post.likes}
                    </button>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>💬 댓글 {post.comments}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>👁 조회 {post.views}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: 48, background: CARD, border: "1px solid #232825", borderRadius: 12 }}>
              <div style={{ fontSize: 40 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>이 카테고리에 등록된 글이 없습니다.</h3>
              <p style={{ color: "#9aa0a6", fontSize: 14, marginTop: 4 }}>가장 먼저 유용한 정보를 나눠어 보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 상세 모달 */}
      {selectedPost && (
        <div onClick={() => setSelectedPost(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(11,14,12,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600, width: "100%", background: CARD, padding: 28, border: `1.8px solid ${ACCENT}`, borderRadius: 16, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(197,255,48,0.1)", color: ACCENT, fontWeight: 900, fontSize: 11 }}>
                {getCategoryLabel(selectedPost.category)}
              </span>
              <button onClick={() => setSelectedPost(null)} style={{ fontSize: 24, color: "#6b7280", cursor: "pointer", background: "transparent", border: "none" }}>×</button>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginTop: 14 }}>{selectedPost.title}</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a2f2b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>{selectedPost.avatar}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{selectedPost.author}</div>
                <div style={{ fontSize: 9, color: "#6b7280" }}>{selectedPost.time}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#c8ccc9", lineHeight: 1.7, whiteSpace: "pre-line", fontWeight: 500 }}>{selectedPost.content}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <button
                onClick={(e) => { handleLike(e, selectedPost.id); setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 }); }}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #232825", background: "transparent", color: "#fff", fontWeight: 800, cursor: "pointer" }}
              >
                ❤️ 공감해요 ({selectedPost.likes})
              </button>
              <button
                onClick={() => alert("댓글 작성 기능은 모의 계정이 연동된 이후 지원됩니다.")}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: ACCENT, color: "#000", fontWeight: 800, cursor: "pointer" }}
              >
                💬 답변 달기 ({selectedPost.comments})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div onClick={() => setShowWriteModal(false)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(11,14,12,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, width: "100%", background: CARD, padding: 28, border: `1.8px solid ${ACCENT}`, borderRadius: 16, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>📝 커뮤니티 새로운 글 작성</h3>
              <button onClick={() => setShowWriteModal(false)} style={{ fontSize: 24, color: "#6b7280", cursor: "pointer", background: "transparent", border: "none" }}>×</button>
            </div>
            <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: ACCENT, fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>글 카테고리</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={inputStyle}>
                  {COMMUNITY_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>작성자 닉네임</label>
                <input type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>글 제목</label>
                <input type="text" placeholder="제목을 입력하세요" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>세부 내용</label>
                <textarea placeholder="학부모들과 나누고 싶은 유익한 질문, 장비 사용기, 훈련 경험담 등을 상세하게 남겨주세요." value={newContent} onChange={(e) => setNewContent(e.target.value)} required style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} />
              </div>
              <button type="submit" style={{ width: "100%", justifyContent: "center", fontWeight: 900, padding: "12px 0", borderRadius: 8, border: "none", background: ACCENT, color: "#000", cursor: "pointer" }}>
                글 게시하기
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>← 홈으로</Link>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", boxSizing: "border-box",
  background: "#1a1f1c", border: "1.5px solid #232825", borderRadius: 8,
  color: "#fff", fontSize: 14, fontWeight: 600,
};
