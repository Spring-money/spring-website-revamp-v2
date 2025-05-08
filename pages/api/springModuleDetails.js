import axios from "axios";

export default async function handler(req, res) {
  const filters = encodeURIComponent(JSON.stringify([["smd_parent_course_details", "=", "Personal Finance-English"]]));
  const fields = encodeURIComponent('["*"]');
  const order_by = encodeURIComponent('smd_module_index asc');

  const options = {
    method: 'GET',
    url: `https://uatspringmoney.frappe.cloud/api/resource/SpringModule%20Details?filters=${filters}&fields=${fields}&order_by=${order_by}`,
    headers: {
      cookie: 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=',
      Authorization: `token c94aaa32165ea3e:ee2011e98c07351`
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching module details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
