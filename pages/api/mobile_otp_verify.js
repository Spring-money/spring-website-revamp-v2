import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const { to, text } = req.query;

    // console.log('selected to and text..', to ,text);

    const username = "springtrans";
    const password = "qT9F3DcE";
    const unicode = "false";
    const from = "SPMNAP";
    // const to = "9958943337";
    // const text = "Your%20login%20OTP%20for%20Spring%20Money%20is%2009876.%206RPXrGk2N1I";
    const dltContentId = "1207168836633571197";
    const dltPrincipalEntityId = "1201168735193641037";

    const url = new URL(Api_Urls.mobile_otp_verify);
    url.searchParams.append("username", username);
    url.searchParams.append("password", password);
    url.searchParams.append("unicode", unicode);
    url.searchParams.append("from", from);
    url.searchParams.append("to", to);
    url.searchParams.append("text", text);
    url.searchParams.append("dltContentId", dltContentId);
    url.searchParams.append("dltPrincipalEntityId", dltPrincipalEntityId);
    console.log("to", to);
    console.log("url", url.toString());
    const response = await fetch(url, {
      method: "POST",
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
