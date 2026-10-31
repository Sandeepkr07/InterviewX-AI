const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

const router = express.Router();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function askAI(prompt) {
  try {
    const result = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 700
      }
    });

    return result.text;
  } catch (error) {
    console.error("Interview Gemini error:", error.message);
  }

  const result = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. You are a professional job interviewer."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 700
  });

  return result.choices[0].message.content;
}

function parseJSON(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

router.post("/start", async (req, res) => {
  try {
    const { role, experience, difficulty } = req.body;

    if (!role || !experience || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Role, experience and difficulty are required."
      });
    }

    const prompt = `
You are Alex Morgan, a professional ${role} interviewer.
Candidate experience: ${experience}.
Difficulty: ${difficulty}.

Start a realistic interview. Return JSON:
{
 "question": "Your first interview question",
 "greeting": "A short professional greeting"
}
Ask only one question.`;

    const data = parseJSON(await askAI(prompt));

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Interview start error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to start interview."
    });
  }
});

router.post("/answer", async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      question,
      answer,
      history = []
    } = req.body;

    if (!question || !answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required."
      });
    }

    const prompt = `
You are Alex Morgan, a professional ${role} interviewer.
Candidate experience: ${experience}.
Difficulty: ${difficulty}.

Previous interview:
${JSON.stringify(history)}

Current question: ${question}
Candidate answer: ${answer}

Evaluate the answer and continue the interview.
Return valid JSON:
{
 "feedback": "Brief constructive feedback",
 "score": 0,
 "nextQuestion": "One relevant next question"
}
Score must be from 0 to 10.`;

    const data = parseJSON(await askAI(prompt));

    res.json({
      success: true,
      feedback: data.feedback,
      score: Math.max(0, Math.min(10, Number(data.score) || 0)),
      nextQuestion: data.nextQuestion
    });
  } catch (error) {
    console.error("Interview answer error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to evaluate this answer."
    });
  }
});

router.post("/finish", async (req, res) => {
  try {
    const { role, history = [] } = req.body;

    const prompt = `
You are an interview evaluator for ${role}.
Evaluate this interview history:
${JSON.stringify(history)}

Return JSON:
{
 "overallScore": 0,
 "strengths": ["strength 1", "strength 2"],
 "improvements": ["improvement 1", "improvement 2"],
 "summary": "Short overall evaluation"
}
Score must be from 0 to 100.`;

    const data = parseJSON(await askAI(prompt));

    res.json({
      success: true,
      overallScore: Math.max(0, Math.min(100, Number(data.overallScore) || 0)),
      strengths: data.strengths || [],
      improvements: data.improvements || [],
      summary: data.summary || ""
    });
  } catch (error) {
    console.error("Interview finish error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to generate final report."
    });
  }
});

module.exports = router;
