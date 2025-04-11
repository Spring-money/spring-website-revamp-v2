import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Extract loan type from the request query parameters
    const loanType = req.query.loanType;

    const options = {
      method: 'GET',
      url: `${process.env.BASE_URL}/api/resource/EMI%20Calculator%20Presets`,
      params: { filters: `[["loan_type","=","${loanType}"]]`, fields: '["*"]' },
      headers: {
        cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.4.5',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      }
    };

    // Make a request to the specified API using axios
    const response = await axios.request(options);
    const data = response.data;

    // Return the data retrieved from the API
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
