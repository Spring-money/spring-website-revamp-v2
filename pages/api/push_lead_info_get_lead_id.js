import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;
    // console.log("server data payload....", requestPayload);

    const response = await fetch(Api_Urls.push_lead_info_get_lead_id, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to push lead info and get lead id: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
