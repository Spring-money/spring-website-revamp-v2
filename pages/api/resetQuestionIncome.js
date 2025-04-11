import axios from "axios";

export default async function handler (req, res){

  const token = req.query.sessionToken

    const options = {
        method: 'POST',
        url: `${process.env.BASE_URL}/api/method/Income-Tax-Response-Reset`,
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.6.1',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        data: {
          user: '',
          lead_profile_link: '',
          form_session_token: token
        }
      };

      try{
        const response = await axios.request(options);
        console.log(response.data);
        res.status(200).json(response.data);
      } catch(error) {
        console.error('Error making Axios request in reset', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

}



