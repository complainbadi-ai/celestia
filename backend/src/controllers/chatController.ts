
import { Request, Response } from 'express';

export const sendMessage = (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Basic auto-reply logic
  const reply =
    'Thanks for your message! I am an AI assistant. How can I help you today?';

  res.json({ reply });
};
