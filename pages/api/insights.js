import axios from "axios";


export default async function handler(req, res){

  const category = req.query.category;
  const sessionToken = req.query.sessionToken;

    
    const options = {
        method: 'POST',
        url: `${process.env.BASE_URL}/api/method/Income-Tax-Insights`,
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.6.1',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        data: {
          user: '',
          category: category,
          form_session_token: sessionToken
        }
      };

      try{
        const response = await axios.request(options)
        res.status(200).json(response.data)
      } catch(error){
        console.error('Error making Axios request in insights', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

}





