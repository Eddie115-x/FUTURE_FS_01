// api/webhook.js - Vercel serverless function for receiving webhooks

export default async function handler(req, res) {
  // Accept only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Log the incoming webhook payload for debugging
  console.log('Received webhook:', req.body);

  // TODO: Add your custom logic here (e.g., update DB, send notification, etc.)

  // Respond quickly to acknowledge receipt
  res.status(200).json({ success: true });
}
