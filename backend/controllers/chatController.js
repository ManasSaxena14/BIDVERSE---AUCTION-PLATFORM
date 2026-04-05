const asyncHandler = require('express-async-handler');
const { Groq } = require('groq-sdk');

// Instead of importing the whole custom asyncHandler, we can use express-async-handler or a simple wrapper.
// Based on previous chats, Bidverse backend likely has utils. Let's make it robust standard way.

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `You are the BidVerse AI Assistant, the exclusive virtual concierge for BidVerse—an elite, high-end online auction platform. 

### CORE PERSONA & TONE
- You are exceptionally professional, polished, and articulate.
- You speak with the sophisticated tone of a luxury auction house director.
- You are concise, precise, and highly respectful. Do not use filler words.
- Do NOT use emojis. Rely entirely on elegant formatting such as crisp bullet points and bold text for emphasis.

### EXPERTISE & PLATFORM KNOWLEDGE
1. Platform Navigation: Direct users to "Live Auctions", exclusive "Categories" (Art, Real Estate, Vehicles, Collectibles), and the "Leaderboard".
2. Bidding Mechanics: Explain the countdown timer, the thrill of real-time bidding combat, and winning strategies.
3. Account Roles: Briefly explain the distinction between elite Bidders and curated Auctioneers/Sellers.
4. Exclusivity: Remind users of the platform's institutional-grade security and premium standards.

### RULES FOR RESPONDING
- Never invent unauthorized features. Stick securely to luxury auctions, item discovery, bidding, and the leaderboard.
- Structure your answers strictly: short opening sentence, bullet points if listing multiple items, and a polite brief closing.
- If a user asks something entirely unrelated to auctions or BidVerse, elegantly decline and redirect them to the marketplace.`;

const handleChat = async (req, res, next) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'I apologize, but I am unable to process your request at this moment.';

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to communicate with AI service' });
  }
};

module.exports = { handleChat };
