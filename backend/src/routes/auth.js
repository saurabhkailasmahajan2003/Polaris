import { Webhook } from 'svix';

// Clerk webhook handler
export async function handleClerkWebhook(req, res) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { type, data } = evt;
  console.log(`Clerk webhook: ${type}`, data.id);

  res.json({ received: true });
}
