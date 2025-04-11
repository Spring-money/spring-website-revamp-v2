import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { questionId, sessionToken } = req.query;



    

    const options = {
      method: 'POST',
      url: `${process.env.BASE_URL}/api/method/Previous-Question-Api`,
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.6.1',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      },
      data: {
        current_question: questionId,
        user: '',
        lead_profile_link: '',
        form_session_token: sessionToken
      }
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error making Axios request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
