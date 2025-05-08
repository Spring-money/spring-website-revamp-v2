
export default async function handler(req, res) {
  try {
    const { category } = req.query;  // Get the category from the query parameters
   



    // Set up filters based on the received category
    const filters = encodeURIComponent(JSON.stringify([
      ["financial_form", "=", "FINFORM-Income Tax Savings Maximizer-24-01-05-91700"],
      ["question_disabled", "=", "0"],
      ["Financial Form Categories","category_name","in",category]
    ]));
    const order = encodeURIComponent('question_index asc');

    const apiUrl = `${process.env.BASE_URL}/api/resource/Financial%20Health%20Questions` +
    `?fields=["*"]` +
    `&filters=${filters}` +
    `&order_by=${order}` + // Appending the order_by parameter
    `&limit_page_length=60`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${process.env.AUTH_TOKEN}`
        // Include 'cookie' header if required
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

     // For debugging

    const filteredData = data.data.map(item => ({
      question: item.question,
      choice_type: item.choice_type,
      question_type: item.question_type,
      question_Id : item.name,
      question_screen_name_number : item.question_screen_name_number,
      question_index : item.question_index,
      question_input : item.user_input_text_answer,
      question_input_type : item.user_input_type,
      question_lead_form : item.show_lead_form,
      question_opt_status : item.opt_in_status_default,
      question_opt_text : item.opt_in_text,
      slider_type : item.slider_type,
      slider_min_title : item.slider_min_title,
      slider_min_value : item.slider_min_value,
      slider_max_title : item.slider_max_title,
      slider_max_value: item.slider_max_value,
      slider_step_size : item.slider_step_size
    }));


   // Check output

    res.status(200).json(filteredData);
  } catch (error) {
    console.error('Error:', error); // Log error details
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



  // D:\development\income-tax-calculator\pages\api\financialHealthQuestions.js

  