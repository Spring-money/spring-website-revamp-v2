export default async function handler(req, res) {
    try {
      console.log("Mobile verification API triggered"); 
      // Extract data from the request body
      const { text, to } = req.body;
  
      // Construct the URL with dynamic values
      const apiUrl = `https://api2.growwsaas.com/fe/api/v1/send?username=springtrans&password=qT9F3DcE&unicode=false&from=SPMNAP&to=${to}&text=${encodeURIComponent(text)}&dltContentId=1207168836633571197&dltPrincipalEntityId=1201168735193641037`;
  
      // Prepare the request options
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        },
        body: JSON.stringify(req.body)
      };
  
      // Make the POST request to the API
      const response = await fetch(apiUrl, options);
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
  
      // Extract and return the response data
      const responseData = await response.json();
      console.log("Mobile verification response:", responseData); 
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  