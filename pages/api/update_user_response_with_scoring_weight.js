import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    // const { requestPayload } = req.body;
    const requestPayload = {
      scoring_weight: 0,
    };

    // console.log("server data payload....", requestPayload);

    const response = await fetch(
      Api_Urls.update_user_response_with_scoring_weight,
      {
        method: "PUT",
        headers: Api_Urls.headers,
        body: JSON.stringify(requestPayload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update user response with scoring weight: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
