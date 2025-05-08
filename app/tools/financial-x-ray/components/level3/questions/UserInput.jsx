'use client'
import { useEffect, useState } from 'react'
import styles from './MCQ.module.css'
import { Button } from '../../level1/Button';
import arrowNext from '../../../../../../public/financial-x-ray/arrowNext.svg'
import arrowPrev from '../../../../../../public/financial-x-ray/arrowPrev.svg'
import Image from 'next/image'
import { updateUserResponseWithScoringWeight, previousQuestionApiCaller, nextQuestionApiCaller, pushUserResponseApiCaller } from './Utitlity';
import EmailInput from '../../level2/inputs/EmailInput';
import AmountInput from '../../level2/inputs/AmountInput';
import NumberInput from '../../level2/inputs/NumberInput';
import { DateInput } from '../../level1/inputs/Inputs';
import PercentInput from '../../level2/inputs/PercentInput';
import PasswordInput from '../../level2/inputs/PasswordInput'

export default function UserInput(props) {
    let nextquestionDetails;

    const [value, setValue] = useState(props.previousResponse ? props.previousResponseQuestionDetails.user_input_text_answer : '');
    let bool = false;
    if (value != "") {
        bool = true;
    }
    const [isNextBtnActive, setIsNextBtnActive] = useState(bool);

    useEffect(() => {
        setIsNextBtnActive(bool);
    }, [bool])

    useEffect(() => {
        if (props.questionDetails.user_input_text_answer) {
            setValue(props.questionDetails.user_input_text_answer)
        }
    }, [])

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
            "user_input_text_answer": value,
            "question_categories": props.questionDetails.financial_form_categories,
            "question_subcategories": props.questionDetails.financial_form_sub_category,
            "options": [],
        }
    }

    async function nextQuestionHandler(event) {
        optionMapper();
        await pushUserResponseApiCaller(nextquestionDetails);
        let response = await nextQuestionApiCaller(nextquestionDetails); //pass next question details  
        props.setPreviousResponse(false);
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
        props.setProgressBar(props.questionDetails.form_question_non_section_progress);
        props.setProgressCategory(prev => { return { ...prev, [props.selectedCategory]: props.questionDetails.form_question_progress }; });
        props.resetCurrentQusetionDetails();
        props.setCurrentOptionsDetailsFromPreviousBtnClick();

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
        const time = new Date();
        console.log('time update in mcq next button..', time);
        console.log('props.prevTime in next....', props.prevTime);
        if (time && props.prevTime) {
            const sec = date.subtract(time, props.prevTime).toSeconds();
            console.log('the sec are ......', sec);
        }
        // props.setPrevTime(time);
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

    let input;
    if (props.questionDetails.user_input_type == 'Amount') {
        input = <AmountInput min={0} max={1000000000000} value={value} setValue={setValue}></AmountInput>
    }
    else if (props.questionDetails.user_input_type == 'Calender') {
        input = <DateInput value={value} setValue={setValue}></DateInput>
    }
    else if (props.questionDetails.user_input_type == 'Percent') {
        input = <PercentInput value={value} setValue={setValue}></PercentInput>
    }
    else if (props.questionDetails.user_input_type == 'Number') {
        input = <NumberInput value={value} setValue={setValue}></NumberInput>
    }
    else if (props.questionDetails.user_input_type == 'Email') {
        input = <EmailInput value={value} setValue={setValue}></EmailInput>
    }
    else if (props.questionDetails.user_input_type == 'Password') {
        input = <PasswordInput value={value} setValue={setValue}></PasswordInput>
    }
    else if (props.questionDetails.user_input_type == 'Text') {
        input = <NumberInput value={value} setValue={setValue}></NumberInput>
    }

    return (
        <div className={styles.Container}>
            <div className={styles.Question}>
                Q. {props.questionDetails.question}
            </div>
            <div className={styles.Options}>
                {input}
            </div>
            <div className={styles.btns}>
                {!props.questionDetails.answer_skip_enabled || isNextBtnActive ? <Button
                    color="gray_900_0c"
                    size="lg"
                    variant="fill"
                    shape="round"
                    className={`min-w-[132px] gap-2 font-semibold sm:px-5 text-white ${isNextBtnActive ? 'bg-teal-600' : ''}`}
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