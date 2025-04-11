// pages/api/springCourseDetails.js

import axios from 'axios';

export default async function handler(req, res) {
  const options = {
    method: 'GET',
    url: `https://uatspringmoney.frappe.cloud/api/resource/SpringCourse%20Details/Personal%20Finance-English`,
    headers: {
      cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
      Authorization: `token c94aaa32165ea3e:ee2011e98c07351`
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}