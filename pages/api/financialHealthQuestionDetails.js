export default async function handler(req, res) {
    try {
      const questionId = Object.keys(req.query)[0];
      const apiUrl = `${process.env.BASE_URL}/api/resource/Financial%20Health%20Questions/${questionId}?fields=%5B%22options%22%5D`;
      
  
  
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${process.env.AUTH_TOKEN}`,
        //   'cookie': 'sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image='
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch question details');
      }
  
      const data = await response.json();
      const options = data.data.options; // Extracting only the 'options' data
  
      const filteredData = options.map(item => ({
        id: item.idx,
        option_text: item.option_text,
        is_selected : item.is_selected,
        is_correct : item.is_correct,
        option_score : item.option_score,
        text_input_type : item.text_input_type,
        option_weightage : item.option_weightage,
        user_input_text_answer : data.data.user_input_text_answer,
        text_input_option : item.text_input_option,
        user_input_options : item.user_input_options,
        question: data.data.question
        // text_input_type : id.text_input_type,
        // text_input_character_limit : id.text_input_character_limit
        
      }));

   
  
      res.status(200).json (data.data); // Return only the 'options' data
      // console.log("filteredData is",filteredData)
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      
    }
  }
  
  