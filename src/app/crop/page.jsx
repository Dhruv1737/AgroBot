'use client'
import { useState } from 'react'
import axios from 'axios'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CropPage() {
  const [city, setCity] = useState('')
  const [month, setMonth] = useState(new Date().getMonth())
  const [weather, setWeather] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getRecommendations = async () => {
    if (!city.trim()) return
    setLoading(true); setError(null); setResult(null); setWeather(null)
    try {
      const res = await axios.post('/api/crop', { city: city.trim(), month: MONTHS[month] })
      setWeather(res.data.weather)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  const weatherItems = weather ? [
    { label: 'Temperature', value: `${Math.round(weather.temp)}°C`, emoji: '🌡️' },
    { label: 'Humidity',    value: `${weather.humidity}%`,          emoji: '💧' },
    { label: 'Condition',   value: weather.description,             emoji: '🌤️' },
    { label: 'Wind',        value: `${Math.round(weather.windSpeed)} m/s`, emoji: '🌬️' },
  ] : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .c-wrap {
          min-height: 100vh;
          background: #f6f5f0;
          font-family: 'DM Sans', sans-serif;
          padding: 44px 16px 72px;
          position: relative;
          overflow: hidden;
        }
        .c-wrap::before {
          content: '';
          position: fixed;
          top: -180px; right: -160px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 68%);
          border-radius: 50%;
          pointer-events: none;
        }
        .c-wrap::after {
          content: '';
          position: fixed;
          bottom: -140px; left: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(134,239,172,0.13) 0%, transparent 68%);
          border-radius: 50%;
          pointer-events: none;
        }
        .c-inner {
          width: 100%; max-width: 548px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .c-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: #a1a1aa;
          text-decoration: none; margin-bottom: 18px;
          transition: color .15s;
        }
        .c-back:hover { color: #0f766e; }
        .c-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px; color: #134e4a;
          letter-spacing: -0.4px; line-height: 1.15;
          margin-bottom: 6px;
        }
        .c-title em { font-style: italic; color: #0d9488; }
        .c-sub { font-size: 13px; color: #71717a; font-weight: 300; margin-bottom: 32px; }

        /* ── Form card ── */
        .form-card {
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .field-label {
          display: block;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: #a1a1aa; margin-bottom: 8px;
        }
        .c-input, .c-select {
          width: 100%;
          border: 1.5px solid #e4e4e7;
          border-radius: 12px;
          padding: 13px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; color: #18181b;
          background: #fafaf9;
          outline: none;
          transition: border-color .17s, box-shadow .17s, background .17s;
          appearance: none;
        }
        .c-input:focus, .c-select:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
          background: #fff;
        }
        .c-input::placeholder { color: #c4c4c4; }

        .select-wrap { position: relative; }
        .select-wrap::after {
          content: '▾';
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: #a1a1aa; font-size: 13px;
          pointer-events: none;
        }

        /* ── CTA ── */
        .c-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg,#0f766e 0%,#15803d 100%);
          color: #fff; border: none; border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(13,148,136,0.28);
          transition: transform .13s, box-shadow .17s;
          position: relative; overflow: hidden;
          margin-bottom: 20px;
        }
        .c-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 55%);
        }
        .c-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,148,136,0.32); }
        .c-btn:active:not(:disabled) { transform: translateY(0); }
        .c-btn:disabled { opacity: 0.45; cursor: not-allowed; }
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
          margin-bottom: 16px; padding: 14px 16px;
          background: #fef2f2; border: 1.5px solid #fecaca;
          border-radius: 14px; font-size: 13px; color: #dc2626;
          display: flex; align-items: flex-start; gap: 8px;
        }

        /* ── Weather strip ── */
        .weather-card {
          background: #fff;
          border: 1.5px solid #ccfbf1;
          border-radius: 20px;
          padding: 22px 24px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(13,148,136,0.06);
        }
        .section-label {
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #a1a1aa; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label span {
          display: inline-block;
          width: 18px; height: 2px;
          background: linear-gradient(90deg,#0d9488,#15803d);
          border-radius: 2px;
        }
        .weather-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .weather-tile {
          background: linear-gradient(135deg,#f0fdfa 0%,#f0fdf4 100%);
          border: 1.5px solid #ccfbf1;
          border-radius: 14px; padding: 14px 10px;
          text-align: center;
        }
        .weather-emoji { font-size: 20px; margin-bottom: 6px; }
        .weather-val { font-size: 13.5px; font-weight: 600; color: #134e4a; margin-bottom: 3px; }
        .weather-label { font-size: 10px; color: #5eead4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

        /* ── Summary ── */
        .summary-card {
          background: linear-gradient(135deg,#f0fdfa 0%,#f0fdf4 100%);
          border: 1.5px solid #a7f3d0;
          border-radius: 20px;
          padding: 22px 24px;
          margin-bottom: 16px;
          position: relative; overflow: hidden;
        }
        .summary-card::before {
          content: '🌱';
          position: absolute; right: 20px; top: 16px;
          font-size: 48px; opacity: 0.12;
        }
        .summary-text {
          font-size: 14px; color: #134e4a;
          line-height: 1.7; font-weight: 400;
        }

        /* ── Crop grid ── */
        .crops-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .crop-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .crop-card {
          background: #fff;
          border: 1.5px solid #e4e4e7;
          border-radius: 18px;
          padding: 20px 14px;
          text-align: center;
          transition: border-color .17s, box-shadow .17s, transform .13s;
          cursor: default;
        }
        .crop-card:hover {
          border-color: #6ee7b7;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13,148,136,0.1);
        }
        .crop-emoji { font-size: 36px; margin-bottom: 10px; display: block; }
        .crop-name { font-size: 13.5px; font-weight: 600; color: #18181b; margin-bottom: 6px; }
        .crop-reason { font-size: 11.5px; color: #a1a1aa; line-height: 1.5; }
        .crop-rank {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px;
          background: linear-gradient(135deg,#0f766e,#15803d);
          color: #fff; border-radius: 50%;
          font-size: 10px; font-weight: 700;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="c-wrap">
        <div className="c-inner">

          {/* Header */}
          <a href="/" className="c-back">← Back to home</a>
          <h1 className="c-title"><em>Crop</em> Recommendation 🌾</h1>
          <p className="c-sub">Best crops for your region and season, powered by live weather</p>

          {/* Form */}
          <div className="form-card">
            <div className="form-grid">
              <div>
                <label className="field-label">City / Region</label>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Bhopal, Nagpur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && getRecommendations()}
                />
              </div>
              <div>
                <label className="field-label">Planting Month</label>
                <div className="select-wrap">
                  <select
                    className="c-select"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            className="c-btn"
            onClick={getRecommendations}
            disabled={loading || !city.trim()}
          >
            {loading
              ? <><span className="spinner" /> Fetching recommendations…</>
              : <>🌱 Get Crop Recommendations</>
            }
          </button>

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Weather */}
          {weather && (
            <div className="weather-card">
              <div className="section-label">
                <span />
                Live Weather — {weather.city}, {weather.country}
              </div>
              <div className="weather-grid">
                {weatherItems.map((w) => (
                  <div key={w.label} className="weather-tile">
                    <div className="weather-emoji">{w.emoji}</div>
                    <div className="weather-val">{w.value}</div>
                    <div className="weather-label">{w.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <>
              {/* Summary */}
              <div className="summary-card">
                <div className="section-label" style={{ marginBottom: 12 }}>
                  <span />
                  Seasonal Insight
                </div>
                <p className="summary-text">{result.summary}</p>
              </div>

              {/* Crops */}
              <div className="section-label">
                <span />
                Recommended crops for {MONTHS[month]}
              </div>
              <div className="crop-grid">
                {result.crops?.map((crop, i) => (
                  <div key={i} className="crop-card">
                    <div className="crop-rank">{i + 1}</div>
                    <span className="crop-emoji">{crop.emoji}</span>
                    <p className="crop-name">{crop.name}</p>
                    <p className="crop-reason">{crop.reason}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}