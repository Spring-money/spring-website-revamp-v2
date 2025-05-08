import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
    try {
        const { sessionTokenId } = req.query;

        const filters = [
            ["financial_form", "=", "FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745"],
            ["health_check_session_token", "=", sessionTokenId]
        ]
        const fields = ["name", "total_score", "financial_form", "total_progress", "last_question_attempt", "last_question_attempted_index", "health_check_user"];
        const limit_page_length = "1";

        const url = new URL(Api_Urls.health_check_report_result_for_specific_user_and_health_check_form);
        url.searchParams.append("filters", JSON.stringify(filters));
        url.searchParams.append("fields", JSON.stringify(fields));
        url.searchParams.append("limit_page_length", limit_page_length);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: Api_Urls.headers
        });

        if (!response.ok) {
            throw new Error(`Failed to get health check report result for specific user: ${response.status} ${response.statusText}`);
        }

        const allQues = await response.json();
        res.status(200).json(allQues);
        // console.log('get all ques in server ...',allQues);
    } catch (error) {
        console.error('Error:', error); // Log error details
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// D:\development\income-tax-calculator\pages\api\financialHealthQuestions.js



