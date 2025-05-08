import axios from "axios";

export default async function handler(req, res) { 

const options = {
  method: 'GET',
  url: `${process.env.BASE_URL}/api/resource/Get%20In%20Touch%20User%20Needs`,
  params: {filters: '[["user_need_enabled","=","1"]]', fields: '["*"]'},
  headers: {
    cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
    'Content-Type': 'application/json',
    Authorization: `token ${process.env.AUTH_TOKEN}`
  }
};

try{
    const response = await axios.request(options);
    const data = response.data;
    res.status(200).json(data);
 } catch{
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
 }

}