"use server";

import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const data = req.body;
    let name = JSON.parse(data).name;
    let baseURL = `${process.env.BASE_URL}/api/resource/Health Check Form Result/${name}`;
    baseURL = encodeURI(baseURL);
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
