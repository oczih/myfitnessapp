import express from 'express'
const router = express.Router()
import dotenv from 'dotenv'
dotenv.config()



const getFatSecretAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=basic',
  });

  const data = await response.json();
  return data.access_token; // Expires in ~2h
};

router.get('/search-food', async (req, res) => {
  const query = req.query.q || 'banana';
  try {
    const accessToken = await getFatSecretAccessToken();
    const response = await fetch(`https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${query}&format=json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from FatSecret:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

