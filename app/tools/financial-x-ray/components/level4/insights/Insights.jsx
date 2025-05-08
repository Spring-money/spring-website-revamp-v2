'use client'
import styles from './Insights.module.css'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from "../../level1/Button/index"
import { IntToAmount } from '../../level2/inputs/utility';
import { populateScoreTabel, populateSummaryTabel, fetchInsights, getQuesDetailsOptionDetailsForInsightsApiCaller, getCurrentQuestionApiCaller, previousQuestionApiCaller } from '../../level3/questions/Utitlity';
import arrowNext from '../../../../../../public/financial-x-ray/arrowNext.svg'
import infoCircle from "../../../../../../public/financial-x-ray/info-circle.svg"
import insightsNextArrow from "../../../../../../public/financial-x-ray/insightsNextArrow.svg"
import insightsPrevArrow from "../../../../../../public/financial-x-ray/leftInsightsArrow.svg"

function Insights(props) {
    const categoryArray = ['Savings & Budgeting', 'Investment', 'Insurance', 'Loans', 'Taxation']
    const [HCFR, setHCFR] = useState();
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [summaryTable, setSummaryTable] = useState([])
    const [resp2, setRes2] = useState();

    let details = {
        "user": "",
        "financial_form_link": localStorage.getItem('healthCheckForm'),
        "form_session_token": props.sessionTokenId,
        "lead_profile_link": ""
    }
    const [rep, setRep] = useState(false);
    const [scoreTableRep, setScoreTableRep] = useState(false);
    const [question, setQuestion] = useState();
    const [answer, setAnswer] = useState([]);

    // NEED TO REVISIT THE BELOW USEEFFECT IN FUTURE-----------------------------------------------------------------------------------------//
    useEffect(() => {
        async function getdata() {
            let summaryRes = await populateSummaryTabel(details);
            if (!summaryRes) {
                setRep(true)
                console.log('response of populate...', summaryRes)
            }
            else if (summaryRes && summaryRes.data.status_code === '200') {
                // console.log('populate resp2 is running......................../////////////////////////.....................');
                setRes2(summaryRes);
            }
            // setHCFR(response.health_check_form_result);
        }
        const timer = setTimeout(() => {
            getdata();
        }, 1)

        return () => clearTimeout(timer);
    }, [rep])

    // NEED TO REVISIT THE BELOW USEEFFECT IN FUTURE-----------------------------------------------------------------------------------------//
    useEffect(() => {
        if (resp2 && resp2.data.status_code === '200') {
            const populateTable = async () => {
                const res3 = await populateScoreTabel(details);
                if (res3 && res3.error === 'Internal Server Error') {
                    setScoreTableRep(true);
                }
                else if (res3 && res3.data.status_code === '200') {
                    setHCFR(resp2.data.health_check_form_result);
                    props.setReportFormLink(resp2.data.health_check_form_result);
                    let response = await fetchInsights(resp2.data.health_check_form_result);

                    console.log('response', response)
                    props.setTotalScore(response?.data?.total_score);
                    props.setScoreOfCategory((prev) => {
                        let cat = response.data.health_check_score_table.filter(data => {
                            return data.category == props.selectedCategory;
                        })
                        console.log(cat)
                        return { ...prev, [props.selectedCategory]: cat[0].score }
                    })

                    props.setProgressCategory((prev) => {
                        let cat = response.data.health_check_score_table.filter(data => {
                            return data.category == props.selectedCategory;
                        })
                        console.log('progress of catagory...', cat[0].category_progress)
                        return { ...prev, [props.selectedCategory]: cat[0].category_progress }
                    })

                    let arrayOfObjects = response.data.health_check_summary_table.filter((data) => {
                        return data.category == props.selectedCategory;
                    })

                    let arrayOfInsights = [];

                    arrayOfObjects.forEach((data) => {
                        if (data.insights_details && data.insights_details.length) {
                            let obj = {
                                insights: data.insights_details,
                                mapped_health_options: data.mapped_health_options_summary_relationship_doc_name
                            }
                            arrayOfInsights.push(obj);
                        }
                    })

                    if (arrayOfInsights.length == 0) {
                        let obj = {
                            insights: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '600' }}>No Insights to show.</div>,
                            mapped_health_options: ""
                        }
                        arrayOfInsights.push(obj);
                    }
                    setSummaryTable(arrayOfInsights)
                }
            }
            populateTable();
        }
    }, [resp2, scoreTableRep])

    useEffect(() => {
        async function getdata() {
            // console.log("type of every object",typeof(summaryTable[0].insights))
            if (summaryTable.length && typeof (summaryTable[0].insights) == 'string') {
                let response = await getQuesDetailsOptionDetailsForInsightsApiCaller(summaryTable[currentPageNumber - 1].mapped_health_options);
                console.log("response of insights question link api", response);
                let questionData = await getCurrentQuestionApiCaller(response.data.question);
                console.log("insights question reponse", questionData);
                setQuestion(questionData.data.question);
                details = {
                    "form_session_token": props.sessionTokenId,
                    "question_link": questionData.data.name,
                    "financial_form_link": localStorage.getItem('healthCheckForm')
                }
                let answers = [];
                if (questionData.data.question_type == 'MCQ') {
                    if (questionData.data.choice_type == 'MULTIPLE_CHOICE') {
                        answers.push(response.data.option_text);
                    } else if (questionData.data.choice_type == 'SINGLE_CHOICE') {
                        answers.push(response.data.option_text);
                    }
                } else if (questionData.data.question_type == 'SLIDER') {
                    if (questionData.data.slider_type == 'Percent') {
                        answers.push(response.data.slider_max_value + '%')
                    } else if (questionData.data.slider_type == 'Amount') {
                        answers.push(IntToAmount(response.data.slider_max_value))
                    } else if (questionData.data.slider_type == 'Month') {
                        answers.push(response.data.slider_max_value)
                    } else if (questionData.data.slider_type == 'Year') {
                        answers.push(response.data.slider_max_value)
                    } else if (questionData.data.slider_type == 'Number') {
                        answers.push(response.data.slider_max_value)
                    } else if (questionData.data.slider_type == 'Day') {
                        answers.push(response.data.slider_max_value)
                    }
                }
                setAnswer(answers);
            }
        }
        getdata();
    }, [currentPageNumber, summaryTable])

    function clickHandler() {
        // setSelectedCategory={setSelectedCategory} setActiveCategory={setActiveCategory}
        props.setData();
        props.setSelectedCategory((prev) => {
            let index = categoryArray.indexOf(props.selectedCategory);
            return categoryArray[index + 1];
        });
        props.setActiveCategory((prev) => {
            let index = categoryArray.indexOf(props.selectedCategory);
            return { ...prev, [props.selectedCategory]: 0, [categoryArray[index + 1]]: 1 };
        })
    }

    function reportHandler(event) {
        if (props.setSelectedCategory) {
            props.setSelectedCategory('Report');
        }
    }

    return (
        <>
            {HCFR ? (
                <div className={styles.Container}>
                    <div className={styles.HeadingContainer}>
                        <div className={styles.HeadingsFlex}>
                            <div className={styles.Heading}>
                                <div className={styles.Heading1}>
                                    {props.selectedCategory}
                                </div>
                                <div className={styles.Heading2}>
                                    Insights
                                </div>
                            </div>
                            {/* <div className={styles.Reattempt}>
                                <Button
                                    size="lg"
                                    variant="fill"
                                    shape="round"
                                    className="border border-solid border-gray-900"
                                    leftIcon={<Image src={reloadImage} width={160} height={160} alt="Arrow 1" className="mr-2 w-[16px]" />}
                                // onClick={}
                                >
                                    Re-attempt</Button>
                            </div> */}
                        </div>
                        <div className={styles.Scores}>
                            <div className={styles.ScoreHeading}>
                                <Image src={infoCircle} alt="infoCircle" />
                                You scored {props.scoreOfCategory[props.selectedCategory]}/100!
                            </div>
                            <div className={styles.ScoreContent}>
                                These insights generated might feel a little generic. Complete all sections and get the full report for a detailed analysis.
                            </div>
                        </div>
                        <div className={styles.BtnContainer}>
                            {[...summaryTable].map((_, key) => {
                                return (<div key={'Insights' + key} className={`${styles.Btn} ${currentPageNumber == key + 1 ? styles.ActiveBtn : ''}`} onClick={() => { setAnswer([]); setQuestion(); setCurrentPageNumber(key + 1) }}></div>)
                            })}
                        </div>
                    </div>

                    {summaryTable.length ?
                        summaryTable.map((child, index) => {
                            if (currentPageNumber == index + 1) {
                                return (
                                    <React.Fragment key={`child_${index}`}>
                                        <div className={styles.ContentContainer}>
                                            “<span className={styles.Content}>
                                                {child.insights}
                                            </span>”
                                        </div>
                                    </React.Fragment>
                                );
                            }
                        })
                        :
                        <div className="animate-pulse w-full mt-6">
                            <div className="h-16 flex flex-wrap gap-2 rounded w-62">
                                <div className="h-3 bg-gray-400 rounded w-full"></div>
                                <div className="h-3 bg-gray-400 rounded w-full"></div>
                                <div className="h-3 bg-gray-400 rounded w-full"></div>
                                <div className="h-3 bg-gray-400 rounded w-32"></div>
                            </div>
                        </div>
                    }


                    <div className={styles.NextButtonContainer}>
                        <div className={styles.prevNextButton}>
                            <Button
                                size="lg"
                                variant="fill"
                                shape="round"
                                className="border border-solid border-teal-600"
                                onClick={() => { setAnswer([]); setQuestion(); currentPageNumber > 1 ? setCurrentPageNumber(currentPageNumber - 1) : setCurrentPageNumber(summaryTable.length) }}>
                                <Image src={insightsPrevArrow} alt="insightsPrevArrow" /></Button>
                            <Button
                                size="lg"
                                variant="fill"
                                shape="round"
                                className="border border-solid border-teal-600"
                                onClick={() => { setAnswer([]); setQuestion(); currentPageNumber < summaryTable.length ? setCurrentPageNumber(currentPageNumber + 1) : setCurrentPageNumber(1) }}>
                                <Image src={insightsNextArrow} alt="insightsNextArrow" /></Button>
                        </div>
                        <div>
                            {categoryArray.indexOf(props.selectedCategory) < 4 ? <Button
                                color="gray_900_0c"
                                size="lg"
                                variant="fill"
                                shape="round"
                                className="min-w-[132px] gap-2 font-semibold sm:px-5 bg-teal-600 text-white"
                                rightIcon={<Image src={arrowNext} width={160} height={160} alt="Arrow 1" className=" w-[16px]" />}
                                onClick={clickHandler}>Next Section</Button>
                                : (props.endOfForm ?
                                    <Button
                                        className={styles.NextButton} onClick={reportHandler}>View Report</Button> : '')}
                        </div>
                    </div>
                    <div className={styles.InsightsQuestions}>
                        {question && answer.length ?
                            <>
                                <div className={styles.QuestionContainer}>
                                    <div className={styles.Question}>
                                        {"Q."}
                                    </div>
                                    <div className={styles.QuestionText}>
                                        {question}
                                    </div>
                                </div>

                                <div className={styles.ResponseContainer}>
                                    <div className={styles.Response}>
                                        {"→"}
                                    </div>
                                    <div className={styles.ResponseTextContainer}>
                                        {answer.map((data, index) => {
                                            return (
                                                <div className={styles.ResponseText} key={'answers' + index}>
                                                    {data}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className=" rounded-md w-full mx-auto">
                                    <div className="animate-pulse pl-2 max-w-sm space-x-4">
                                        <div className="flex-1 space-y-6 py-1">
                                            <div className="h-2 bg-gray-400 rounded"></div>
                                            <div className="h-2 bg-gray-400 rounded w-48"></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>)
                :
                // <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                //     <CircularProgress />
                // </div>
                <div className="rounded-md w-full mx-auto">

                    <div className="animate-pulse w-full flex justify-between items-end">
                        <div className="flex flex-col justify-self-start text-start gap-2">
                            <div className="w-full h-2 bg-gray-400 max-w-sm rounded"></div>
                            <div className="h-3 bg-gray-400 max-w-sm rounded w-24"></div>
                        </div>
                        <div className="flex justify-self-end items-end">
                            <div className="h-10 bg-gray-400 max-w-sm rounded w-32"></div>

                        </div>
                    </div>
                    <div className="animate-pulse w-full space-x-4 mt-8">
                        <div className="h-16 flex flex-wrap gap-2 rounded bg-gray-300 w-62 p-4">
                            <div className="h-4 bg-gray-400 rounded w-48"></div>
                            <div className="h-3 bg-gray-400 rounded w-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 w-full mt-4">
                        {["a", "b", "c", "d", "e"].map((_, key) => {
                            return (<div key={'Insights' + key} className={`${styles.Btn} `} ></div>)
                        })}
                    </div>
                    <div className="animate-pulse w-full mt-6">
                        <div className="h-16 flex flex-wrap gap-2 rounded w-62">
                            <div className="h-3 bg-gray-400 rounded w-full"></div>
                            <div className="h-3 bg-gray-400 rounded w-full"></div>
                            <div className="h-3 bg-gray-400 rounded w-full"></div>
                            <div className="h-3 bg-gray-400 rounded w-32"></div>
                        </div>
                    </div>
                    <div className=" flex animate-pulse w-full mt-8 justify-between">
                        <div className="flex flex-row justify-between gap-4">
                            <div className="h-11 bg-gray-400 rounded w-24"></div>
                            <div className="h-11 bg-gray-400 rounded w-24 "></div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="h-11 bg-gray-400 rounded w-32 "></div>
                        </div>
                    </div>

                    <div className=" rounded-md w-full mx-auto mt-6">
                        <div className="animate-pulse pl-2 max-w-sm space-x-4">
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-gray-400 rounded"></div>
                                <div className="h-2 bg-gray-400 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    );
}

export default Insights;