'use client'
import styles from './NoInput.module.css'
import { Button } from '../../level1/Button';
import arrowNext from '../../../../../../public/financial-x-ray/arrowNext.svg'
import arrowPrev from '../../../../../../public/financial-x-ray/arrowPrev.svg'
import Image from 'next/image'
import { updateUserResponseWithScoringWeight, previousQuestionApiCaller, nextQuestionApiCaller, pushUserResponseApiCaller } from './Utitlity';
import { useEffect } from 'react';
export default function NoInput(props) {
    let nextquestionDetails;

    function optionMapper() {
        // this function will map optionSelected to the options array as we need to pass it to nextquestion api
        const currenTime = Date.now();
        const timeTaken = (currenTime - props.prevTime) / 1000;

        nextquestionDetails = {
            "form_session_token": props.sessionTokenId,
            "question_link": props.questionDetails.name,
            "question_text": props.questionDetails.question,
            "slider_value": 0.0,
            "date_time": props.date_time,
            "time_taken": timeTaken,
            "form": localStorage.getItem('healthCheckForm'),
            "scoring_weight": 1,
            "user_no_input_read_flag": 1,
            "question_categories": props.questionDetails.financial_form_categories,
            "question_subcategories": props.questionDetails.financial_form_sub_category,
            "options": [],
        }
    }

    async function nextQuestionHandler(event) {
        optionMapper();
        await pushUserResponseApiCaller(nextquestionDetails);
        let response = await nextQuestionApiCaller(nextquestionDetails); //pass next question details 
        console.log("nexts handler response", response)
        if (response.data.end_of_category || response.data.end_of_form) {
            props.setEndOfCategory((prev) => { return { ...prev, [props.selectedCategory]: 1 } })
            const xRayCompletedCategories = localStorage.getItem('xRayCompletedCategories') ? JSON.parse(localStorage.getItem('xRayCompletedCategories')) : {};
            localStorage.setItem('xRayCompletedCategories', JSON.stringify({ ...xRayCompletedCategories, [props.selectedCategory]: 1 }));
            if (response.data.end_of_form) {
                let count = 0;
                for (let key of Object.keys(props.endOfCategory)) {
                    if (props.endOfCategory[key] == 0) {
                        count = count + 1;
                    }
                }
                console.log('count', count)

                if (count <= 1) {
                    props.setEndOfForm(true)
                }
            }
        } else {
            props.setCurrentQusetion(response.data.next_question_link); //pass next question id to this method
        }
        props.resetCurrentQusetionDetails();
    }
    async function skipQuestionHandler() {
        optionMapper();
        nextquestionDetails['scoring_weight'] = 0;
        await pushUserResponseApiCaller(nextquestionDetails);
        let response = await nextQuestionApiCaller(nextquestionDetails); //pass next question details  
        props.setPreviousResponse(false);
        console.log("nexts handler response", response)
        if (response.data.end_of_category || response.data.end_of_form) {
            props.setEndOfCategory((prev) => { return { ...prev, [props.selectedCategory]: 1 } })
            if (response.data.end_of_form) {
                let count = 0;
                for (let key of Object.keys(props.endOfCategory)) {
                    if (props.endOfCategory[key] == 0) {
                        count = count + 1;
                    }
                }
                console.log('count', count)

                if (count <= 1) {
                    props.setEndOfForm(true)
                }
            }
        } else {
            props.setCurrentQusetion(response.data.next_question_link); //pass next question id to this method
        }
        props.setProgressBar(props.questionDetails.form_question_non_section_progress);
        props.setProgressCategory(prev => { return { ...prev, [props.selectedCategory]: props.questionDetails.form_question_progress }; });
        props.resetCurrentQusetionDetails();
        props.setCurrentOptionsDetailsFromPreviousBtnClick();

    }

    async function prevQuestionHandler(event) {
        const payLoad = {
            "form_session_token": props.sessionTokenId,
            "question_link": props.questionDetails.name,
            "financial_form_link": props.questionDetails.financial_form,
        }
        await updateUserResponseWithScoringWeight();
        let response = await previousQuestionApiCaller(payLoad); //pass current question deatils into it
        console.log("previous handler response", response)
        // previous question responses set by user previously
        props.setCurrentOptionsDetailsFromPreviousBtnClick(prev => response.data.health_check_form_response_doc);
        props.setCurrentQusetion(response.data.previous_question_link); //pass next question id to this method
        // set previous response false
        props.setPreviousResponse(false);
        props.resetCurrentQusetionDetails();
    }

    useEffect(() => {
        props.setProgressBar(props.questionDetails.form_question_non_section_progress);
        props.setProgressCategory(prev => { return { ...prev, [props.selectedCategory]: props.questionDetails.form_question_progress }; });
    }, [])

    return (
        <div className={styles.Container}>
            <div className={styles.Question}>
                {props.questionDetails.question}
            </div>

            <div className={styles.btns}>

                {!props.questionDetails.answer_skip_enabled ? <Button
                    color="gray_900_0c"
                    size="lg"
                    variant="fill"
                    shape="round"
                    className="min-w-[132px] gap-2 font-semibold sm:px-5 bg-teal-600 text-white"
                    rightIcon={<Image src={arrowNext} width={160} height={160} alt="Arrow 1" className=" w-[16px]" />}
                    onClick={nextQuestionHandler}>{props.questionDetails.form_question_progress != 100 ? 'Next' : 'Finish'}</Button>
                    : <Button className={`${styles.NextBtn}`} onClick={skipQuestionHandler}>Skip</Button>}

                {!props.isFirstQuestion ? <Button
                    color="gray_900"
                    size="lg"
                    shape="round"
                    className="min-w-[132px] gap-2 font-medium sm:px-5"
                    leftIcon={<Image src={arrowPrev} alt="Arrow 1" width={16} height={16} className=" w-[16px]" />}
                    onClick={prevQuestionHandler}>Previous</Button> : ''}
            </div>
        </div>
    );
}