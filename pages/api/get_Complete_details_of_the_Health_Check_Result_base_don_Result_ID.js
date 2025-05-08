import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
    try {

        const {formlink } = req.query;
        console.log('requestPayload',formlink)
        const response = await fetch(`${Api_Urls.health_check_report_result_for_specific_user_and_health_check_form+'/'+formlink}`, {
            method: 'GET',
            headers:{ 'Authorization': `token ${process.env.AUTH_TOKEN}`,},
        })

        if (!response.ok) {
            throw new Error(`Failed to get health check report result for specific user: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
        // console.log('get all ques in server ...',data);
    } catch (error) {
        console.error('Error:', error); // Log error details
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// D:\development\income-tax-calculator\pages\api\financialHealthQuestions.js



