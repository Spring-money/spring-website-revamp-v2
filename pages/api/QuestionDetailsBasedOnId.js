import axios from "axios";

export default async function handler(req,res) {


    const { questionId, sessionToken } = req.query;

  console.log("question id here ", questionId)
  const options = {
    method: 'POST',
    url: `${process.env.BASE_URL}/api/method/Income-Tax-Question-Details-Based-On-Id`,
    headers: {
      cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
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
    console.log("response in pages api",response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error making Axios request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
