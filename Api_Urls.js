const Api_Urls={
    get_all_ques: `${process.env.BASE_URL}/api/resource/Financial Health Questions`,
    get_all_ques_details:`${process.env.BASE_URL}/api/resource/Financial Health Questions`,
    get_next_ques:`${process.env.BASE_URL}/api/method/get-next-question-id-based-on-session-token`,
    get_previous_ques:`${process.env.BASE_URL}/api/method/get-previous-question-id-based-on-session-token`,
    lead_profile_link_to_update_details:`${process.env.BASE_URL}/api/method/lead-profile-link-api`,
    most_recent_attempt_ques:`${process.env.BASE_URL}/api/resource/Health Check Form Response`,
    push_lead_info_get_lead_id:`${process.env.BASE_URL}/api/resource/Lead Profile`,
    push_user_response:`${process.env.BASE_URL}/api/resource/Health Check Form Response`,
    session_token:`${process.env.BASE_URL}/api/method/session_token_generation`,
    update_user_response_with_different_options:`${process.env.BASE_URL}/api/resource/Health Check Form Response/HCFRRESP-FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745-FIN-QUES-231027-0021-96140`,
    update_user_response_with_scoring_weight:`${process.env.BASE_URL}/api/resource/Health Check Form Response/HCFRRESP-FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745-FIN-QUES-231027-0051-91680`,
    responses_posted_by_user : `${process.env.BASE_URL}/api/resource/Health Check Form Response`,
    complete_health_check_response_based_on_responseID : `${process.env.BASE_URL}/api/resource/Health Check Form Response`,
    populate_summary_tabel:`${process.env.BASE_URL}/api/method/populate-summary-table-in-health-check-form-result`,
    populate_score_tabel:`${process.env.BASE_URL}/api/method/populate-category-score-table-in-health-check-form-result`,
    fetch_insights:`${process.env.BASE_URL}/api/resource/Health Check Form Result/`,
    health_check_report_result_for_specific_user_and_health_check_form : `${process.env.BASE_URL}/api/resource/Health Check Form Result`,
    email_verify : `${process.env.BASE_URL}/api/method/user-deletion-request-verification-email`,
    mobile_otp_verify : 'https://api2.growwsaas.com/fe/api/v1/send',
    get_ques_details_and_option_details_for_insights:`${process.env.BASE_URL}/api/resource/Financial Health Options Summary Relationship`,
    user_delete_request:`${process.env.BASE_URL}/api/resource/User Delete Request`,
    user_exists_verify:`${process.env.BASE_URL}/api/resource/Spring%20User`,
    get_the_home_feed:`${process.env.BASE_URL}/api/method/get-refreshed-home-feed-refreshed`,
    filtered_get_the_home_feed:`${process.env.BASE_URL}/api/method/filtered-app-feed`,
    nswealthX_rayReport: 'https://x-ray-beta.vercel.app/nswealth/',
    springMoneyX_rayReport : 'https://x-ray-beta.vercel.app/',
    retirement_calculator : 'https://us-central1-springmoneybackenduat.cloudfunctions.net/app/api/retirementCalculator',
    incomeTax_report :`${process.env.BASE_URL}/api/method/Populate-Income-Tax-Form-Report`,
    Get_the_Health_Check_Form_ID_configured: `${process.env.BASE_URL}/api/method/getFinancialFormID` ,
    IAP_customer_acquisition_responses: `${process.env.BASE_URL}/api/method/Get-IAP-Question-Responses` ,

    headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.AUTH_TOKEN}`,
    },

    nswealthX_rayReport: 'https://x-ray-beta.vercel.app/nswealth/',
    springMoneyX_rayReport : 'https://x-ray-beta.vercel.app/',
    BlogsAllPosts : 'https://www.wixapis.com/blog/v3/posts',
    BlogsPostBySlug : 'https://nikhil460.wixsite.com/springcomingsoon/post'
}

export default Api_Urls;


