import Api_Urls from "../../Api_Urls";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

export default async function handler(req, res) {
  try {
    const { formlink } = req.query;
    console.log(formlink);
    const response = await fetch(`${Api_Urls.fetch_insights + formlink}`, {
      method: "GET",
      headers: { Authorization: `token ${process.env.AUTH_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
