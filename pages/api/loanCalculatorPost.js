import axios from 'axios';

export default async function handler(req, res) {
    console.log('Post is working')
    if (req.method === 'POST') {
    try {
      const options = {
        method: 'POST',
        url: `${process.env.BASE_URL}/api/method/EmiCalculator`,
        headers: {
          cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.4.5',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        data: req.body
      };
      const response = await axios.request(options);

      

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
