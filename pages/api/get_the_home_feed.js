import Api_Urls from "../../Api_Urls";

export default async function handler(req, res) {
  try {
    const requestPayload = req.body;
    console.log("server data payload....", requestPayload);

    const response = await fetch(Api_Urls.get_the_home_feed, {
      method: "POST",
      headers: Api_Urls.headers,
      body: requestPayload,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get home feed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// export default async function getTheHomeFeedAPi(nextquestionDetails) {
//     try {
//         console.log('next detais payload ..', nextquestionDetails);
//         const response = await fetch(Api_Urls.get_the_home_feed, {
//             method: 'POST',
//             headers: Api_Urls.headers,
//             body: JSON.stringify(nextquestionDetails),
//         })
//         const data = await response.json();
//         console.log('data from api for get home feed ', data)
//         if (!data) {
//             console.log('error occures in fetching');
//         }
//         return data;
//     }
//     catch (err) {
//         console.log(err)
//     }
// }
