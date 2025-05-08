import axios from 'axios';

export default async function handler(req, res) {
  try {
    

    // Convert req.body to JSON format if it's not already in JSON format
    const requestBodyJSON = JSON.stringify(req.body);
    


    const apiUrl = `${process.env.BASE_URL}/api/resource/Income%20Tax%20Form%20Response`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.AUTH_TOKEN}`,
    };

    const response = await axios.post(apiUrl, requestBodyJSON, { headers });

    if (response.status === 200) {
      const responseData = response.data;
     
      res.status(200).json({ message: 'User response pushed successfully' });
    } else {
      // Handle different error scenarios
      if (response.status === 417) {
        // Server returned EXPECTATION FAILED
        const errorData = response.data;
        console.error('Server error:', errorData);
        res.status(400).json({ error: 'Failed to push user response - Mandatory fields missing' });
      } else {
        // Handle other error scenarios
        console.error('Server error:', response.status, response.statusText);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
