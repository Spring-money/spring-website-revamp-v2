import axios from "axios";

export default async function handler(req, res){

    const ITMR_ID = req.query.id
    const options = {
        method: 'GET',
        url: `${process.env.BASE_URL}/api/resource/Income%20Tax%20Maximizer%20Report/${ITMR_ID}`,
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        }
      };
      
      try{
        const response = await axios.request(options);
        res.status(200).json(response.data);
      } catch(error){
        console.error(error);
        res.status(500).json({ error: error });
      }
}




