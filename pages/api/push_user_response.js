import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    let requestPayload = req.body;
    // console.log("server data push user response payload..", req.body);
    // console.log('request payLoad', requestPayload)

    const response = await fetch(Api_Urls.push_user_response, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to push user response: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log('data from push user response...',data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
