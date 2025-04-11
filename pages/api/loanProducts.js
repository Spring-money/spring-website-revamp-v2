import axios from "axios";

export default async function handler(req, res) {



    
    const options = {
        method: 'GET',
        url: `${process.env.BASE_URL}/api/resource/Loan%20Provider%20Loan%20Products`,
        params: {
          filters: '[["loan_provider_loan_product_enabled","=","1"], ["loan_provider_details","=","LOPR-Bhanix Finance and Investment Ltd.-Public Sector Bank-22-05-2024-186669"]]',
          fields: '["*"]'
        },
        headers: {
          cookie: 'system_user=no; full_name=Guest; user_id=Guest; user_image=',
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.4.5',
          Authorization: `token ${process.env.AUTH_TOKEN}`
        }
      };

      try {
        const response = await axios.request(options);
        const data = response.data;
        res.status(200).json(data);
      } catch (error) {
        console.error(error);
      }
}
      


