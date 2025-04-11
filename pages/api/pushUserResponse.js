import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiUrl = `${process.env.BASE_URL}/api/resource/Health%20Check%20Form%20Response`;

    // Extract user response from req.body (assuming the response is available in the request body)
    const userResponse = req.body;

    const response = await axios.post(apiUrl, userResponse, {
      headers: {
        'Authorization': `token ${process.env.AUTH_TOKEN}`
        // Include 'cookie' header if required
      }
    });

    if (response.status !== 200) {
      throw new Error('Failed to push user response');
    }

    const responseData = response.data; // Process the response data if needed

    res.status(200).json({ message: 'User response pushed successfully' });
  } catch (error) {
    console.error('Error:', error); // Log error details
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
