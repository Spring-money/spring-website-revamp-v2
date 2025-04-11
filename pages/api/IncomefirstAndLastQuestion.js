import axios from "axios";

export default async function handler(req, res) {

  const form_session_token = req.query.token;


  
    const options = {
      method: 'POST',
      url: `${process.env.BASE_URL}/api/method/Income-Tax-First-And-Last-Attempted-Question`,
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      },
      data: {
        user: '',
        lead_profile_link: '',
        form_session_token: form_session_token
      }
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error making Axios request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
