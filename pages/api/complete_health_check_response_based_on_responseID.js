import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const { responseId } = req.query;
    // const decodedCategory = decodeURIComponent(category);
    // console.log('rseponse id got in side the server before api call ..', responseId);

    const url = `${Api_Urls.complete_health_check_response_based_on_responseID}/${responseId}`;
    // console.log('url for complete respone api is..',url)

    const response = await fetch(url, {
      method: "GET",
      headers: Api_Urls.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get complete health check response by user : ${response.status} ${response.statusText}`
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

// D:\development\income-tax-calculator\pages\api\financialHealthQuestions.js
