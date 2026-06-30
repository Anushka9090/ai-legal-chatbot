import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // const popularQuestions = [
  //   "Can my employer terminate me without notice in India?",
  //   "What should I do if I become a victim of online fraud?",
  //   "How can I file a consumer complaint in India?",
  //   "Please draft a legal notice for non-payment of salary.",
  // ];

  const askQuestion = async () => {
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a legal question.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const response = await fetch("https://ai-legal-chatbot-7m9r.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer || "No response received.");
    } catch (error) {
      setAnswer("❌ Unable to get a response. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(answer);
    alert("Answer copied!");
  };

  const clearAll = () => {
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <div className="logo">⚖️</div>
          <h1>AI Legal Assistant</h1>
          <p>Get legal information based on Indian law.</p>
          <p className="subtitle">
            Educational purposes only • Not a substitute for professional legal advice.
          </p>
        </header>

        {/* <div className="popular-section">
          <h3>Popular Questions</h3>
          <div className="chips">
            {popularQuestions.map((item, index) => (
              <button key={index} className="chip" onClick={() => setQuestion(item)}>
                {item}
              </button>
            ))}
          </div>
        </div> */}

        <label className="input-label">📝 Ask your legal question</label>

        <textarea
          placeholder="Example: Can my employer terminate me without notice in India?"
          value={question}
          maxLength={1000}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="char-count">{question.length}/1000</div>

        <div className="button-group">
          <button onClick={askQuestion} disabled={loading}>
            {loading ? "⏳ Analyzing..." : "🔍 Ask AI"}
          </button>

          <button className="clear-btn" onClick={clearAll}>
            🗑 Clear
          </button>
        </div>

        <div className="answer-box">
          <div className="answer-header">
            <h3>🤖 AI Response</h3>
            {answer && !loading && (
              <button className="copy-btn" onClick={copyAnswer}>
                📋 Copy Response
              </button>
            )}
          </div>

          {loading ? (
            <p className="loading">⏳ Analyzing Indian laws... Please wait.</p>
          ) : (
            <pre>{answer}</pre>
          )}

          {answer && !loading && (
            <div className="disclaimer">
              ⚠️ This AI assistant provides general legal information only and does not replace advice from a qualified advocate.
            </div>
          )}
        </div>

        <footer>
          Built with React • Node.js • Express • Groq AI
        </footer>
      </div>
    </div>
  );
}

export default App;