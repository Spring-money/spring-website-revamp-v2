'use client'
import { useState, useEffect } from 'react'
import Option from '../../level1/options/Options';
import styles from './MCQSingleChoice.module.css'
import { Button } from '../../level1/Button';
import arrowNext from '../../../../../../public/financial-x-ray/arrowNext.svg'
import arrowPrev from '../../../../../../public/financial-x-ray/arrowPrev.svg'
import Image from 'next/image'
import date from 'date-and-time';

import { updateUserResponseWithScoringWeight, previousQuestionApiCaller, nextQuestionApiCaller, pushUserResponseApiCaller } from './Utitlity';

export default function MCQSingleChoice(props) {
    // console.log('prev time in mcq ...',props.prevTime);

    let nextquestionDetails;
    let options = null;

    if (props.previousResponse) {
        options = props.previousResponseQuestionDetails.options;
        // console.log('previous response ooptions..',props.previousResponseQuestionDetails.options)
    } else {
        options = props.questionDetails.options;
    }

    if (props.currentOptionsDetailsFromPreviousBtnClick) {
        options = props.currentOptionsDetailsFromPreviousBtnClick.options;
    }
    // console.log('currentOptionsDetailsFromPreviousBtnClick',props.currentOptionsDetailsFromPreviousBtnClick)
    let arr = [];
    let bool = false;
    for (let i of options) {
        arr.push(i.is_selected);
        if (i.is_selected) {
            bool = true;
        }
    }
    const [isNextBtnActive, setIsNextBtnActive] = useState(bool);
    const [optionSelected, setOptionSelected] = useState(arr);
    // setOptionSelected(arr);

    function selectHandler(event) {
        let id = event.currentTarget.getAttribute('data-id');
        setIsNextBtnActive(true);
        setOptionSelected((prev) => {
            let arr = Array(options.length).fill(0);
            arr[id] = 1;
            return arr;
        })
    }
    function optionMapper() {
        // this function will map optionSelected to the options array as we need to pass it to nextquestion api
        optionSelected.forEach((data, index) => {
            options[index].is_selected = data;
        })
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
            "question_categories": props.questionDetails.financial_form_categories,
            "question_subcategories": props.questionDetails.financial_form_sub_category,
            "options": options,
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
                // console.log('count',count)

                if (count <= 1) {
                    props.setEndOfForm(true)
                }
            }
        } else {
            props.setCurrentQusetion(response.data.next_question_link); //pass next question id to this method
        }
        console.log('ques detaials on next...', props.questionDetails.form_question_progress)
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

    return (
        <>
            {(
                <>
                    <div className={styles.Container}>
                        <div className={styles.Question}>
                            Q. {props.questionDetails.question}
                        </div>
                        <div className={options.some(obj => obj.option_text === "Yes") ? styles.Options2 : styles.Options}>
                            {options.map((data, index) => (
                                <Option
                                    key={'options' + index}
                                    className={optionSelected[index] ? "bg-gray-950 text-white hover:bg-gray-950 hover:text-white" : ""}
                                    data-id={index}
                                    onClick={selectHandler}
                                    width={options.some(obj => obj.option_text === "Yes") ? "277px" : ""}
                                >
                                    {data.option_text}
                                </Option>
                            ))}
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
                </>
            )}
        </>
    );
}