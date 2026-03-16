import { useState, useEffect, useRef, useCallback } from "react";

// ─── DONNÉES EXEMPLE ──────────────────────────────────────────────────────────
const DEMO_STORIES = [
  {
    id: 1,
    username: "AlloEcole",
    avatar: "/images/logo/fav.png",
    seen: false,
    slides: [
      {
        id: "1a",
        type: "text",
        text: "Bienvenue sur AlloEcole 👋\nDécouvre les dernières actualités, bourses et écoles en un seul endroit.",
        background:
          "linear-gradient(135deg, #f97316 0%, #ec4899 40%, #6366f1 100%)",
        color: "#ffffff",
        duration: 5000,
      },
    ],
  },
  {
    id: 2,
    username: "MENA",
    avatar: "/images/logo/ministre.png",
    seen: false,
    slides: [
      {
        id: "2a",
        type: "image",
        src: "/images/ministre.jpg",
        duration: 5000,
      },
      {
        id: "2b",
        type: "text",
        text: "Ministre de l'Education Nationale, de l'Alphabétisation et de l'Enseignement Technique.",
        background:
          "linear-gradient(135deg, #f97316 0%, #ec4899 40%, #6366f1 100%)",
        color: "#ffffff",
        duration: 5000,
      },
    ],
  },
  {
    id: 3,
    username: "marie.jpg",
    avatar: "https://i.pravatar.cc/150?img=32",
    seen: false,
    slides: [
      {
        id: "3a",
        type: "image",
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80",
        duration: 5000,
      },
      {
        id: "3b",
        type: "image",
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80",
        duration: 4000,
      },
      {
        id: "3c",
        type: "image",
        src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
        duration: 4000,
      },
    ],
  },
  {
    id: 4,
    username: "alex_photo",
    avatar: "https://i.pravatar.cc/150?img=68",
    seen: true,
    slides: [
      {
        id: "4a",
        type: "image",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
        duration: 5000,
      },
    ],
  },
  {
    id: 5,
    username: "nadia_k",
    avatar: "https://i.pravatar.cc/150?img=25",
    seen: true,
    slides: [
      {
        id: "5a",
        type: "image",
        src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80",
        duration: 5000,
      },
      {
        id: "5b",
        type: "image",
        src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
        duration: 5000,
      },
    ],
  },
];

// ─── VIEWER (fenêtre modale de lecture) ──────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose }) {
  const [userIndex, setUserIndex] = useState(startIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seenMap, setSeenMap] = useState({});

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  const currentUser = stories[userIndex];
  const currentSlide = currentUser?.slides[slideIndex];
  const duration = currentSlide?.duration ?? 5000;

  // Marquer comme vu
  useEffect(() => {
    setSeenMap((m) => ({ ...m, [currentUser.id]: true }));
  }, [userIndex, currentUser.id]);

  // Avancer au slide/user suivant
  const goNext = useCallback(() => {
    if (slideIndex < currentUser.slides.length - 1) {
      setSlideIndex((i) => i + 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else if (userIndex < stories.length - 1) {
      setUserIndex((i) => i + 1);
      setSlideIndex(0);
      setProgress(0);
      elapsedRef.current = 0;
    } else {
      onClose();
    }
  }, [slideIndex, currentUser.slides.length, userIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex((i) => i - 1);
    } else if (userIndex > 0) {
      setUserIndex((i) => i - 1);
      setSlideIndex(0);
    }
    setProgress(0);
    elapsedRef.current = 0;
  }, [slideIndex, userIndex]);

  // Barre de progression
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();

    if (paused) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = elapsedRef.current + (now - startTimeRef.current);
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        goNext();
      }
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [userIndex, slideIndex, paused]); // eslint-disable-line

  // Pause / Reprendre
  const handlePause = () => {
    if (!paused) {
      elapsedRef.current += Date.now() - startTimeRef.current;
      clearInterval(intervalRef.current);
    } else {
      startTimeRef.current = Date.now();
    }
    setPaused((p) => !p);
  };

  // Clic gauche / droit sur l'écran
  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.35) goPrev();
    else goNext();
  };

  if (!currentUser || !currentSlide) return null;

  return (
    <div style={styles.overlay}>
      {/* Carte story */}
      <div style={styles.card}>
        {/* Barres de progression */}
        <div style={styles.progressBar}>
          {currentUser.slides.map((s, i) => (
            <div key={s.id} style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width:
                    i < slideIndex
                      ? "100%"
                      : i === slideIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={styles.header}>
          <img src={currentUser.avatar} alt="" style={styles.avatarSmall} />
          <span style={styles.usernameViewer}>{currentUser.username}</span>
          <span style={styles.timeAgo}>il y a 2h</span>
          <button style={styles.iconBtn} onClick={handlePause}>
            {paused ? "▶" : "⏸"}
          </button>
          <button style={styles.iconBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Image ou slide texte */}
        {currentSlide.type === "text" ? (
          <div
            style={{
              ...styles.storyImg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 24px",
              textAlign: "center",
              whiteSpace: "pre-line",
              background:
                currentSlide.background ||
                "linear-gradient(135deg,#111827,#1f2937)",
              color: currentSlide.color || "#ffffff",
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {currentSlide.text}
          </div>
        ) : (
          <img
            src={currentSlide.src}
            alt=""
            style={styles.storyImg}
            draggable={false}
          />
        )}

        {/* Zone de tap */}
        <div style={styles.tapZone} onClick={handleTap} />

        {/* Flèches navigation user */}
        {userIndex > 0 && (
          <button
            style={{ ...styles.navArrow, left: -44 }}
            onClick={() => {
              setUserIndex((i) => i - 1);
              setSlideIndex(0);
              setProgress(0);
              elapsedRef.current = 0;
            }}
          >
            ‹
          </button>
        )}
        {userIndex < stories.length - 1 && (
          <button
            style={{ ...styles.navArrow, right: -44 }}
            onClick={() => {
              setUserIndex((i) => i + 1);
              setSlideIndex(0);
              setProgress(0);
              elapsedRef.current = 0;
            }}
          >
            ›
          </button>
        )}

        {/* Reply bar */}
        <div style={styles.replyBar}>
          <input
            style={styles.replyInput}
            placeholder={`Répondre à ${currentUser.username}…`}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          />
          <button style={styles.sendBtn}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── BUBBLE (bulle dans la liste) ────────────────────────────────────────────
function StoryBubble({ user, onClick }) {
  return (
    <button style={styles.bubble} onClick={onClick}>
      <div style={user.seen ? styles.ringGray : styles.ringGradient}>
        <img src={user.avatar} alt={user.username} style={styles.bubbleAvatar} />
      </div>
      <span style={styles.bubbleName}>{user.username}</span>
    </button>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Stories({ stories = DEMO_STORIES }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef(null);

  const openStory = (index) => {
    setStartIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      {/* Barre horizontale scrollable */}
      <div style={styles.storiesBar} ref={scrollRef}>
        {/* Bouton "Votre story" */}
        {/* <button style={styles.bubble}>
          <div style={styles.addRing}>
            <div style={styles.addInner}>
              <span style={styles.plusIcon}>+</span>
            </div>
          </div>
          <span style={styles.bubbleName}>Votre story</span>
        </button> */}

        {stories.map((user, i) => (
          <StoryBubble key={user.id} user={user} onClick={() => openStory(i)} />
        ))}
      </div>

      {/* Viewer modal */}
      {viewerOpen && (
        <StoryViewer
          stories={stories}
          startIndex={startIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  /* Barre horizontale */
  storiesBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    overflowX: "auto",
    padding: "12px 16px",
    background: "#fff",
    borderBottom: "1px solid #efefef",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  /* Bulle */
  bubble: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
    width: 66,
  },
  bubbleName: {
    fontSize: 11,
    color: "#262626",
    maxWidth: 64,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  ringGradient: {
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ringGray: {
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: "#c7c7c7",
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addRing: {
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: "#efefef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addInner: {
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #dbdbdb",
  },
  plusIcon: {
    fontSize: 24,
    color: "#0095f6",
    lineHeight: 1,
    fontWeight: 300,
  },
  bubbleAvatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
    display: "block",
  },

  /* Overlay */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Carte story */
  card: {
    position: "relative",
    width: 390,
    maxWidth: "100vw",
    height: "calc(100vh - 80px)",
    maxHeight: 844,
    borderRadius: 12,
    overflow: "hidden",
    background: "#111",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },

  storyImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },

  tapZone: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    cursor: "pointer",
  },

  /* Progress */
  progressBar: {
    position: "absolute",
    top: 10,
    left: 8,
    right: 8,
    display: "flex",
    gap: 4,
    zIndex: 10,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    background: "rgba(255,255,255,0.4)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#fff",
    borderRadius: 2,
    transition: "width 30ms linear",
  },

  /* Header */
  header: {
    position: "absolute",
    top: 22,
    left: 8,
    right: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 10,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1.5px solid #fff",
  },
  usernameViewer: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    flex: 1,
  },
  timeAgo: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
  },

  /* Navigation flèches */
  navArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontSize: 22,
    cursor: "pointer",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },

  /* Reply bar */
  replyBar: {
    position: "absolute",
    bottom: 16,
    left: 12,
    right: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 10,
  },
  replyInput: {
    flex: 1,
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: 24,
    padding: "8px 16px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "::placeholder": { color: "rgba(255,255,255,0.6)" },
  },
  sendBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
    opacity: 0.9,
  },
};