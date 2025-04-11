import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const { category, sessionTokenId } = req.query;
    const decodedCategory = decodeURIComponent(category);
    // const decodedTokenId = decodeURIComponent(encodedTokenId);
    // console.log('selected category and token id pages/api..', decodedCategory, sessionTokenId);

    const filters = [
      ["form_session_token", "=", sessionTokenId],
      [
        "form",
        "=",
        "FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745",
      ],
      ["Financial Form Categories", "category_name", "in", decodedCategory],
    ];
    const fields = ["*"];
    const order_by = "date_time desc";
    const limit_page_length = "1";

    const url = new URL(Api_Urls.responses_posted_by_user);
    url.searchParams.append("filters", JSON.stringify(filters));
    url.searchParams.append("fields", JSON.stringify(fields));
    url.searchParams.append("order_by", order_by);
    url.searchParams.append("limit_page_length", limit_page_length);
    // console.log('url for responses posted ...',url);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: Api_Urls.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get responses posted by user : ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
    // console.log('get all response of user from server of api  in server ...',data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}
