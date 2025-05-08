import axios from 'axios';

export default async function handler(req, res) {
  try {
    const data = new URLSearchParams();
    data.append('user', '');
    data.append('lead_profile_link', '');
    data.append('form_session_token', 'SESSTO-FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745-Windows Web-158371');

    const options = {
      method: 'POST',
      url: `${process.env.BASE_URL}/api/method/Income-Tax-Category-Based-Question-List`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `token ${process.env.AUTH_TOKEN}`
      },
      data: data.toString()
    };

    console.log('Making API request...');
    const response = await axios(options);
    console.log('API response:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
