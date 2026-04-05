'use client'
import Link from 'next/link'
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs'

export default function Navbar() {
  const { isSignedIn } = useAuth()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .nav {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #166534 0%, #0f766e 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 2px 20px rgba(15,118,110,0.25), 0 1px 4px rgba(0,0,0,0.1);
        }

        .nav-inner {
          max-width: 748px;
          margin: 0 auto;
          padding: 0 20px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 34px;
          height: 34px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          flex-shrink: 0;
          backdrop-filter: blur(4px);
        }

        .nav-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 21px;
          color: #fff;
          letter-spacing: -0.3px;
          line-height: 1;
        }

        .nav-logo-text em {
          font-style: italic;
          color: #bbf7d0;
        }

        .nav-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 5px 13px;
          font-size: 10px;
          font-weight: 600;
          color: #dcfce7;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .nav-badge-dot {
          width: 5px;
          height: 5px;
          background: #4ade80;
          border-radius: 50%;
          animation: nbdot 2.2s ease-in-out infinite;
        }

        @keyframes nbdot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.35; transform:scale(0.7); }
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sign-in-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }

        .sign-in-btn:hover {
          background: rgba(255,255,255,0.25);
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">

          <Link href="/" className="nav-logo">
            <span className="nav-logo-icon">🌱</span>
            <span className="nav-logo-text">Agro<em>Bot</em></span>
          </Link>

          <div className="nav-right">

            <span className="nav-badge">
              <span className="nav-badge-dot" />
              AI Powered
            </span>

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="sign-in-btn">Sign In</button>
              </SignInButton>
            )}

          </div>

        </div>
      </nav>
    </>
  )
}