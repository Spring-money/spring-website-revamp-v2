'use client'
import MCQ from '../../level3/questions/MCQ';
import MCQSingleChoice from '../../level3/questions/MCQSingleChoice';
import MultipleUserInput from '../../level3/questions/MultipleUserInput';
import NoInput from '../../level3/questions/NoInput';
import OptIn from '../../level3/questions/OptIn';
import RatingBar from '../../level3/questions/RatingBar';
import UserInput from '../../level3/questions/UserInput';
import styles from './Quiz.module.css'
import { useState, useEffect } from 'react'
import { getCurrentQuestionApiCaller, completeResponsebyUserApiCaller } from '../../level3/questions/Utitlity'
import Bar from '../../level1/bars/Bars';
import { getAllQuestionApiCaller } from '../../level3/questions/Utitlity';

function Quiz(props) {
    // we will get first qusetion id as props to quiz component 
    console.log(props);
    const [currentQuestion, setCurrentQusetion] = useState(props.firstQuestion);
    const [currentQuestionDetails, setCurrentQusetionDetails] = useState();
    const [progressBar, setProgressBar] = useState(0);
    const [previousResponseQuestionDetails, setPreviousResponseQuestionDetails] = useState();
    const [prevTime, setPrevTime] = useState();
    const [date_time, setDate_Time] = useState('');
    const [currentOptionsDetailsFromPreviousBtnClick, setCurrentOptionsDetailsFromPreviousBtnClick] = useState();
    const [isFirstQuestion, setIsFirstQuestion] = useState(false);
    const [firstQuestionOfCategory, setFirstQuestionOfCategory] = useState();

    // Set current question when props change
    useEffect(() => {
        async function getAllQues() {
            const ques = await getAllQuestionApiCaller(props.selectedCategory);
            setFirstQuestionOfCategory(ques.data[0].name);
            if (currentQuestion == ques.data[0].name) {
                setIsFirstQuestion(true);
            } else {
                setIsFirstQuestion(false);
            }
        }
        getAllQues();
    }, [props.selectedCategory, currentQuestion])

    useEffect(() => {
        setCurrentQusetion(props.firstQuestion);
        async function PreviousResponse() {
            if (props.previousResponse) {
                const response = await completeResponsebyUserApiCaller(props.responseID);
                setPreviousResponseQuestionDetails(response.data);
            }
        }
        PreviousResponse();
    }, [props.firstQuestion]);

    useEffect(() => {
        async function getData() {
            let response = await getCurrentQuestionApiCaller(currentQuestion);
            setCurrentQusetionDetails(response.data);

        };
        getData();
        const date_Time = new Date();
        setDate_Time(`${date_Time.toISOString().slice(0, 10)} ${date_Time.toTimeString().slice(0, 8)}`);
        const Time = Date.now();
        setPrevTime(Time);
    }, [currentQuestion])

    let question;
    if (props.previousResponse) {
        if (currentQuestionDetails && previousResponseQuestionDetails && prevTime !== undefined && date_time !== undefined) {
            if (currentQuestionDetails.question_type == 'MCQ') {
                if (currentQuestionDetails.choice_type == 'MULTIPLE_CHOICE') {
                    question = <MCQ date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MCQ>
                } else if (currentQuestionDetails.choice_type == 'SINGLE_CHOICE') {
                    question = <MCQSingleChoice date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MCQSingleChoice>
                }

            } else if (currentQuestionDetails.question_type == 'USER_INPUT') {
                if (currentQuestionDetails.choice_type == 'MULTIPLE_CHOICE') {
                    question = <MultipleUserInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MultipleUserInput>
                } else if (currentQuestionDetails.choice_type == 'SINGLE_CHOICE') {
                    question = <UserInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></UserInput>
                }
            } else if (currentQuestionDetails.question_type == 'OPT_IN') {
                question = <OptIn date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></OptIn>
            } else if (currentQuestionDetails.question_type == 'NO_INPUT') {
                question = <NoInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></NoInput>
            } else if (currentQuestionDetails.question_type == 'SLIDER') {
                question = <RatingBar date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></RatingBar>
            }
        }
    } else {
        if (currentQuestionDetails && prevTime !== undefined && date_time !== undefined) {
            if (currentQuestionDetails.question_type == 'MCQ') {
                if (currentQuestionDetails.choice_type == 'MULTIPLE_CHOICE') {
                    question = <MCQ date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MCQ>
                } else if (currentQuestionDetails.choice_type == 'SINGLE_CHOICE') {
                    question = <MCQSingleChoice date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} previousResponseQuestionDetails={previousResponseQuestionDetails} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MCQSingleChoice>
                }

            } else if (currentQuestionDetails.question_type == 'USER_INPUT') {
                if (currentQuestionDetails.choice_type == 'MULTIPLE_CHOICE') {
                    question = <MultipleUserInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></MultipleUserInput>
                } else if (currentQuestionDetails.choice_type == 'SINGLE_CHOICE') {
                    question = <UserInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></UserInput>
                }
            } else if (currentQuestionDetails.question_type == 'OPT_IN') {
                question = <OptIn date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></OptIn>
            } else if (currentQuestionDetails.question_type == 'NO_INPUT') {
                question = <NoInput date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></NoInput>
            } else if (currentQuestionDetails.question_type == 'SLIDER') {
                question = <RatingBar date_time={date_time} prevTime={prevTime} setPreviousResponse={props.setPreviousResponse} previousResponse={props.previousResponse} sessionTokenId={props.sessionTokenId} questionDetails={currentQuestionDetails} setCurrentQusetion={setCurrentQusetion} resetCurrentQusetionDetails={setCurrentQusetionDetails} setProgressBar={setProgressBar} setProgressCategory={props.setProgressCategory} endOfCategory={props.endOfCategory} setEndOfCategory={props.setEndOfCategory} selectedCategory={props.selectedCategory} currentOptionsDetailsFromPreviousBtnClick={currentOptionsDetailsFromPreviousBtnClick} setCurrentOptionsDetailsFromPreviousBtnClick={setCurrentOptionsDetailsFromPreviousBtnClick} setEndOfForm={props.setEndOfForm} isFirstQuestion={isFirstQuestion}></RatingBar>
            }
        }
    }
    // next qusetion and previous question logic must be handled in qusetion components but they needed to be set as current for next render so we need to set currentQuestion state by passing them as props
    return (
        <div className="flex flex-col">
            <div className={styles.Heading}>
                {props.selectedCategory}
            </div>
            <Bar value={`${props.progressCategory[props.selectedCategory]}%`}></Bar>
            {currentQuestionDetails ? question
                :
                (
                    <div className="rounded-md w-full mx-auto">
                        <div className="h-2 ml-8 bg-gray-400 max-w-sm rounded"></div>
                        <div className="animate-pulse pl-2 max-w-sm space-x-4 mt-12">
                            <div className="flex flex-wrap gap-4">
                                <div className="h-8 bg-gray-400 rounded w-32 "></div>
                                <div className="h-8 bg-gray-400 rounded w-48 mt-0"></div>
                                <div className="h-8 bg-gray-400 rounded w-64"></div>
                            </div>
                        </div>
                        <div className="animate-pulse pl-2 space-x-4 mt-12">
                            <div className="flex flex-wrap justify-between">
                                <div className="h-11 bg-gray-400 rounded w-32"></div>
                                <div className="h-11 bg-gray-400 rounded w-32 "></div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default Quiz;