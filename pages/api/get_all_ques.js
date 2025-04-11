import Api_Urls from "../../Api_Urls";
import GetHealthCheckFormId from "./Get_the_Health_Check_Form_ID_configured";

export default async function handler(req, res) {
  try {
    const { category } = req.query;
    const decodedCategory = decodeURIComponent(category);
    // console.log('selected category pages/api..', decodedCategory);
    const formType = {
      form_type: "X-RAY",
    };
    const healthCheckFormLink = await GetHealthCheckFormId(formType);

    const filters = [
      ["Financial Form Categories", "category_name", "in", decodedCategory],
      ["financial_form", "=", healthCheckFormLink],
      ["question_disabled", "=", "0"],
    ];
    const fields = ["*"];
    const order_by = "question_index asc";
    const limit_page_length = "1";

    const url = new URL(Api_Urls.get_all_ques);
    url.searchParams.append("filters", JSON.stringify(filters));
    url.searchParams.append("fields", JSON.stringify(fields));
    url.searchParams.append("order_by", order_by);
    url.searchParams.append("limit_page_length", limit_page_length);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: Api_Urls.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get all questions: ${response.status} ${response.statusText}`
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
