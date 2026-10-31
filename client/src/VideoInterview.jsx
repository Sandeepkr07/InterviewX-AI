import { useEffect, useRef, useState } from "react";
import {
  Video, Mic, MicOff, PhoneOff, Volume2,
  BrainCircuit, Play, Send, LoaderCircle,
  CheckCircle2, ArrowLeft
} from "lucide-react";

const API = "https://interviewx-ai-ky4z.onrender.com/api/interview";

export default function VideoInterview({
  role,
  experience,
  difficulty,
  stream,
  onBack
}) {
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  const [status, setStatus] = useState("ready");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [report, setReport] = useState(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }

    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioContextRef.current?.close().catch(() => {});
      // Stream is owned by the parent setup flow.
    };
  }, [stream]);

  useEffect(() => {
    if (!stream) return;

    let analyser;
    let source;
    let context;
    let active = true;

    const setupMeter = async () => {
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        context = new AudioContextClass();
        audioContextRef.current = context;
        analyser = context.createAnalyser();
        analyser.fftSize = 256;

        source = context.createMediaStreamSource(stream);
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          if (!active) return;

          analyser.getByteFrequencyData(data);
          const average =
            data.reduce((sum, value) => sum + value, 0) / data.length;

          setMicLevel(Math.min(100, Math.round(average * 1.8)));
          animationRef.current = requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        console.error("Mic meter error:", err);
      }
    };

    setupMeter();

    return () => {
      active = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      context?.close().catch(() => {});
    };
  }, [stream]);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, experience, difficulty })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not start interview.");
      }

      setQuestion(data.question);
      setStatus("active");
      speak(`${data.greeting || "Welcome to your interview."} ${data.question}`);
    } catch (err) {
      setError(err.message || "Interview could not start.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    setError("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Try Chrome on Android or use the answer text box."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setAnswer(transcript.trim());
    };

    recognition.onerror = (event) => {
      setError(`Microphone recognition error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;

    stopListening();
    window.speechSynthesis.cancel();
    setLoading(true);
    setError("");

    const currentAnswer = answer.trim();

    try {
      const response = await fetch(`${API}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          experience,
          difficulty,
          question,
          answer: currentAnswer,
          history
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Answer evaluation failed.");
      }

      const item = {
        question,
        answer: currentAnswer,
        feedback: data.feedback,
        score: data.score
      };

      setHistory((previous) => [...previous, item]);
      setFeedback(data.feedback);
      setScore(data.score);
      setAnswer("");
      setQuestion(data.nextQuestion || "");
      speak(data.nextQuestion || "Thank you for your answer.");
    } catch (err) {
      setError(err.message || "Could not submit answer.");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = async () => {
    stopListening();
    window.speechSynthesis.cancel();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, history })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not generate report.");
      }

      setReport(data);
      setStatus("finished");
    } catch (err) {
      setError(err.message || "Report generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const leaveInterview = () => {
    stopListening();
    window.speechSynthesis.cancel();

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    onBack();
  };

  if (status === "finished" && report) {
    return (
      <div className="vi-page">
        <div className="vi-report">
          <CheckCircle2 size={48} color="#45d6a1" />
          <h1>Interview Completed!</h1>
          <p>{report.summary}</p>

          <div className="vi-final-score">
            <strong>{report.overallScore}/100</strong>
            <span>Overall Score</span>
          </div>

          <div className="vi-report-grid">
            <section>
              <h3>Strengths</h3>
              {(report.strengths || []).map((item, index) => (
                <p key={index}>✓ {item}</p>
              ))}
            </section>
            <section>
              <h3>Areas to Improve</h3>
              {(report.improvements || []).map((item, index) => (
                <p key={index}>• {item}</p>
              ))}
            </section>
          </div>

          <h3>Answer Review</h3>
          {history.map((item, index) => (
            <div className="vi-review" key={index}>
              <b>Q{index + 1}. {item.question}</b>
              <p>Your answer: {item.answer}</p>
              <p>Feedback: {item.feedback}</p>
              <b>Score: {item.score}/10</b>
            </div>
          ))}

          <button className="vi-primary" onClick={leaveInterview}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vi-page">
      <header className="vi-header">
        <button className="vi-back" onClick={leaveInterview}>
          <ArrowLeft size={18} /> Exit
        </button>
        <div className="vi-brand">
          <BrainCircuit size={23} /> InterviewX AI
        </div>
        <span className="vi-live">
          <i /> {status === "active" ? "LIVE INTERVIEW" : "READY"}
        </span>
      </header>

      <main className="vi-layout">
        <section className="vi-main">
          <div className="vi-question">
            <span>AI INTERVIEWER • ALEX MORGAN</span>
            <h2>
              {status === "ready"
                ? "Your interview is ready"
                : question}
            </h2>
            <p>
              {status === "ready"
                ? `${role} • ${experience} • ${difficulty} difficulty`
                : "Listen carefully and answer clearly."}
            </p>
            {status === "ready" ? (
              <button
                className="vi-primary"
                onClick={startInterview}
                disabled={loading}
              >
                {loading ? <LoaderCircle className="vi-spin" /> : <Play size={18} />}
                Start Interview
              </button>
            ) : (
              <button
                className="vi-speak"
                onClick={() => speak(question)}
                disabled={!question}
              >
                <Volume2 size={18} /> Repeat Question
              </button>
            )}
          </div>

          <div className="vi-cameras">
            <div className="vi-interviewer">
              <div className={`vi-avatar ${speaking ? "vi-speaking" : ""}`}>
                <BrainCircuit size={65} />
              </div>
              <h3>Alex Morgan</h3>
              <p>AI Interviewer</p>
              <span>{speaking ? "Speaking..." : "Your interviewer"}</span>
            </div>

            <div className="vi-candidate">
              <video ref={videoRef} autoPlay muted playsInline />
              <span className="vi-candidate-label">YOU</span>
            </div>
          </div>

          <div className="vi-controls">
            {listening ? (
              <button className="vi-control active" onClick={stopListening}>
                <MicOff size={20} /> Stop Mic
              </button>
            ) : (
              <button
                className="vi-control"
                onClick={startListening}
                disabled={status !== "active" || loading}
              >
                <Mic size={20} /> Speak Answer
              </button>
            )}

            <button
              className="vi-control vi-submit"
              onClick={submitAnswer}
              disabled={status !== "active" || !answer.trim() || loading}
            >
              <Send size={19} /> Submit Answer
            </button>

            <button
              className="vi-control vi-end"
              onClick={finishInterview}
              disabled={status !== "active" || loading || history.length === 0}
            >
              <PhoneOff size={19} /> End Interview
            </button>
          </div>

          <div className="vi-answer-box">
            <label>Your Answer</label>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Speak using the microphone or type your answer here..."
              rows={4}
            />
            <div className="vi-answer-footer">
              <span>{listening ? "Listening to your answer..." : "You can edit your answer before submitting."}</span>
              <button
                onClick={submitAnswer}
                disabled={status !== "active" || !answer.trim() || loading}
              >
                {loading ? "Please wait..." : "Submit"}
              </button>
            </div>
          </div>

          {error && <p className="vi-error">{error}</p>}
        </section>

        <aside className="vi-sidebar">
          <div className="vi-mic-card">
            <h3><Mic size={18} /> Microphone Test</h3>
            <p>Speak and watch the sound meter.</p>
            <div className="vi-meter">
              <span style={{ width: `${micLevel}%` }} />
            </div>
            <small>{micLevel > 3 ? "Sound detected" : "Waiting for sound..."}</small>
          </div>

          <div className="vi-feedback-card">
            <h3>Latest Feedback</h3>
            {feedback ? (
              <>
                <p>{feedback}</p>
                <strong>Answer score: {score}/10</strong>
              </>
            ) : (
              <p>Your AI feedback will appear here after your first answer.</p>
            )}
          </div>

          <div className="vi-progress">
            <h3>Interview Progress</h3>
            <strong>{history.length}</strong>
            <span>Answers evaluated</span>
          </div>

          <div className="vi-note">
            <Video size={18} />
            Your camera feed is shown locally. It is not being sent to the AI.
          </div>
        </aside>
      </main>
    </div>
  );
}
