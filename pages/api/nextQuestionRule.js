import Api_Urls from "../../Api_Urls";
import axios from "axios";

export default async function handler(req, res) {
  const { questionId, sessionToken } = req.query;

  console.log("question id here ", questionId);

  const options = {
    method: "POST",
    url: "https://us-central1-springmoneybackenduat.cloudfunctions.net/app/api/nextQuestion",
    headers: Api_Urls.headers,
    data: {
      current_question: questionId,
      user: "",
      lead_profile_link: "",
      form_session_token: sessionToken,
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error making Axios request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
