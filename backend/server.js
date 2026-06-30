import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("Groq Key:", process.env.GROQ_API_KEY ? "YES" : "NO");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        answer: "Please enter a question.",
      });
    }

    console.log("Question:", question);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
      
          {
            role: "system",
            content: `
            You are an expert Indian Legal AI Assistant.
            Rules:
            1. Answer directly.
            2. Never start with:
            - "Note"
            - "General information"
            - "This is not legal advice"
            - "Consult a lawyer"
            3. If the user asks for a draft, petition, agreement, notice, application, affidavit, FIR, complaint, legal notice, contract, or any legal document, return ONLY the complete document in professional legal format.
            4. Use proper headings, spacing, numbering and formatting exactly like a lawyer would prepare.
            5. Do not explain the document before or after it.
            6. If placeholders are required, use:
            [Name]
            [Address]
            [Date]
            [Court Name]
            7. If the user asks a normal legal question, answer clearly in paragraphs with headings.
            8. Use clean formatting with line breaks and bold headings.
`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      answer: "AI not responding",
    });
  }
});

app.get("/", (req, res) => {
  res.send("AI Legal Assistant Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});