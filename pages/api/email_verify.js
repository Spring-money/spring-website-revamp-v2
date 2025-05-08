import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;

    const response = await fetch(Api_Urls.email_verify, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to verify email: ${response.status} ${response.statusText}`
      );
    }

    const allQues = await response.json();
    res.status(200).json(allQues);
    // console.log('get all ques in server ...',allQues);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
