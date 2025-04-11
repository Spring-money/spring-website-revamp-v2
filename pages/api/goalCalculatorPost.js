// api/getMonthlySavingsForGoal.js

import axios from "axios";

export default async function handler(req, res) {

    console.log("entered here")
  if (req.method === 'POST') {
    const options = {
      method: 'POST',
      url: `${process.env.BASE_URL}/api/method/getMonthlySavingsForGoal`,
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.4.5',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      },
      data: req.body // Use req.body instead of the hardcoded data
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}