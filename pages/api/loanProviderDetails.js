import axios from "axios";


export default async function handler (req, res){



    const options = {
        method: 'GET',
        url: `${process.env.BASE_URL}/api/resource/Loan%20Providers/LOPR-Bhanix%20Finance%20and%20Investment%20Ltd.-Public%20Sector%20Bank-22-05-2024-186669`,
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.4.5',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        }
      };

      try{
        const response = await axios.request(options)
        const data = response.data;
        res.status(200).json(data);
      } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' })
      }
}

