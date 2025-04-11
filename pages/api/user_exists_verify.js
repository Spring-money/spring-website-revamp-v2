import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const { or_filters } = req.query;
    let response = await fetch(
      `${Api_Urls.user_exists_verify}?or_filters=${or_filters}`,
      {
        method: "GET",
        headers: Api_Urls.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to verify user`);
    }

    response = await response.json();
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: error });
  }
}
