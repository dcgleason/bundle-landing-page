// pages/api/sendSMS.js

import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' }); // Only allow POST requests
    return;
  }

  const { to, message } = req.body;

  if (!to || !message) {
    res.status(400).json({ message: 'Missing required fields' }); // Require 'to' and 'message' fields
    return;
  }

  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const message = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: to,
    });

    res.status(200).json({ message: 'SMS sent successfully', sid: message.sid });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
}
