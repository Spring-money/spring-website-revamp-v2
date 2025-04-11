// pages/api/fetchData.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { name } = req.query;
    console.log("topic name is ", name)
    const encodedTopicName = encodeURIComponent(name);

    const filters = encodeURIComponent(JSON.stringify([["std_enable_flag", "=", 1]]));

    const apiUrl = `https://uatspringmoney.frappe.cloud/api/resource/SpringTopics%20Details/${encodedTopicName}?filters=${filters}`;
    console.log("API URL:", apiUrl); // Log the constructed URL for debugging

    const options = {
      method: 'GET',
      url: apiUrl,
      headers: {
        cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
        Authorization: `token c94aaa32165ea3e:ee2011e98c07351`
      }
    };

    const response = await axios.request(options);
    const data = response.data;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

