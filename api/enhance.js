// api/enhance.js — Vercel Serverless Function
require('dotenv').config();

const axios = require('axios');

// Load keys
const API_KEYS = [
  process.env.OPENAI_PRIMARY_KEY,
  process.env.OPENAI_SECONDARY_KEY,
  process.env.OPENAI_TERTIARY_KEY
].filter(Boolean);

const PROMPTS = {
  expand: "Expand this chapter with rich descriptive details, sensory language, and deeper character insights.",
  refine: "Refine this text for professional tone, smoother flow, and stronger verbs.",
  simplify: "Simplify this chapter for clarity and accessibility while preserving core meaning.",
  dramatic: "Rewrite this chapter with heightened tension, vivid imagery, and emotional stakes."
};

const validateInput = (text, style) => {
  if (typeof text !== 'string' || typeof style !== 'string') {
    throw new Error('text and style must be strings');
  }
  if (!text.trim()) throw new Error('Text cannot be empty');
  if (text.length > 10000) throw new Error('Text too long');
  if (!PROMPTS[style]) throw new Error('Invalid style');
  return { text: text.trim(), style };
};

const maskKey = (key) => key ? `${key.substring(0,6)}...${key.slice(-4)}` : 'null';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers (Vercel doesn't auto-add these)
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (API_KEYS.length === 0) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const { text, style } = validateInput(req.body.text, req.body.style);
    const systemPrompt = PROMPTS[style];

    for (let i = 0; i < API_KEYS.length; i++) {
      const apiKey = API_KEYS[i];
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a professional book editor.' },
              { role: 'user', content: `${systemPrompt}\n\nText:\n${text}` }
            ],
            temperature: 0.7,
            max_tokens: 1000
          },
          {
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );

        const enhanced = response.data.choices?.[0]?.message?.content?.trim();
        if (enhanced) {
          return res.status(200).json({ enhanced });
        }
      } catch (error) {
        const status = error.response?.status;
        if ([401, 403, 429].includes(status)) continue; // skip bad keys
      }
    }

    res.status(502).json({ error: 'All AI keys exhausted' });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
}