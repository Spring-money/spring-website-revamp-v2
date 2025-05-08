import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const options = {
    method: 'POST',
    url: `${process.env.BASE_URL}/api/method/iap-customer-acquisition-responses`,
    headers: {
      cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.AUTH_TOKEN}`
    },
    data: req.body
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}


