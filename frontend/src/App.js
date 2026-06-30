import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) {
      setAnswer("Please enter a legal question.");
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
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Something went wrong. Please try again.");
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
        <h1>AI Legal Assistant</h1>
        <p className="subtitle">Ask legal questions or generate legal drafts based on Indian law.</p>

        <textarea
          placeholder="Example: Please draft a 138 NI Act Petition"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="button-group">
          <button onClick={askQuestion} disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          <button className="clear-btn" onClick={clearAll}>
            Clear
          </button>
        </div>

        <div className="answer-box">
          <div className="answer-header">
            <h3>Answer</h3>
            {answer && <button className="copy-btn" onClick={copyAnswer}>Copy</button>}
          </div>

          {loading ? (
            <p className="loading">Generating answer...</p>
          ) : (
            <pre>{answer}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;