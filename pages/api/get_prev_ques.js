import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    let requestPayload = req.body;
    // console.log("prev ques server data payload....", requestPayload);

    const response = await fetch(Api_Urls.get_previous_ques, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get next question: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
