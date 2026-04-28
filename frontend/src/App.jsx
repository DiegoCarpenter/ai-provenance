import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState, useEffect, useRef } from "react";

// ── Fonts ────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// ── Constants
const C = {
  bg: "#080B10",
  surface: "#0E1318",
  border: "#1C2333",
  gold: "#F0C040",
  goldDim: "#A07A1A",
  text: "#EDE8DC",
  muted: "#6B7280",
  mono: "'IBM Plex Mono', monospace",
  display: "'Syne', sans-serif",
};

const FAKE_HASH =
  "0xa3f5c2d1e4b7890123456789abcdef01fedcba9876543210deadbeef12345678";

const FEED_ITEMS = [
  { addr: "0x5b99...cc08", label: "ANALYSIS", time: "just now" },
  { addr: "0xbc97...e55e", label: "ANALYSIS", time: "4s ago" },
  { addr: "0xa2e1...4c01", label: "REPORT", time: "12s ago" },
  { addr: "0x3568...c5dd", label: "ANALYSIS", time: "31s ago" },
  { addr: "0x46b6...3bbb", label: "CODE", time: "1m ago" },
  { addr: "0xda95...0167", label: "ESSAY", time: "2m ago" },
  { addr: "0x75b0...79a0", label: "IMAGE PROMPT", time: "4m ago" },
  { addr: "0x5ce8...a780", label: "IMAGE PROMPT", time: "14m ago" },
];

// ── Animated hash ticker
function HashTicker() {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const dir = useRef(1);

  useEffect(() => {
    const tick = setInterval(() => {
      if (dir.current === 1) {
        idx.current = Math.min(idx.current + 1, FAKE_HASH.length);
        setDisplayed(FAKE_HASH.slice(0, idx.current));
        if (idx.current === FAKE_HASH.length) {
          setTimeout(() => {
            dir.current = -1;
          }, 2000);
        }
      } else {
        idx.current = Math.max(idx.current - 1, 0);
        setDisplayed(FAKE_HASH.slice(0, idx.current));
        if (idx.current === 0) {
          setTimeout(() => {
            dir.current = 1;
          }, 500);
        }
      }
    }, 38);
    return () => clearInterval(tick);
  }, []);

  return (
    <div
      style={{
        fontFamily: C.mono,
        fontSize: "0.82rem",
        color: C.goldDim,
        background: "rgba(240,192,64,0.06)",
        border: `1px solid rgba(240,192,64,0.15)`,
        borderRadius: "8px",
        padding: "0.6rem 1rem",
        display: "inline-block",
        minWidth: "520px",
        maxWidth: "90vw",
        wordBreak: "break-all",
        marginBottom: "1.75rem",
        textAlign: "left",
      }}
    >
      <span style={{ color: C.muted, marginRight: "0.5rem" }}>SHA-256 →</span>
      <span style={{ color: C.gold }}>{displayed}</span>
      <span style={{ animation: "blink 1s step-end infinite", color: C.gold }}>
        |
      </span>
    </div>
  );
}

// ── Spinning seal
function Seal() {
  return (
    <div
      style={{
        position: "relative",
        width: 96,
        height: 96,
        margin: "0 auto 1.5rem",
      }}
    >
      {/* Spinning ring */}
      <svg
        width="96"
        height="96"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          animation: "spin 8s linear infinite",
        }}
      >
        <circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          stroke={C.gold}
          strokeWidth="1.5"
          strokeDasharray="8 6"
          opacity="0.6"
        />
      </svg>
      {/* Inner icon */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(240,192,64,0.15) 0%, transparent 70%)`,
          border: `1px solid rgba(240,192,64,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
        }}
      >
        🔏
      </div>
    </div>
  );
}

// ── Nav
function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        height: "60px",
        background: "rgba(8,11,16,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span
        style={{
          fontFamily: C.display,
          fontSize: "1.3rem",
          color: C.gold,
          letterSpacing: "0.15em",
        }}
      >
        DIEGO
      </span>

      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {["GENERATE", "VERIFY", "EXPLORE"].map((l) => (
          <span
            key={l}
            style={{
              fontFamily: C.mono,
              fontSize: "0.75rem",
              color: C.muted,
              letterSpacing: "0.12em",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = C.gold)}
            onMouseLeave={(e) => (e.target.style.color = C.muted)}
          >
            {l}
          </span>
        ))}

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const connected = mounted && account && chain;
            return (
              <div>
                {!connected ? (
                  <button
                    onClick={openConnectModal}
                    style={{
                      fontFamily: C.mono,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      padding: "0.45rem 1.1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "rgba(240,192,64,0.1)",
                      border: `1px solid rgba(240,192,64,0.4)`,
                      color: C.gold,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(240,192,64,0.2)";
                      e.target.style.borderColor = C.gold;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(240,192,64,0.1)";
                      e.target.style.borderColor = "rgba(240,192,64,0.4)";
                    }}
                  >
                    CONNECT WALLET
                  </button>
                ) : chain.unsupported ? (
                  <button
                    onClick={openChainModal}
                    style={{
                      fontFamily: C.mono,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      padding: "0.45rem 1.1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "rgba(239,68,68,0.1)",
                      border: `1px solid rgba(239,68,68,0.4)`,
                      color: "#EF4444",
                    }}
                  >
                    WRONG NETWORK
                  </button>
                ) : (
                  <button
                    onClick={openAccountModal}
                    style={{
                      fontFamily: C.mono,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      padding: "0.45rem 1.1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "rgba(240,192,64,0.08)",
                      border: `1px solid rgba(240,192,64,0.25)`,
                      color: C.gold,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(240,192,64,0.15)";
                      e.currentTarget.style.borderColor =
                        "rgba(240,192,64,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(240,192,64,0.08)";
                      e.currentTarget.style.borderColor =
                        "rgba(240,192,64,0.25)";
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#1D9E75",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {account.displayName}
                    <span style={{ color: C.muted, fontSize: "0.7rem" }}>
                      {account.displayBalance
                        ? `· ${account.displayBalance}`
                        : ""}
                    </span>
                  </button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}

// ── Stats bar
function StatsBar({ balance }) {
  const [count, setCount] = useState(14880);
  useEffect(() => {
    const t = setInterval(
      () => setCount((c) => c + Math.floor(Math.random() * 2)),
      4000
    );
    return () => clearInterval(t);
  }, []);
  const stats = [
    { value: count.toLocaleString(), label: "DOCUMENTS NOTARIZED" },
    {
      value: balance ? `${Number(balance).toFixed(3)}` : "0.049",
      label: "ETH BALANCE",
    },
    { value: "99.97%", label: "VERIFICATION RATE" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        width: "100%",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: "1.5rem",
            textAlign: "center",
            borderRight: i < 2 ? `1px solid ${C.border}` : "none",
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontSize: "1.8rem",
              color: C.gold,
              fontWeight: "500",
              marginBottom: "0.3rem",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontFamily: C.mono,
              fontSize: "0.65rem",
              color: C.muted,
              letterSpacing: "0.12em",
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── How it works cards
function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: "✍️",
      title: "Generate",
      desc: "Prompt Claude to create any AI output — text, code, analysis, art descriptions.",
      tag: "Claude API",
    },
    {
      n: "02",
      icon: "🔐",
      title: "Notarize",
      desc: "SHA-256 hash is computed and written immutably to Ethereum. Costs ~0.001 ETH.",
      tag: "On-chain",
    },
    {
      n: "03",
      icon: "✅",
      title: "Verify",
      desc: "Anyone with the content can verify its origin, timestamp, and wallet signature.",
      tag: "Public",
    },
  ];
  return (
    <div style={{ width: "100%", padding: "4rem 2.5rem", background: C.bg }}>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: "900px",
          margin: "0 auto",
          flexWrap: "wrap",
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: "240px",
              background: i === 0 ? "rgba(240,192,64,0.08)" : C.surface,
              border: `1px solid ${
                i === 0 ? "rgba(240,192,64,0.3)" : C.border
              }`,
              borderRadius: "16px",
              padding: "1.75rem",
            }}
          >
            <div
              style={{
                fontFamily: C.mono,
                fontSize: "0.7rem",
                color: C.goldDim,
                marginBottom: "1rem",
              }}
            >
              {s.n} /
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                fontSize: "1.4rem",
                background: "rgba(240,192,64,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              {s.icon}
            </div>
            <div
              style={{
                fontFamily: C.display,
                fontSize: "1.2rem",
                color: C.text,
                marginBottom: "0.6rem",
              }}
            >
              {s.title}
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: "0.875rem",
                color: C.muted,
                lineHeight: 1.6,
                marginBottom: "1rem",
              }}
            >
              {s.desc}
            </div>
            <span
              style={{
                fontFamily: C.mono,
                fontSize: "0.7rem",
                color: C.goldDim,
                padding: "0.25rem 0.7rem",
                border: `1px solid rgba(240,192,64,0.25)`,
                borderRadius: "20px",
              }}
            >
              {s.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Live feed ────────────────────────────────────────────────────────────────
function LiveFeed() {
  const [items, setItems] = useState(FEED_ITEMS);
  useEffect(() => {
    const t = setInterval(() => {
      const labels = ["ESSAY", "CODE", "ANALYSIS", "REPORT", "IMAGE PROMPT"];
      const newItem = {
        addr:
          "0x" +
          Math.random().toString(16).slice(2, 6) +
          "..." +
          Math.random().toString(16).slice(2, 6),
        label: labels[Math.floor(Math.random() * labels.length)],
        time: "just now",
      };
      setItems((prev) => [newItem, ...prev.slice(0, 7)]);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: "100%", padding: "0 2.5rem 4rem", background: C.bg }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: C.mono,
            fontSize: "0.7rem",
            color: C.muted,
            letterSpacing: "0.15em",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          — LIVE ACTIVITY —
        </div>
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.85rem 1.25rem",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#1D9E75",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: C.mono,
                fontSize: "0.7rem",
                color: C.muted,
                letterSpacing: "0.12em",
              }}
            >
              BLOCKCHAIN EVENTS{" "}
              <span style={{ color: C.goldDim, opacity: 0.6 }}>(demo)</span>
            </span>
          </div>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                borderBottom:
                  i < items.length - 1 ? `1px solid ${C.border}` : "none",
                opacity: i === 0 ? 1 : 0.7 - i * 0.05,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.gold,
                    display: "inline-block",
                    opacity: i === 0 ? 1 : 0.4,
                  }}
                />
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: "0.8rem",
                    color: C.muted,
                  }}
                >
                  {item.addr}
                </span>
              </div>
              <div
                style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: "0.7rem",
                    color: C.goldDim,
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: "0.7rem",
                    color: C.muted,
                  }}
                >
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Try it section ───────────────────────────────────────────────────────────
function TryIt({ isConnected }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setOutput(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", padding: "0 2.5rem 5rem", background: C.bg }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: C.mono,
            fontSize: "0.7rem",
            color: C.muted,
            letterSpacing: "0.15em",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          — TRY IT NOW —
        </div>

        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "16px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: C.mono,
              fontSize: "0.7rem",
              color: C.goldDim,
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}
          >
            YOUR PROMPT TO CLAUDE
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a short summary of blockchain provenance for AI content..."
            rows={4}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              padding: "0.85rem",
              color: C.text,
              fontFamily: C.mono,
              fontSize: "0.85rem",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span
              style={{ fontFamily: C.mono, fontSize: "0.7rem", color: C.muted }}
            >
              claude-sonnet-4-5 · SHA-256 · Ethereum Sepolia
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                fontFamily: C.mono,
                fontSize: "0.8rem",
                fontWeight: "500",
                letterSpacing: "0.1em",
                padding: "0.7rem 1.5rem",
                background: loading ? "rgba(240,192,64,0.05)" : "transparent",
                color: loading ? C.muted : C.text,
                border: `1px solid ${
                  loading ? C.border : "rgba(237,232,220,0.3)"
                }`,
                borderRadius: "8px",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "GENERATING..." : "GENERATE ↗"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem 1.25rem",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              fontFamily: C.mono,
              fontSize: "0.8rem",
              color: "#EF4444",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Claude output */}
        {output && (
          <div
            style={{
              marginTop: "1rem",
              background: C.surface,
              border: `1px solid rgba(240,192,64,0.25)`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: "0.7rem",
                  color: C.goldDim,
                  letterSpacing: "0.1em",
                }}
              >
                CLAUDE OUTPUT
              </span>
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: "0.7rem",
                  color: C.muted,
                }}
              >
                ready to notarize
              </span>
            </div>
            <div
              style={{
                padding: "1.25rem",
                fontFamily: "sans-serif",
                fontSize: "0.9rem",
                color: C.text,
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}
            >
              {output.replace(/##\s+/g, "").replace(/\*\*(.*?)\*\*/g, "$1")}
            </div>
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              <button
                disabled={!isConnected}
                style={{
                  fontFamily: C.mono,
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "8px",
                  cursor: isConnected ? "pointer" : "not-allowed",
                  background: isConnected
                    ? "rgba(240,192,64,0.12)"
                    : "transparent",
                  border: `1px solid ${
                    isConnected ? "rgba(240,192,64,0.4)" : C.border
                  }`,
                  color: isConnected ? C.gold : C.muted,
                  opacity: isConnected ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                {isConnected
                  ? "NOTARIZE ON ETHEREUM ↗"
                  : "CONNECT WALLET TO NOTARIZE"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ── Main app
export default function App() {
  const { address, isConnected } = useAccount();

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: #4B5563; }
        textarea:focus { border-color: rgba(240,192,64,0.3) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <Nav />

      {/* Hero */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 2rem 3rem",
          position: "relative",
          backgroundImage: `
          linear-gradient(rgba(240,192,64,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(240,192,64,0.03) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse, rgba(240,192,64,0.07) 0%, transparent 70%)",
          }}
        />

        <Seal />

        <div
          style={{
            fontFamily: C.mono,
            fontSize: "0.7rem",
            color: C.muted,
            letterSpacing: "0.2em",
            marginBottom: "1rem",
          }}
        >
          DECENTRALIZED IMMUTABLE EVIDENCE FOR GENERATED OUTPUT
        </div>

        <h1
          style={{
            fontFamily: C.display,
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: "0.5rem",
            color: C.text,
          }}
        >
          Prove what
          <br />
          <span style={{ color: C.gold }}>AI created.</span>
        </h1>

        <p
          style={{
            fontFamily: C.mono,
            fontSize: "0.8rem",
            color: C.muted,
            letterSpacing: "0.15em",
            marginBottom: "2rem",
          }}
        >
          HASH IT. STAMP IT. OWN IT FOREVER.
        </p>

        <HashTicker />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              fontFamily: C.mono,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
              background: "transparent",
              color: C.text,
              border: `1px solid rgba(237,232,220,0.3)`,
              cursor: "pointer",
            }}
          >
            GENERATE + NOTARIZE ↗
          </button>
          <button
            style={{
              fontFamily: C.mono,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
              background: "transparent",
              color: C.muted,
              border: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
          >
            VERIFY A HASH
          </button>
        </div>

        {!isConnected && (
          <div style={{ marginTop: "2rem" }}>
            <ConnectButton />
          </div>
        )}

        <div
          style={{
            marginTop: "4rem",
            fontFamily: C.mono,
            fontSize: "0.65rem",
            color: C.muted,
            letterSpacing: "0.1em",
          }}
        >
          — HOW IT WORKS ↓ —
        </div>
      </div>

      <StatsBar />
      <HowItWorks />
      <LiveFeed />
      <TryIt isConnected={isConnected} />

      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          borderTop: `1px solid ${C.border}`,
          fontFamily: C.mono,
          fontSize: "0.65rem",
          color: C.muted,
          letterSpacing: "0.1em",
        }}
      >
        DEPLOYED ON ETHEREUM SEPOLIA · BUILT WITH SOLIDITY + REACT + CLAUDE API
      </div>
    </div>
  );
}
