
import axios from 'axios';

export default async function handler(req, res) {

    console.log("reached here")
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/resource/Goal%20Calculator%20Presets`, {
      params: {
        fields: '["*"]'
      },
      headers: {
        cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.4.5',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      }
    });
    const presetValues = response.data;
    res.status(200).json(presetValues);
  } catch (error) {
    console.error('Error fetching preset values:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

