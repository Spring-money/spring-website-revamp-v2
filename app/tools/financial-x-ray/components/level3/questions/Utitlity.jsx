'use client'
import axios from "axios";

// get question details and options details for insights ---------------------------------------------------
export async function getQuesDetailsOptionDetailsForInsightsApiCaller(docName) {
  try {
    const response = await fetch(`/api/get_ques_details_and_option_details_for_insights?docName=${docName}`)
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server is ......',data)
    return data;
  }
  catch (err) {
    console.log(err)
  }
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
export async function leadProfileLinkToUpdateDetailsApiCaller(payLoad) {
  try {
    const response = await fetch('/api/lead_profile_link_to_update_details', {
      method: 'POST',
      body: JSON.stringify(payLoad),
      });
    const data = response.json();
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
export async function pushLeadInfoGetLeadIdApiCaller(payLoad) {
  try {
    const response = await fetch('/api/push_lead_info_get_lead_id', { 
      method: 'POST',
      body: JSON.stringify(payLoad),
     });
    const data = response.json();
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------
export async function getCompleteDetailsHealthCheckResultApiCaller(formlink) {
  try {
    // console.log('payload of seesion token ..',payLoad);
    const response = await fetch(`/api/get_Complete_details_of_the_Health_Check_Result_base_don_Result_ID?formlink=${formlink}`);
    const data = await response.json();
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('generated token is ..', generatedToken.data.session_generated_token)
    return data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function healthCheckReportResultApiCaller(sessionTokenId) {
  try {
    // console.log('sessionTokenId.... ', sessionTokenId)
    const response = await fetch(`/api/health_check_report_result_for_specific_user_and_health_check_form?sessionTokenId=${sessionTokenId}`)
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server for health check report is ......',data)
    return data.data;
  }
  catch (err) {
    console.log(err)
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
export async function updateUserResponseWithScoringWeight() {
  try {
    const response = await fetch('/api/update_user_response_with_scoring_weight');
    const data = await response.json();
    // console.log('data in server for update response with scoring weight...',data);
    if (!data) {
      console.log('error ocuured in fetching');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
export async function completeResponsebyUserApiCaller(responseId) {
  try {
    // console.log('response id that to be send .... ',responseId)
    // const encodedCategory = encodeURIComponent(selectedCategory);
    const response = await fetch(`/api/complete_health_check_response_based_on_responseID?responseId=${responseId}`)
    
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server for complete user response is ......',data)
    return data;
  }
  catch (err) {
    console.log(err)
  }
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
export async function responsesByUserApiCaller(selectedCategory, sessionTokenId) {
  try {
    // console.log('selected category inside api caller and token id ',selectedCategory, sessionTokenId)
    const encodedCategory = encodeURIComponent(selectedCategory);
    // const encodedTokenId = encodeURIComponent(sessionTokenId)
    
    const response = await fetch(`/api/responses_posted_by_user?category=${encodedCategory}&sessionTokenId=${sessionTokenId}`)
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server of user responses is ......',data)
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

//this function will call after getting user's ip and other device details to get the generated tokken from api--------------------------------------------------
export async function getSessionTokenApiCaller(payLoad) {
  try {
    // console.log('payload of seesion token ..',payLoad);
    const token = await fetch('/api/session_token', {
      method: 'POST',
      body: JSON.stringify(payLoad)
    });
    const generatedToken = await token.json();
    if (!generatedToken) {
      console.log('error occures in fetching');
    }
    // console.log('generated token is ..', generatedToken.data.session_generated_token)
    return generatedToken.data.session_generated_token_ID;
  } catch (err) {
    console.log(err);
  }
}

//this function will call for the first time render to get the user's ipv4 address-------------------------------------------------------------------------------------
export async function getUserIpApiCaller() {
  try {
    const response = await fetch('/api/getIp');
    const jsonRes = await response.json()
    return jsonRes.ip;
  } catch { err } {
    console.log(err);
  }
}

//this function will run for pushing user response ---------------------------------------------------------------------------------------------------------------
export async function pushUserResponseApiCaller(details) {
  try {
    const payLoad = details;
    console.log('push user response payload...', payLoad);
    const response = await fetch('/api/push_user_response', {
      method: 'POST',
      body: JSON.stringify(payLoad)
    })
    const data = response.json();
    console.log('data from push user response  api ', data);
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
export async function previousQuestionApiCaller(payLoad) {
  //pass current question deatils into it
  // this function will be called every time we need ton hit previous question api
  try {
    // console.log('prev ques api caller payload is....', payLoad);
    const response = await fetch('/api/get_prev_ques', { 
      method: 'POST',
      body: JSON.stringify(payLoad), 
    })
    const data = response.json();
    // console.log('data from prev api is.. ', data);
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------
export async function nextQuestionApiCaller(nextquestionDetails) {
  // utility function
  // pass next qusetion details in it 
  // this function will be called every time we need to hit next question api
  try {
    // console.log('next detais payload ..',payLoad);
    const response = await fetch(`/api/get_next_ques`, {
      method: 'POST', 
      body: JSON.stringify(nextquestionDetails),
    })
    const data = await response.json();
    // console.log('data from api for next ', data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------
// deta all details of question
export async function getCurrentQuestionApiCaller(currentQuestion) {
  try {
    
    const response = await fetch(`/api/get_all_ques_details?quesName=${currentQuestion}`)
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server is ......',data)
    return data;
  }
  catch (err) {
    console.log(err)
  }
}


//get all questions on first time category selection----------------------------------------------------------------------------------------------------------------
export async function getAllQuestionApiCaller(selectedCategory) {
  try {
    // console.log('selected category inside api caller ',selectedCategory)
    const encodedCategory = encodeURIComponent(selectedCategory);
    
    const response = await fetch(`/api/get_all_ques?category=${encodedCategory}`)
    const data = await response.json()
    if (!data) {
      console.log('error occures in fetching');
    }
    // console.log('data in server is ......',data)
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

// populate summary table------------------------------------------------

export async function populateSummaryTabel(details) {
  try {
    const response = await axios.post('/api/populate_summary_tabel', details);
    return response.data;
  } catch (err) {
    console.log(err);
    // Handle error appropriately, maybe throw or return an error object
  }
}

// populate score table------------------------------------------------
export async function populateScoreTabel(details) {
  try {
    // console.log("score table---------------payload", payLoad)
    const response = await fetch('/api/populate_score_tabel', {
      method: 'POST',
      body: JSON.stringify(details),
      headers: {
        'Expect': 'identity'
      }
    })
    const data = await response.json();
    // console.log('data from push user response  api ',data);
    if (!data) {
      console.log('error occured in populating score');
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

// fetch insights----------------------------------------------------------
export async function fetchInsights(HCFR) {
  try {
    const response = await fetch(`/api/fetch_insights?formlink=${HCFR}`)
    const data = await response.json();
    // console.log('data from api for next ',data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}


//------------------------------------------------------------------------------------------------
export async function emailVerifyApiCall(payLoad) {
  try {
    const response = await fetch(`/api/email_verify`, { 
      method: 'POST',
      body: JSON.stringify(payLoad),
    })
    const data = await response.json();
    // console.log('data from api for next ',data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

//--------------------------------------------------------------------------------------------------
export async function mobileOtpVerifyApiCall(to, text) {
  try {
    const response = await fetch(`/api/mobile_otp_verify?to=${to}&text=${text}` ,{
      method: 'POST',
    })
    const data = await response.json();
    // console.log('data from api for next ',data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

// user-deletion-api-----------------------------------------------------------------------------------
export async function userDeletionApiCall(payLoad) {
  try {
    const response = await fetch(`/api/user_deletion_api` ,{
      method: 'POST',
      body: JSON.stringify(payLoad),
    })
    const data = await response.json();
    // console.log('data from api for next ',data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}

// user-exists-verify-----------------------------------------------------------------------------------
export async function userExistsVerifyApiCall(payLoad) {
  try {
    const response = await fetch(`/api/user_exists_verify?or_filters=${payLoad}` ,{
      method: 'GET',
    })
    const data = await response.json();
    // console.log('data from api for next ',data)
    if (!data) {
      console.log('error occures in fetching');
    }
    return data;
  }
  catch (err) {
    console.log(err)
  }
}