import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    // Extract data from the request body
    console.log("Email verification API triggered");
    const { email_id, otp_to_be_sent, user_full_name } = req.body;

    //   // Prepare the data object
    //   const data = JSON.stringify({
    //     email_id: email_id,
    //     otp_to_be_sent: otp_to_be_sent,
    //     user_full_name: user_full_name

    //   });
    //   console.log("data is", req.body.data)
    // Make the POST request to the API
    const response = await fetch(
      `${process.env.BASE_URL}/api/method/user-deletion-request-verification-email`,
      {
        method: "POST",
        headers: Api_Urls.headers,
        body: JSON.stringify(req.body.data),
      }
    );

    //   console.log("response is ", response)

    //   console.log("res is ", res)
    // Check if the request was successful
    if (response.status != 200) {
      throw new Error("Failed to send OTP email");
    }

    // Extract and return the response data
    const responseData = await response.json();
    res.status(200).json(responseData);
    //   console.log("Email verification response:", responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
