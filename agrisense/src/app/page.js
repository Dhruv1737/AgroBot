'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MODULES = [
  {
    id: 'disease',
    title: 'Disease Detection',
    desc: 'Identify diseases & get treatment',
    emoji: '🔬',
    bg: 'bg-green-100',
  },
  {
    id: 'crop',
    title: 'Crop Recommendation',
    desc: 'Best crops for your region & season',
    emoji: '🌾',
    bg: 'bg-teal-100',
  },
]

const MODES = [
  { id: 'text',  label: 'Text',  emoji: '💬', desc: 'Describe the issue' },
  { id: 'voice', label: 'Voice', emoji: '🎙️', desc: 'Speak your symptoms' },
  { id: 'image', label: 'Image', emoji: '🖼️', desc: 'Upload a plant photo' },
]

export default function Home() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState('text')
  const [selectedModule, setSelectedModule] = useState('disease')

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId)
    if (modeId !== 'text') setSelectedModule('disease')
  }

  const handleModuleSelect = (moduleId) => {
    if (moduleId === 'crop' && selectedMode !== 'text') return
    setSelectedModule(moduleId)
  }

  const handleGo = () => {
    router.push(`/${selectedModule}?mode=${selectedMode}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .agro-wrap {
          min-height: 100vh;
          background: #f6f5f0;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          justify-content: center;
          padding: 52px 16px 72px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient blobs */
        .agro-wrap::before, .agro-wrap::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
        }
        .agro-wrap::before {
          width: 520px; height: 520px;
          top: -180px; right: -160px;
          background: radial-gradient(circle, rgba(134,239,172,0.2) 0%, transparent 68%);
        }
        .agro-wrap::after {
          width: 400px; height: 400px;
          bottom: -140px; left: -110px;
          background: radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 68%);
        }

        .agro-inner {
          width: 100%;
          max-width: 548px;
          position: relative;
          z-index: 1;
        }

        /* ── Hero ── */
        .hero { text-align: center; margin-bottom: 52px; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: 1px solid #bbf7d0;
          border-radius: 999px;
          padding: 5px 15px;
          font-size: 10.5px;
          font-weight: 600;
          color: #15803d;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 22px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
        }
        .pulse-dot {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pdot 2.2s ease-in-out infinite;
        }
        @keyframes pdot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: 40px;
          color: #14532d;
          line-height: 1.12;
          letter-spacing: -0.6px;
          margin-bottom: 13px;
        }
        .hero-title em { font-style: italic; color: #16a34a; }

        .hero-sub {
          font-size: 13.5px;
          color: #71717a;
          font-weight: 300;
          line-height: 1.6;
        }

        /* ── Section header ── */
        .sec-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .sec-num {
          width: 23px; height: 23px;
          background: #14532d;
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0;
        }
        .sec-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: #a1a1aa;
        }

        /* ── Divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e4e4e7 25%, #e4e4e7 75%, transparent);
          margin: 4px 0 32px;
        }

        /* ── Mode cards ── */
        .mode-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
          margin-bottom: 32px;
        }

        .mode-card {
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 18px;
          padding: 20px 10px 16px;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color .17s, box-shadow .17s, transform .13s;
        }
        .mode-card:hover {
          border-color: #86efac;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.09);
        }
        .mode-card.sel {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.11), 0 6px 20px rgba(22,163,74,0.11);
        }
        .mode-card.sel::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,#16a34a,#0d9488);
          border-radius: 0 0 16px 16px;
        }
        .mode-emoji { font-size: 28px; display: block; margin-bottom: 9px; line-height: 1; }
        .mode-name {
          font-size: 13px;
          font-weight: 600;
          color: #18181b;
          display: block;
          margin-bottom: 4px;
        }
        .mode-card.sel .mode-name { color: #15803d; }
        .mode-hint { font-size: 11px; color: #a1a1aa; line-height: 1.4; }

        /* ── Module cards ── */
        .mod-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 32px;
        }

        .mod-card {
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 20px;
          padding: 22px 20px;
          text-align: left;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color .17s, box-shadow .17s, transform .13s;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mod-card:hover:not(:disabled) {
          border-color: #86efac;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.09);
        }
        .mod-card.sel {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.11), 0 6px 20px rgba(22,163,74,0.11);
        }
        .mod-card.sel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,#16a34a,#0d9488);
          border-radius: 18px 18px 0 0;
        }
        .mod-card:disabled { opacity: 0.42; cursor: not-allowed; }

        .mod-icon {
          width: 46px; height: 46px;
          border-radius: 13px;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: background .17s;
        }
        .mod-card.sel .mod-icon { background: #dcfce7; }

        .mod-title {
          font-size: 14px;
          font-weight: 600;
          color: #18181b;
          margin-bottom: 4px;
        }
        .mod-card.sel .mod-title { color: #15803d; }
        .mod-desc { font-size: 12px; color: #a1a1aa; line-height: 1.45; }
        .mod-warn {
          font-size: 10.5px;
          font-weight: 600;
          color: #f59e0b;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .check-badge {
          position: absolute;
          top: 14px; right: 14px;
          width: 19px; height: 19px;
          background: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .check-badge::after {
          content: '';
          width: 9px; height: 5px;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(-45deg) translate(1px,-1px);
          display: block;
        }

        /* ── CTA ── */
        .cta {
          width: 100%;
          padding: 17px;
          background: linear-gradient(135deg,#15803d 0%,#0f766e 100%);
          color: #fff;
          border: none;
          border-radius: 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 22px rgba(21,128,61,0.28), 0 1px 4px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
          transition: transform .13s, box-shadow .17s, opacity .17s;
        }
        .cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,0.09) 0%,transparent 55%);
        }
        .cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(21,128,61,0.32), 0 2px 6px rgba(0,0,0,0.1);
        }
        .cta:active { transform: translateY(0); }
        .cta-arrow { font-size: 18px; transition: transform .17s; }
        .cta:hover .cta-arrow { transform: translateX(4px); }

        .footer-note {
          text-align: center;
          margin-top: 22px;
          font-size: 11px;
          color: #c4c4c4;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="agro-wrap">
        <div className="agro-inner">

          {/* Hero */}
          <div className="hero">
            <div className="hero-badge">
              <span className="pulse-dot" />
              AI Powered
            </div>
            <h1 className="hero-title">Meet <em>AgroBot</em> 🌱</h1>
            <p className="hero-sub">Plant health diagnostics & smart crop planning,<br />at your fingertips.</p>
          </div>

          {/* Step 1 */}
          <div className="sec-head">
            <span className="sec-num">1</span>
            <span className="sec-label">Pick your input method</span>
          </div>
          <div className="mode-grid">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeSelect(m.id)}
                className={`mode-card${selectedMode === m.id ? ' sel' : ''}`}
              >
                <span className="mode-emoji">{m.emoji}</span>
                <span className="mode-name">{m.label}</span>
                <span className="mode-hint">{m.desc}</span>
              </button>
            ))}
          </div>

          <div className="divider" />

          {/* Step 2 */}
          <div className="sec-head">
            <span className="sec-num">2</span>
            <span className="sec-label">What do you need help with?</span>
          </div>
          <div className="mod-grid">
            {MODULES.map((mod) => {
              const disabled = mod.id === 'crop' && selectedMode !== 'text'
              const active = selectedModule === mod.id && !disabled
              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleSelect(mod.id)}
                  disabled={disabled}
                  className={`mod-card${active ? ' sel' : ''}`}
                >
                  {active && <span className="check-badge" />}
                  <span className="mod-icon">{mod.emoji}</span>
                  <div>
                    <div className="mod-title">{mod.title}</div>
                    <div className="mod-desc">{mod.desc}</div>
                    {disabled && <div className="mod-warn">Text mode only</div>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <button className="cta" onClick={handleGo}>
            Get Started
            <span className="cta-arrow">→</span>
          </button>

          <p className="footer-note">No sign-up required · Free to use</p>

        </div>
      </div>
    </>
  )
}