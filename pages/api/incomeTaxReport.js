export default async function handler(req, res) {
    try {
        // Extract data from the request body
        const data = req.body;

        // Make the API call
        const response = await fetch(`${process.env.BASE_URL}/api/resource/Income Tax Maximizer Report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${process.env.AUTH_TOKEN}`,
            },
            body: JSON.stringify(data),
        });

        // Check if the request was successful
        if (!response.ok) {
            console.log("response ", response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Extract and return the response data
        const responseData = await response.json();
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error:", error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
}