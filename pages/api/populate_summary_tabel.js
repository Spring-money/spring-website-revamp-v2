import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;
    // console.log("server data populate summary payload json format....", requestPayload);

    const response = await fetch(Api_Urls.populate_summary_tabel, {
      method: "POST",
      headers: Api_Urls.headers,
      body: JSON.stringify(requestPayload),
    });
    console.log("summary table reponse ......", response);

    if (!response.ok) {
      throw new Error(
        `failed to get populated summary table ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log('populate summary response data ......',data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error summary table :", error); // Log error details
    res.status(500).json({ error: error });
  }
}
