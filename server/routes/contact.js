import express from 'express';
import { sendContactMessage } from '../services/emailService.js';

const router = express.Router();

// POST /api/contact — Public endpoint (no auth required)
// Receives contact form submissions and emails them to the site owner
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ message: 'Message too long (max 5000 characters)' });
    }

    // Send the email
    const result = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (result.success) {
      res.json({ message: 'Your message has been sent! We will get back to you soon.' });
    } else {
      console.error('Contact email failed:', result.error);
      res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
  } catch (error) {
    console.error('Contact route error:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

export default router;
