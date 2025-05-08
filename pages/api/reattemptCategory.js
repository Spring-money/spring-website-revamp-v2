import axios from "axios";

export default async function  handler (req, res){

    const sessionToken = req.query.sessionToken
    const currentCategory = req.query.category

    console.log("sessionToken in reattempt "  ,sessionToken)
    console.log("currentCategory: "  ,currentCategory)
    const options = {
        method: 'POST',
        url: `${process.env.BASE_URL}/api/method/Reset-All-Questions-Of-Category-And-Categories-Next-To-It`,
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.6.1',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        data: {
          user: '',
          lead_profile_link: '',
          form_session_token: sessionToken,
          current_category: currentCategory
        }
      };

      try{
        const response = await axios.request(options);
        res.status(200).json(response.data);
      } catch(error){
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
}


