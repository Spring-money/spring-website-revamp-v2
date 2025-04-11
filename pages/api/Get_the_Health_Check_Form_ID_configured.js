'use server'
import Api_Urls from "../../Api_Urls"

export default async function GetHealthCheckFormId(payload){

    // console.log('payload.........',payload);

    const response = await fetch(Api_Urls.Get_the_Health_Check_Form_ID_configured,{
        method:'POST',
        body: JSON.stringify(payload),
        headers: Api_Urls.headers
    })

    // console.log('response from health form id......................',response);

    const data = await response.json();

    return data.data.financial_form_ID;
}