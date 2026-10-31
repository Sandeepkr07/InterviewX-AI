import { useState } from "react";
import {
  BrainCircuit, Video, Mic, MessageSquare, ArrowRight,
  Play, Sparkles, Target, BarChart3, FileText,
  Code2, CheckCircle2, Menu, X, Zap, ShieldCheck,
  Clock, ChevronRight, Star
} from "lucide-react";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Interviews",
      desc: "Practice with intelligent AI interviewers that adapt to your answers."
    },
    {
      icon: FileText,
      title: "Resume Analysis",
      desc: "Get personalized interview questions based on your resume."
    },
    {
      icon: BarChart3,
      title: "Smart Performance",
      desc: "Understand your strengths and weaknesses with detailed reports."
    },
    {
      icon: Code2,
      title: "Coding Practice",
      desc: "Prepare for technical rounds with programming challenges."
    },
    {
      icon: Mic,
      title: "Communication Skills",
      desc: "Improve your speaking, confidence and answer delivery."
    },
    {
      icon: ShieldCheck,
      title: "Personalized Feedback",
      desc: "Get actionable suggestions after every mock interview."
    }
  ];

  const modes = [
    { icon: Video, title: "Video Interview", desc: "Face-to-face practice", tag: "Popular" },
    { icon: Mic, title: "Voice Interview", desc: "Improve communication", tag: "Flexible" },
    { icon: MessageSquare, title: "Text Interview", desc: "Practice at your pace", tag: "Easy" }
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="logo">
          <span className="logo-icon"><BrainCircuit size={25}/></span>
          <span>Interview<span className="gradient-text">X</span></span>
        </a>

<div className={`nav-links ${menuOpen ? "show" : ""}`}>
  <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>

  <a href="#modes" onClick={() => setMenuOpen(false)}>Interview Modes</a>

  <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>

  <a href="#about" onClick={() => setMenuOpen(false)}>About</a>

  <button
    className="login-btn"
    onClick={() => {
      setMenuOpen(false);
      setAuthMode("login");
    }}
  >
    Log in
  </button>

  <button
    className="primary-btn small-btn"
    onClick={() => {
      setMenuOpen(false);
      setAuthMode("signup");
    }}
  >
    Sign Up
  </button>
</div>       

        <div className="nav-actions">
          <button className="login-btn" onClick={() => setAuthMode("login")}>Log in</button>
          <button className="primary-btn small-btn" onClick={() => document.getElementById("modes").scrollIntoView({behavior:"smooth"})}>
            Get Started <ArrowRight size={16}/>
          </button>
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X/> : <Menu/>}
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <div className="announcement">
              <Sparkles size={15}/>
              <span>Meet your personal AI interview coach</span>
              <ChevronRight size={15}/>
            </div>

            <h1>
              Your Dream Job<br/>
              Starts With <span className="gradient-text">Practice.</span>
            </h1>

            <p className="hero-description">
              Experience smarter interview preparation with AI.
              Practice real-world interviews, improve your confidence,
              and get hired faster.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn" onClick={() => document.getElementById("modes").scrollIntoView({behavior:"smooth"})}>
                Start Free Interview <ArrowRight size={18}/>
              </button>
              <button className="secondary-btn" onClick={() => document.getElementById("how").scrollIntoView({behavior:"smooth"})}>
                <Play size={17}/> Explore Platform
              </button>
            </div>

            <div className="hero-trust">
              <div className="avatar-stack">
                <span>S</span><span>A</span><span>R</span><span>+</span>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <small>Built for your interview success</small>
              </div>
            </div>
          </div>

          <div className="dashboard-preview">
            <div className="preview-top">
              <div>
                <span className="live-dot"></span> LIVE INTERVIEW PREVIEW
              </div>
              <span className="preview-time"><Clock size={13}/> 12:45</span>
            </div>

            <div className="interviewer">
              <div className="ai-avatar"><BrainCircuit size={45}/></div>
              <div className="ai-label">
                <span>AI INTERVIEWER</span>
                <h3>Alex Morgan</h3>
                <p>Technical Interview Specialist</p>
              </div>
              <span className="online-dot"></span>
            </div>

            <div className="question-card">
              <span className="question-label"><Sparkles size={14}/> CURRENT QUESTION</span>
              <h3>Tell me about yourself and your experience with React.js.</h3>
              <p>Take your time. Structure your answer clearly.</p>
            </div>

            <div className="waveform">
              {Array.from({length:38}, (_,i) => (
                <span key={i} style={{height:`${12 + Math.abs(Math.sin(i*0.7))*35}px`}}></span>
              ))}
            </div>

            <div className="preview-controls">
              <button><Mic size={18}/></button>
              <button><Video size={18}/></button>
              <button className="end-call"><X size={18}/></button>
            </div>

            <div className="preview-footer">
              <span><span className="live-dot"></span> AI is listening</span>
              <span>Preview only</span>
            </div>
          </div>
        </section>

        <section className="stats">
          <div><h2>AI</h2><p>Smart Interviewer</p></div>
          <div><h2>3</h2><p>Interview Modes</p></div>
          <div><h2>24/7</h2><p>Practice Anytime</p></div>
          <div><h2>∞</h2><p>Practice Opportunities</p></div>
        </section>

        <section className="section" id="modes">
          <div className="section-heading">
            <span className="eyebrow">CHOOSE YOUR EXPERIENCE</span>
            <h2>Practice Your Way</h2>
            <p>Choose the interview style that works best for you.</p>
          </div>

          <div className="mode-grid">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div className="mode-card" key={mode.title}>
                  <span className="mode-tag">{mode.tag}</span>
                  <div className="mode-icon"><Icon size={27}/></div>
                  <h3>{mode.title}</h3>
                  <p>{mode.desc}</p>
                  <button onClick={() => alert("Interview functionality will be connected in the next development phase.")}>
                    Explore Mode <ArrowRight size={16}/>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section feature-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">POWERFUL FEATURES</span>
            <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p>One platform to prepare, practice and perform with confidence.</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon"><Icon size={23}/></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                  <span className="feature-arrow"><ArrowRight size={17}/></span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="how-section section" id="how">
          <div className="section-heading">
            <span className="eyebrow">SIMPLE PROCESS</span>
            <h2>Three Steps to Interview Success</h2>
            <p>Your journey to becoming interview-ready starts here.</p>
          </div>
          <div className="steps">
            <div className="step"><span>01</span><Target size={27}/><h3>Set Your Goal</h3><p>Select your job role, skills and experience level.</p></div>
            <div className="step"><span>02</span><MessageSquare size={27}/><h3>Start Practicing</h3><p>Answer questions with your AI-powered interviewer.</p></div>
            <div className="step"><span>03</span><BarChart3 size={27}/><h3>Improve & Grow</h3><p>Review your feedback and improve every time.</p></div>
          </div>
        </section>

        <section className="cta-section" id="about">
          <div className="cta-glow"></div>
          <Sparkles size={30}/>
          <h2>Ready to Ace Your Next Interview?</h2>
          <p>Start building confidence today. Your dream career is one practice session away.</p>
          <button className="primary-btn" onClick={() => document.getElementById("modes").scrollIntoView({behavior:"smooth"})}>
            Start Your Journey <ArrowRight size={18}/>
          </button>
        </section>
      </main>

      <footer>
        <a href="#" className="logo"><span className="logo-icon"><BrainCircuit size={23}/></span>Interview<span className="gradient-text">X</span></a>
        <p>Practice smarter. Perform better. Get hired.</p>
        <span>© 2026 InterviewX AI. Final Year Project.</span>
      </footer>

      {authMode && (
        <div className="auth-overlay">
          <div className="auth-card">
            <button className="auth-close" onClick={() => setAuthMode(null)}>×</button>

            <div className="auth-logo">
              <span className="logo-icon"><BrainCircuit size={27}/></span>
              <span>Interview<span className="gradient-text">X</span> AI</span>
            </div>

            <span className="eyebrow">YOUR AI INTERVIEW PARTNER</span>
            <h2>{authMode === "login" ? "Welcome Back!" : "Create Your Account"}</h2>
            <p className="auth-subtitle">
              {authMode === "login"
                ? "Sign in to continue your interview preparation."
                : "Start your journey towards interview success."}
            </p>

<form className="auth-form" onSubmit={async (e) => {
  e.preventDefault();
  setAuthLoading(true);
  setAuthMessage("");

  const formData = new FormData(e.currentTarget);
  const payload = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  if (authMode === "signup") {
    payload.name = formData.get("name");
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/auth/" +
      (authMode === "login" ? "login" : "register"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Authentication failed");

    if (authMode === "login") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoggedInUser(data.user);
      setAuthMode(null);
    }

    setAuthMessage(data.message);
    alert(data.message);
  } catch (error) {
    setAuthMessage(error.message);
    alert(error.message);
  } finally {
    setAuthLoading(false);
  }
}}>
{authMode === "signup" && (
  <label>
    Full Name
    <input
      name="name"
      type="text"
      placeholder="Enter your full name"
      required
    />
  </label>
)}

<label>
  Email Address
  <input
    name="email"
    type="email"
    placeholder="Enter your email"
    required
  />
</label>

<label>
  Password
  <div className="password-field">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      minLength="6"
      required
    />
    <button type="button" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</label>
              <button type="submit" className="primary-btn auth-submit">
                {authMode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={18}/>
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setShowPassword(false);
              }}>
                {authMode === "login" ? "Create Account" : "Log In"}
              </button>
            </p>

            <button className="back-home" onClick={() => setAuthMode(null)}>
              ← Back to Homepage
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App
