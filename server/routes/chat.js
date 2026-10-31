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

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // First try Gemini
    try {
      console.log("Trying Gemini AI...");

      const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction:
            "You are InterviewX AI. Give accurate and concise interview preparation answers.",
          maxOutputTokens: 150,
          temperature: 0.7
        }
      });

      console.log("Gemini response successful!");

      return res.json({
        success: true,
        provider: "Gemini",
        reply: response.text
      });

    } catch (geminiError) {
      console.error("Gemini failed:", geminiError.message);
    }

    // Gemini failed, try Groq
    console.log("Trying Groq AI...");

    const groqResponse = await groq.chat.completions.create({
model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are InterviewX AI. Give accurate and concise interview preparation answers."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    console.log("Groq response successful!");

    return res.json({
      success: true,
      provider: "Groq",
      reply: groqResponse.choices[0].message.content
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI assistant is temporarily unavailable."
    });
  }
});

module.exports = router;
