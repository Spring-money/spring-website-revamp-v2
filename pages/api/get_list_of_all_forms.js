import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    let baseURL = `${process.env.BASE_URL}/api/resource/Health%20Check%20Form%20Result?fields=%5B%22name%22,%22user_name%22,%22user_email_id%22,%22phone_number%22,%20%22total_score%22,%22total_progress%22,%22health_check_user%22,%20%22health_check_lead_profile%22%5D&order_by=creation%20desc&limit_page_length=100`;
    let response = await fetch(baseURL, {
      method: "GET",
      headers: Api_Urls.headers,
    });
    response = await response.json();
    res.json(response);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: error });
  }
}

// D:\development\income-tax-calculator\pages\api\financialHealthQuestions.js
