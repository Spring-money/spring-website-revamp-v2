import axios from "axios";

export default async function handler(req, res){

    const options = {
      method: 'GET',
      url: `${process.env.BASE_URL}/api/resource/Credit%20Card%20Details`,
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'User-Agent': 'insomnia/9.3.2',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      }
    };

    try{
        const response = await axios.request(options);
        const data = response.data;
        res.status(200).json(data);
      } catch(error){
        console.error("error in the get all cards is", error);
        res.status(500).json({ error: 'An error occurred' });
  
    }

}


