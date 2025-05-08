import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;
    // console.log("server data payload OF SESSION TOKEN ....", req.body);

    const response = await fetch(Api_Urls.session_token, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate session token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log('session token from server side ...',data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
