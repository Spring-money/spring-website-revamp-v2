import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const loanEnquiryId = req.query.loanEnquiryId

  const options = {
    method: 'PUT',
    url: `${process.env.BASE_URL}/api/resource/Loan%20Enquiry/${loanEnquiryId}`,
    headers: {
      cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/8.4.5',
      Authorization: `token ${process.env.AUTH_TOKEN}`
    },
    data: req.body
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in API call:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}