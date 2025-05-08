import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;
    // console.log("server data payload score table....", requestPayload);

    const response = await fetch(Api_Urls.populate_score_tabel, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `failed to get populate score table ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("populate score table response....", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
