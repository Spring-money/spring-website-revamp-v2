"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Img } from "./..";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAnswerSkip,
  selectEndOfCategory,
  selectFirstQuestionList,
  selectIsFilled,
  selectIsReport2,
  selectQuestionDetails,
  selectQuestionId,
  selectShowResult2,
  selectisLoading,
} from "@/app/features/Question/questionSelector";
import Cookies from "js-cookie";
import {
  setQuestionId,
  setEndOfCategory,
  setActiveLeadForm,
  setIsLoading,
  setShowResult2,
} from "@/app/features/Question/questionSlice";
import Image from "next/image";
import {
  selectCurrentCategory,
  selectShowReattempt,
  selectShowReport,
} from "@/app/features/DashBoard/CategorySelector";
import { setITMR, setShowReport } from "@/app/features/DashBoard/CategorySlice";
import { setIsReport2 } from "@/app/features/Question/questionSlice";

export default function PreviousNextQuestion({ selectedCategory, ...props }) {
  const [responseData, setResponseData] = useState(null);
  const [optionSelected, setoptionSelected] = useState(null);
  const [isFirst, setIsFirst] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const questionId = useSelector(selectQuestionId);
  const SESSION_COOKIE_KEY = "sm-token-2024";
  const token = Cookies.get(SESSION_COOKIE_KEY);
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("Next");
  const answerSkip = useSelector(selectAnswerSkip);
  const firstQuestionList = useSelector(selectFirstQuestionList);
  const currentCategory = useSelector(selectCurrentCategory);
  const isFilled = useSelector(selectIsFilled);
  const endOfCategory = useSelector(selectEndOfCategory);
  const report2 = useSelector(selectIsReport2);
  const showResult2 = useSelector(selectShowResult2);
  const [resultPage, setResultPage] = useState(false);

  const updatedQuestionDetails = useSelector(selectQuestionDetails);

  // useEffect for changing Text for button ---------------------------->

  useEffect(() => {
    if (answerSkip === 1 && !updatedQuestionDetails?.user_input_text_answer) {
      setButtonText("Skip");
    } else if (
      answerSkip === 1 &&
      updatedQuestionDetails?.user_input_text_answer
    ) {
      setButtonText("Next");
    } else if (answerSkip === 1 && endOfCategory === 1) {
      setButtonText("Show-Report");
    } else if (answerSkip === 0) {
      setButtonText("Next");
    }
  });

  useEffect(() => {
    if (questionId === firstQuestionList[currentCategory]) {
      setIsFirst(true);
    } else {
      setIsFirst(false);
    }
  }, [questionId]);

  // function for sending response for questions ------------->

  const sendUserResponseToApi = async (updatedQuestionDetails) => {
    const userResponse = {
      user: "", // Replace "userId" with the actual user ID
      form_session_token: token,
      profile_link: "", // Replace "profileId" with the actual profile ID
      question_link: updatedQuestionDetails.name,
      date_time: "2024-02-05 13:03:52",
      form: "FINFORM-Income Tax Savings Maximizer-24-01-05-91700",
      question_text: updatedQuestionDetails.question,
      slider_value: updatedQuestionDetails.slider_user_selected_value,
      user_input_text_answer: updatedQuestionDetails.user_input_text_answer,
      user_opt_in_status: updatedQuestionDetails.question_opt_status,
      user_no_input_read_flag: 1,
      scoring_weight: 1,
      question_categories: [
        {
          category_name: currentCategory,
        },
      ],
      options: updatedQuestionDetails?.options?.map((option, index) => ({
        idx: option.idx,
        option_index: option.option_index,
        option_text: option.option_text,
        is_correct: option.is_correct,
        is_selected: option.is_selected,
        option_weightage: option.option_weightage,
        option_score: option.option_score,
        option_color: option.option_color,
        text_input_option: option.text_input_option,
        text_input_type: option.text_input_type,
        text_input_character_limit: option.text_input_character_limit,
        user_input_options: option.user_input_options,
      })),
    };

    const apiUrl = "/api/pushUserResponseIncomeTax";

    try {
      const response = await axios.post(apiUrl, userResponse);
      if (response.status === 200) {
        // Handle success (e.g., show confirmation message)
      } else {
        throw new Error("Failed to push user response");
      }
    } catch (error) {
      console.error("Error pushing user response:", error);
      // Handle errors gracefully (e.g., show error message)
    }
  };
  const isReport2 = useSelector(selectIsReport2);

  useEffect(() => {
    if (
      updatedQuestionDetails &&
      updatedQuestionDetails.name === "FIN-QUES-240105-0002" &&
      updatedQuestionDetails.options[0].is_selected === 1
    ) {
      setResultPage(true);
    } else {
      setResultPage(false);
    }
  }, [updatedQuestionDetails]);

  useEffect(() => {
    if (currentCategory === "Income" && endOfCategory === 1 && resultPage) {
      dispatch(setShowResult2(true));
    }
  }, [endOfCategory, currentCategory]);

  useEffect(() => {
    const Report = async () => {
      try {
        const options = {
          method: "POST",
          url: "/api/get_incometax_report",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "insomnia/8.6.1",
            Authorization: "token 8ade055835bfbf6:d2798667872bffc",
          },
          data: {
            user: "",
            lead_profile_link: "",
            form_session_token: token,
            financial_form_link:
              "FINFORM-Income Tax Savings Maximizer-24-01-05-91700",
          },
        };

        const response = await axios(options);

        dispatch(setITMR(response.data.data.data));
      } catch (error) {
        setError(error.response.data.error || "An error occurred");
      }
    };
    if (currentCategory === "Donations" && endOfCategory === 1) {
      Report();
    } else if (
      showResult2 === true &&
      currentCategory === "Income" &&
      endOfCategory === 1
    ) {
      Report();
    }
  }, [currentCategory, endOfCategory]);

  let currentId = null;

  const questionList = responseData?.data.question_list;

  if (questionList) {
    currentId = questionList[selectedCategory];
  }

  const handleApiCall = async () => {
    dispatch(setIsLoading(true));

    setError(null);

    try {
      const response = await axios.post(
        `/api/nextQuestionRule?questionId=${questionId}&sessionToken=${token}`
      );
      const responseData = response.data;
      const { next_question, show_lead_form } = responseData;
      let end_of_category = responseData.end_of_category;

      dispatch(setEndOfCategory(end_of_category));
      dispatch(setQuestionId(next_question));
      if (show_lead_form === 1 && buttonText === "Next") {
        dispatch(setActiveLeadForm(true));
      } else if (show_lead_form === 1 && buttonText === "Skip") {
        dispatch(setActiveLeadForm(false));
      } else if (show_lead_form === 0) {
        dispatch(setActiveLeadForm(false));
      }
    } catch (error) {
      setError("Error fetching data from API");
    }
  };
  // function for handling next click ------------------------>
  const handleNextClick = async () => {
    try {
      // Wait for sendUserResponseToApi to complete
      await sendUserResponseToApi(updatedQuestionDetails);

      // Once sendUserResponseToApi is completed, call handleApiCall
      await handleApiCall();
    } catch (error) {
      console.error("Error handling next click:", error);
      // Handle errors gracefully
    }
  };

  // function for handling previous click ------------------->

  const handlePreviousClick = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await axios.post(
        `/api/previousQuestionIncome?questionId=${questionId}&sessionToken=${token}`
      );

      const previousQuestionId = response.data.data.previous_question;
      dispatch(setQuestionId(previousQuestionId));
    } catch (error) {
      console.log("error getting previous question", error);
    }
  };

  return (
    <div
      {...props}
      className="flex flex-wrap justify-between py-2 sm:justify-around"
    >
      {!isFirst && (
        <Button
          color="gray_900"
          size="lg"
          shape="round"
          leftIcon={
            <Image
              src="/images/arrowPrev.svg"
              alt="Arrow 1"
              width={16}
              height={16}
              className="mr-2"
            />
          }
          className="min-w-[132px] gap-auto my-2 font-medium sm:px-5 ml-2"
          onClick={() => handlePreviousClick()} // Call handlePreviousClick on Previous button click
        >
          Previous
        </Button>
      )}

      <Button
        color="gray_900_0c"
        size="lg"
        variant="fill"
        shape="round"
        rightIcon={
          <Image
            src="/images/arrowNext.svg"
            width={16}
            height={16}
            alt="Arrow 1"
            className="ml-2"
          />
        }
        className={`min-w-[132px] gap-auto font-semibold sm:px-5 text-white
        ${isFilled
            ? "bg-teal-600 text-white"
            : "bg-lightGray text-darkGrey"
          }
        transition-colors duration-500 ease-in-out`}
        onClick={isFilled ? handleNextClick : null} // Trigger API call on Next button click
      >
        {buttonText}
      </Button>
    </div>
  );
}
