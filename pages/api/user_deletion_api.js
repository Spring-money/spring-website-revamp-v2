import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;

    let response = await fetch(Api_Urls.user_delete_request, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(`Failed`);
    }

    response = await response.json();
    res.status(200).json(response);
    // console.log('get all ques in server ...',allQues);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
