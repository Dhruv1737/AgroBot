'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

function DiseaseContent() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [listening, setListening] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    const m = searchParams.get('mode')
    if (m) setMode(m)
  }, [])

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Voice not supported in this browser. Use Chrome.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.start()
    setListening(true)
    recognition.onresult = (e) => { setText(e.results[0][0].transcript); setListening(false) }
    recognition.onerror = () => setListening(false)
    recognition.onend   = () => setListening(false)
  }

  const handleImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImage(URL.createObjectURL(file))
    setResult(null)
  }

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload  = () => res(reader.result.split(',')[1])
    reader.onerror = rej
    reader.readAsDataURL(file)
  })

  const analyze = async () => {
    if (!text.trim() && !imageFile) return
    setLoading(true); setError(null); setResult(null)
    try {
      const payload = { text }
      if (imageFile) { payload.imageBase64 = await fileToBase64(imageFile); payload.imageMime = imageFile.type }
      const res = await axios.post('/api/disease', payload)
      setResult(res.data.result)
    } catch (e) { setError(e.response?.data?.error || 'Something went wrong') }
    setLoading(false)
  }

  const clearAll = () => { setText(''); setImage(null); setImageFile(null); setResult(null); setError(null) }

  const MODES = [
    { id: 'text',  label: 'Text',  emoji: '💬' },
    { id: 'voice', label: 'Voice', emoji: '🎙️' },
    { id: 'image', label: 'Image', emoji: '🖼️' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .d-wrap {
          min-height: 100vh;
          background: #f6f5f0;
          font-family: 'DM Sans', sans-serif;
          padding: 44px 16px 72px;
          position: relative;
          overflow: hidden;
        }
        .d-wrap::before {
          content: '';
          position: fixed;
          top: -180px; right: -160px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(134,239,172,0.18) 0%, transparent 68%);
          border-radius: 50%;
          pointer-events: none;
        }
        .d-inner { width: 100%; max-width: 548px; margin: 0 auto; position: relative; z-index: 1; }

        /* ── Page header ── */
        .d-header { margin-bottom: 36px; }
        .d-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: #a1a1aa;
          text-decoration: none; margin-bottom: 18px;
          transition: color .15s;
        }
        .d-back:hover { color: #15803d; }
        .d-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px; color: #14532d;
          letter-spacing: -0.4px; line-height: 1.15;
          margin-bottom: 6px;
        }
        .d-title em { font-style: italic; color: #16a34a; }
        .d-sub { font-size: 13px; color: #71717a; font-weight: 300; }

        /* ── Mode tabs ── */
        .mode-tabs {
          display: flex; gap: 8px;
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 16px;
          padding: 5px;
          margin-bottom: 20px;
        }
        .mode-tab {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 10px 8px;
          border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background .17s, color .17s, box-shadow .17s;
          background: transparent; color: #71717a;
        }
        .mode-tab:hover { background: #f0fdf4; color: #15803d; }
        .mode-tab.sel {
          background: linear-gradient(135deg,#15803d,#0f766e);
          color: #fff;
          box-shadow: 0 2px 10px rgba(21,128,61,0.22);
        }
        .mode-tab-emoji { font-size: 15px; }

        /* ── Input card ── */
        .input-card {
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* textarea */
        .d-textarea {
          width: 100%; border: 1.5px solid #e4e4e7;
          border-radius: 14px; padding: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; color: #18181b;
          line-height: 1.6; resize: none;
          transition: border-color .17s, box-shadow .17s;
          outline: none; background: #fafaf9;
          box-sizing: border-box;
        }
        .d-textarea:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); background: #fff; }
        .d-textarea::placeholder { color: #c4c4c4; }

        /* voice */
        .voice-wrap { text-align: center; padding: 28px 0 20px; }
        .mic-btn {
          width: 84px; height: 84px; border-radius: 50%;
          border: 2.5px solid #16a34a;
          background: #f0fdf4;
          font-size: 32px; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background .17s, box-shadow .17s, transform .13s;
        }
        .mic-btn:hover { background: #dcfce7; transform: scale(1.04); }
        .mic-btn.listening {
          border-color: #ef4444; background: #fef2f2;
          box-shadow: 0 0 0 8px rgba(239,68,68,0.1);
          animation: mic-pulse 1.2s ease-in-out infinite;
        }
        @keyframes mic-pulse {
          0%,100% { box-shadow: 0 0 0 8px rgba(239,68,68,0.1); }
          50%      { box-shadow: 0 0 0 16px rgba(239,68,68,0.04); }
        }
        .voice-hint { font-size: 12.5px; color: #a1a1aa; margin-top: 12px; }
        .transcript-box {
          margin-top: 18px; padding: 14px 16px;
          background: #fafaf9; border: 1.5px solid #e4e4e7;
          border-radius: 14px; text-align: left;
        }
        .transcript-label { font-size: 10.5px; color: #a1a1aa; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 6px; }
        .transcript-text { font-size: 13.5px; color: #18181b; line-height: 1.55; }

        /* image upload */
        .drop-zone {
          border: 2px dashed #86efac; border-radius: 16px;
          padding: 40px 20px; text-align: center;
          cursor: pointer; transition: background .17s, border-color .17s;
          background: #fafaf9;
        }
        .drop-zone:hover { background: #f0fdf4; border-color: #16a34a; }
        .drop-icon { font-size: 38px; margin-bottom: 10px; }
        .drop-title { font-size: 13.5px; font-weight: 600; color: #15803d; margin-bottom: 4px; }
        .drop-sub { font-size: 11.5px; color: #a1a1aa; }
        .img-preview { position: relative; }
        .img-preview img { width: 100%; max-height: 220px; object-fit: cover; border-radius: 14px; border: 1.5px solid #bbf7d0; }
        .img-remove {
          position: absolute; top: 10px; right: 10px;
          background: rgba(0,0,0,0.55); color: #fff;
          border: none; border-radius: 999px;
          padding: 4px 10px; font-size: 11px; font-weight: 500;
          cursor: pointer; transition: background .15s;
        }
        .img-remove:hover { background: rgba(239,68,68,0.85); }
        .d-textarea-sm {
          width: 100%; margin-top: 14px;
          border: 1.5px solid #e4e4e7; border-radius: 12px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #18181b;
          resize: none; outline: none; background: #fafaf9;
          transition: border-color .17s, box-shadow .17s;
          box-sizing: border-box;
        }
        .d-textarea-sm:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); background: #fff; }
        .d-textarea-sm::placeholder { color: #c4c4c4; }

        /* ── CTA ── */
        .analyze-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg,#15803d 0%,#0f766e 100%);
          color: #fff; border: none; border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(21,128,61,0.26);
          transition: transform .13s, box-shadow .17s, opacity .17s;
          position: relative; overflow: hidden;
        }
        .analyze-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 55%);
        }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(21,128,61,0.3); }
        .analyze-btn:active:not(:disabled) { transform: translateY(0); }
        .analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error ── */
        .error-box {
          margin-top: 16px; padding: 14px 16px;
          background: #fef2f2; border: 1.5px solid #fecaca;
          border-radius: 14px; font-size: 13px; color: #dc2626;
          display: flex; align-items: flex-start; gap: 8px;
        }

        /* ── Result card ── */
        .result-card {
          margin-top: 20px; border-radius: 22px;
          border: 1.5px solid; padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .result-card.healthy { background: #f0fdf4; border-color: #bbf7d0; }
        .result-card.diseased { background: #fffbeb; border-color: #fde68a; }
        .result-card.no-plant { background: #fffbeb; border-color: #fde68a; }

        .result-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; margin-bottom: 18px;
          display: flex; align-items: center; gap: 10px;
        }
        .result-title.healthy { color: #15803d; }
        .result-title.diseased { color: #92400e; }

        .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .result-field {
          background: #fff; border-radius: 14px;
          padding: 14px 16px; border: 1.5px solid rgba(0,0,0,0.06);
        }
        .result-field.full { grid-column: 1 / -1; }
        .field-label { font-size: 10px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 5px; }
        .field-val { font-size: 13.5px; font-weight: 500; color: #18181b; line-height: 1.45; }
        .field-val.disease { color: #dc2626; }

        .prec-item {
          display: flex; gap: 10px; font-size: 13px; color: #374151;
          padding: 6px 0; border-bottom: 1px solid #f3f4f6;
          line-height: 1.5;
        }
        .prec-item:last-child { border-bottom: none; padding-bottom: 0; }
        .prec-arrow { color: #16a34a; font-size: 14px; flex-shrink: 0; margin-top: 1px; }

        /* ── Mobile Responsive ── */
        @media (max-width: 480px) {
          .d-wrap {
            padding: 28px 12px 60px;
          }

          .d-header {
            margin-bottom: 24px;
          }

          .d-title {
            font-size: 24px;
          }

          .d-sub {
            font-size: 12px;
          }

          .mode-tabs {
            gap: 5px;
            padding: 4px;
            border-radius: 13px;
            margin-bottom: 14px;
          }

          .mode-tab {
            gap: 5px;
            padding: 9px 4px;
            font-size: 12px;
            border-radius: 9px;
          }

          .mode-tab-emoji {
            font-size: 13px;
          }

          .input-card {
            padding: 16px;
            border-radius: 16px;
            margin-bottom: 12px;
          }

          .d-textarea {
            font-size: 13px;
            padding: 13px;
            border-radius: 12px;
          }

          .mic-btn {
            width: 72px;
            height: 72px;
            font-size: 28px;
          }

          .drop-zone {
            padding: 28px 16px;
          }

          .drop-icon {
            font-size: 30px;
          }

          .drop-title {
            font-size: 12.5px;
          }

          .drop-sub {
            font-size: 11px;
          }

          .d-textarea-sm {
            font-size: 12.5px;
            padding: 10px 12px;
          }

          .analyze-btn {
            padding: 14px;
            font-size: 13.5px;
            border-radius: 14px;
          }

          .result-card {
            padding: 18px;
            border-radius: 18px;
          }

          .result-title {
            font-size: 18px;
            margin-bottom: 14px;
          }

          .result-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .result-field {
            padding: 11px 12px;
            border-radius: 12px;
          }

          .field-val {
            font-size: 12.5px;
          }

          .prec-item {
            font-size: 12px;
          }
        }

        @media (max-width: 360px) {
          .d-title {
            font-size: 21px;
          }

          .mode-tab {
            font-size: 11px;
            padding: 8px 2px;
          }

          .mode-tab-emoji {
            display: none;
          }

          .result-grid {
            grid-template-columns: 1fr;
          }

          .result-field.full {
            grid-column: 1;
          }

          .result-title {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="d-wrap">
        <div className="d-inner">

          {/* Header */}
          <div className="d-header">
            <a href="/" className="d-back">← Back to home</a>
            <h1 className="d-title"><em>Disease</em> Detection 🔬</h1>
            <p className="d-sub">Describe symptoms or upload a clear plant photo</p>
          </div>

          {/* Mode tabs */}
          <div className="mode-tabs">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); clearAll() }}
                className={`mode-tab${mode === m.id ? ' sel' : ''}`}
              >
                <span className="mode-tab-emoji">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Input card */}
          <div className="input-card">

            {mode === 'text' && (
              <textarea
                className="d-textarea"
                rows={6}
                placeholder="Describe the symptoms… e.g. yellow spots on leaves, wilting, brown edges"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}

            {mode === 'voice' && (
              <div className="voice-wrap">
                <button
                  onClick={startVoice}
                  className={`mic-btn${listening ? ' listening' : ''}`}
                >
                  🎙️
                </button>
                <p className="voice-hint">{listening ? 'Listening…' : 'Click to speak'}</p>
                {text && (
                  <div className="transcript-box">
                    <div className="transcript-label">Transcript</div>
                    <div className="transcript-text">{text}</div>
                  </div>
                )}
              </div>
            )}

            {mode === 'image' && (
              <div>
                {!image ? (
                  <div className="drop-zone" onClick={() => inputRef.current?.click()}>
                    <input
                      ref={inputRef} type="file" accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImage(e.target.files[0])}
                    />
                    <div className="drop-icon">🌿</div>
                    <p className="drop-title">Click to upload plant photo</p>
                    <p className="drop-sub">JPG, PNG, WEBP supported</p>
                  </div>
                ) : (
                  <div className="img-preview">
                    <img src={image} alt="Preview" />
                    <button className="img-remove" onClick={() => { setImage(null); setImageFile(null) }}>
                      ✕ Remove
                    </button>
                  </div>
                )}
                <textarea
                  className="d-textarea-sm"
                  rows={2}
                  placeholder="Optional: add a description alongside the image"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

          </div>

          {/* Analyze button */}
          <button
            className="analyze-btn"
            onClick={analyze}
            disabled={loading || (!text.trim() && !imageFile)}
          >
            {loading ? (
              <><span className="spinner" /> Analyzing…</>
            ) : (
              <>'🔍 Analyze Plant'</>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Result */}
          {result && <ResultCard result={result} />}

        </div>
      </div>
    </>
  )
}

export default function DiseasePage() {
  return (
    <Suspense fallback={
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', fontFamily:'sans-serif', color:'#a1a1aa', fontSize:'14px' }}>
        Loading…
      </div>
    }>
      <DiseaseContent />
    </Suspense>
  )
}

function ResultCard({ result }) {
  const isNoPlant = result.trim().startsWith('NO_PLANT_DETECTED')
  const lines = result.split('\n').filter(Boolean)

  const getVal = (key) => {
    const line = lines.find(l => l.toLowerCase().startsWith(key.toLowerCase()))
    return line ? line.split(':').slice(1).join(':').trim() : '—'
  }

  const precStart  = lines.findIndex(l => l.toLowerCase().includes('precaution'))
  const notesStart = lines.findIndex(l => l.toLowerCase().includes('additional notes'))
  const precLines  = lines
    .slice(precStart + 1, notesStart > precStart ? notesStart : undefined)
    .filter(l => l.trim().startsWith('-'))

  if (isNoPlant) {
    return (
      <div className="result-card no-plant">
        <p style={{ fontWeight:600, color:'#92400e', marginBottom:6 }}>🌾 No plant detected</p>
        <p style={{ fontSize:13, color:'#78716c', lineHeight:1.55 }}>
          Please upload a clear photo of a plant or leaf, or describe symptoms in text.
        </p>
      </div>
    )
  }

  const isHealthy = getVal('Status').toLowerCase().includes('healthy')
  const cardClass = `result-card ${isHealthy ? 'healthy' : 'diseased'}`
  const titleClass = `result-title ${isHealthy ? 'healthy' : 'diseased'}`

  return (
    <div className={cardClass}>
      <div className={titleClass}>
        <span>{isHealthy ? '✅' : '⚠️'}</span>
        <span>{getVal('Plant/Crop')}</span>
      </div>

      <div className="result-grid">
        <div className="result-field">
          <div className="field-label">Status</div>
          <div className="field-val">{getVal('Status')}</div>
        </div>
        <div className="result-field">
          <div className="field-label">Severity</div>
          <div className="field-val">{getVal('Severity')}</div>
        </div>

        {getVal('Disease Name') !== '—' && getVal('Disease Name') !== 'None' && (
          <div className="result-field full">
            <div className="field-label">Disease</div>
            <div className="field-val disease">{getVal('Disease Name')}</div>
          </div>
        )}

        {getVal('Symptoms') !== '—' && (
          <div className="result-field full">
            <div className="field-label">Symptoms</div>
            <div className="field-val">{getVal('Symptoms')}</div>
          </div>
        )}
      </div>

      {precLines.length > 0 && (
        <div className="result-field" style={{ marginBottom:12 }}>
          <div className="field-label" style={{ marginBottom:10 }}>Precautions & Treatment</div>
          {precLines.map((p, i) => (
            <div key={i} className="prec-item">
              <span className="prec-arrow">→</span>
              <span>{p.replace(/^-\s*/, '')}</span>
            </div>
          ))}
        </div>
      )}

      {getVal('Additional Notes') !== '—' && (
        <div className="result-field">
          <div className="field-label">Additional Notes</div>
          <div className="field-val">{getVal('Additional Notes')}</div>
        </div>
      )}
    </div>
  )
}