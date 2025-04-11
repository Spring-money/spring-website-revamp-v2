import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const { docName } = req.query;
    // console.log('server, quesname',quesName);
    const url = `${Api_Urls.get_ques_details_and_option_details_for_insights}/${docName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: Api_Urls.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get ques_details_and_option_details_for_insights: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
