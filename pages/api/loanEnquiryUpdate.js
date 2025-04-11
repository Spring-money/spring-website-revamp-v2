import axios from "axios";

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try{
    const responseBodyJson = JSON.stringify(req.body);
    const options = {
      
     
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.4.5',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      },
      
    };

    const url = `${process.env.BASE_URL}/api/method/fetch-loan-enquiry-update`;
    const response = await axios.post(url, responseBodyJson, options);
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      // Handle different error scenarios
      if (response.status === 417) {
        // Server returned EXPECTATION FAILED
        const errorData = response.data;
        console.error('Server error:', errorData);
        res.status(400).json({ error: 'Failed to send enquiry Id  - Mandatory fields missing' });
      } else {
        // Handle other error scenarios
        console.error('Server error:', response.status, response.statusText);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  }
  
 