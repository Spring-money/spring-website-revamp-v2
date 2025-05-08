
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { name } = req.query;
    const options = {
      method: 'GET',
      url: `https://uatspringmoney.frappe.cloud/api/resource/SpringTopics%20Details`,
      params: {
        filters: JSON.stringify([["std_parent_course_details", "=", "Personal Finance-English"], ["std_parent_module_details", "=", name]]),
        fields: '["*"]',
        order_by: 'std_topics_index asc'
      },
      headers: {
        cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
        Authorization: `token c94aaa32165ea3e:ee2011e98c07351`
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

