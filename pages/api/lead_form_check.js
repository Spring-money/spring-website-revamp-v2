import axios from "axios";

export default async function handler(req, res){

    const number = req.query.number;
    const email = req.query.email;

    const options = {
        method: 'POST',
        url: `${process.env.BASE_URL}/api/method/Get-LeadProfile-Id-If-Already-Exists`,
        headers: {
          cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        data: {phone_number: number, email_id: email}
      };


    try{
        const response = await axios(options);
        res.status(200).json(response.data);
    }  catch(error){
        console.error(error);
        res.status(500).json({message: 'Error fetching data from Frappe API'});
    }

}




