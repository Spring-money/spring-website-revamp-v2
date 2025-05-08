import axios from "axios";

export default async function handler(req, res) {
  const requestBodyJSON = JSON.stringify(req.body);

  console.log("requestBodyJSON is------->", requestBodyJSON);

  const options = {
    method: 'POST',
    url: `${process.env.BASE_URL}/api/method/Populate-Affiliate-Lead-Form`,
    headers: {
      cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
      'Content-Type': 'application/json',
      Authorization: `token ${process.env.AUTH_TOKEN}`,
    },
    data: requestBodyJSON, // Correctly placing the data here
  };

  try {
    const response = await axios.request(options);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error in Populate Affiliate Lead Form API", err);
    res.status(500).json({ error: 'An error occurred' });
  }
}
