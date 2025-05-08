'use client'
import { useEffect, useState } from 'react'
import styles from './RatingBar.module.css'
import { Button } from '../../level1/Button';
import arrowNext from '../../../../../../public/financial-x-ray/arrowNext.svg'
import arrowPrev from '../../../../../../public/financial-x-ray/arrowPrev.svg'
import Image from 'next/image'
import { updateUserResponseWithScoringWeight, previousQuestionApiCaller, nextQuestionApiCaller, pushUserResponseApiCaller } from './Utitlity';
import PercentSlider from '../../level2/sliders/PercentSlider';
import YearSlider from '../../level2/sliders/YearSlider';
import DaySlider from '../../level2/sliders/DaySlider';
import MonthSlider from '../../level2/sliders/MonthSlider';
import NumberSlider from '../../level2/sliders/NumberSlider';
import AmountSlider from '../../level2/sliders/AmountSlider';
// on clicking next question btn 1.) we will map all the selected qusetions to the qusetionDetails 2.)call nex question Api caller function 3.) set the next question link to current question state of quiz component

// multiple optionns can be selected
function RatingBar(props) {

    const [value, setValue] = useState(props.previousResponse ? props.previousResponseQuestionDetails.slider_value : (props.currentOptionsDetailsFromPreviousBtnClick ? props.currentOptionsDetailsFromPreviousBtnClick.slider_value : 0));
    console.log(props.previousResponse, props.previousResponse ? props.previousResponseQuestionDetails.slider_value : 0);
    let nextquestionDetails;
    const [isNextBtnActive, setIsNextBtnActive] = useState(true);

    function optionMapper() {
        // this function will map optionSelected to the options array as we need to pass it to nextquestion api
        const currenTime = Date.now();
        const timeTaken = (currenTime - props.prevTime) / 1000;

        nextquestionDetails = {
            "form_session_token": props.sessionTokenId,
            "question_link": props.questionDetails.name,
            "question_text": props.questionDetails.question,
            "slider_value": parseFloat(value),
            "date_time": props.date_time,
            "time_taken": timeTaken,
            "form": localStorage.getItem('healthCheckForm'),
            "scoring_weight": 1,
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

    let slider;
    if (props.questionDetails.slider_type == 'Percent') {
        slider = <PercentSlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></PercentSlider>
    } else if (props.questionDetails.slider_type == 'Amount') {
        slider = <AmountSlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></AmountSlider>
    } else if (props.questionDetails.slider_type == 'Month') {
        slider = <MonthSlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></MonthSlider>
    } else if (props.questionDetails.slider_type == 'Year') {
        slider = <YearSlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></YearSlider>
    } else if (props.questionDetails.slider_type == 'Number') {
        slider = <NumberSlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></NumberSlider>
    } else if (props.questionDetails.slider_type == 'Day') {
        slider = <DaySlider value={value} setValue={setValue} min={props.questionDetails.slider_min_value} step={props.questionDetails.slider_step_size} max={props.questionDetails.slider_max_value}></DaySlider>
    }


    return (
        <div className={styles.Container}>
            <div className={styles.Question}>
                Q. {props.questionDetails.question}
            </div>
            <div className={styles.Options}>
                {slider}
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

export default RatingBar;




// on clicking next question btn 1.) we will map all the selected qusetions to the qusetionDetails 2.)call nex question Api caller function 3.) set the next question link to current question state of quiz component

