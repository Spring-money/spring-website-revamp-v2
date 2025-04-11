"use client";
import React, { useState, useEffect, useRef, useDeferredValue } from "react";
import { Button, Img, Text } from "./..";
import AmountSlider from "@/app/components/level2/sliders/AmountSlider";
import PercentSlider from "@/app/components/level2/sliders/PercentSlider";
import NumberSlider from "@/app/components/level2/sliders/NumberSlider";
import YearSlider from "@/app/components/level2/sliders/YearSlider";
import MonthSlider from "@/app/components/level2/sliders/MonthSlider";
import AadharCardInput from "@/app/components/level2/inputs/AadharCardInput";
import AmountInput from "@/app/components/level2/inputs/AmountInput";
import CalendarInput from "@/app/components/level2/inputs/CalendarInput";
import CheckBoxInput from "@/app/components/level2/inputs/CheckBoxInput";
import EmailInput from "@/app/components/level2/inputs/EmailInput";
import Input from "@/app/components/level1/inputs/Inputs";
import NumberInput from "@/app/components/level2/inputs/NumberInput";
import PanCardInput from "@/app/components/level2/inputs/PanCardInput";
import PasswordInput from "@/app/components/level2/inputs/PasswordInput";
import PercentInput from "@/app/components/level2/inputs/PercentInput";
import PhoneNumberInput from "@/app/components/level2/inputs/PhoneNumberInput";
import TextInput from "@/app/components/level2/inputs/TextInput";
import Cookies from "js-cookie";
import Result from "@/app/result/page";
import ProgressBar from "@/components/income-tax-calculator/progressBar.js";
import CustomSlider from "@/components/income-tax-calculator/slider";
import { CircularProgress } from "@mui/material";
import axios from "../../../components/income-tax-calculator/axiosInstance";
import DaySlider from "@/app/components/level2/sliders/DaySlider";
import { useDispatch, useSelector } from "react-redux";
import {
  setAnswerSkip,
  setFirstQuestionsList,
  setIsFilled,
  setIsLoading,
  setQuestionId,
} from "@/app/features/Question/questionSlice";
import {
  selectActiveLeadForm,
  selectAnswerSkip,
  selectCompletedCategory,
  selectLeadFormSubmitted,
  selectQuestionDetails,
  selectQuestionId,
  selectShowInsight,
  selectShowResult,
  selectisLoading,
} from "@/app/features/Question/questionSelector";
import { setQuestionDetails } from "@/app/features/Question/questionSlice";
import LeadForm from "@/app/income-tax-calculator/LeadForm/LeadForm";
import LeadFormComponent from "../leadForm/page";
import { selectCurrentCategory } from "@/app/features/DashBoard/CategorySelector";
import { setCurrentCategory } from "@/app/features/DashBoard/CategorySlice";
import Insights from "../Insights/page";

export default function QuestionModule({
  selectedCategory,
  handleCategorySelection,
  handleCategoryChange,

  ...props
}) {
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [fetchedQuestionDetails, setFetchedQuestionDetails] = useState([]);
  const [options, setOptions] = useState([]);
  const [is_selected, setIsSelected] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [lastQuestionList, setLastQuestionList] = useState([]);
  const [firstQuestionList, setFirstQuestionList] = useState([]);
  const [input, setInput] = useState(null);
  const [lastCategory, setLastCategory] = useState(null);
  const dispatch = useDispatch();
  const SESSION_COOKIE_KEY = "sm-token-2024";
  const token = Cookies.get(SESSION_COOKIE_KEY);
  const isLoading = useSelector(selectisLoading);
  const showLeadForm = useSelector(selectActiveLeadForm);
  const leadFormSubmitted = useSelector(selectLeadFormSubmitted);
  const currentCategory = useSelector(selectCurrentCategory);
  const [responseRecieved, setResponseRecieved] = useState(false);
  const completedCategory = useSelector(selectCompletedCategory);
  const [isQ, setIsQ] = useState(true);
  const showInsight = useSelector(selectShowInsight);
  const [multiInput, setMultiInput] = useState([]);
  const [updatedQuestionDetailsOptions, setUpdatedQuestionDetailsOptions] =
    useState();
  const [isNoneOfTheAboveSelected, setIsNoneOfTheAboveSelected] =
    useState(false);
  const [sliderInput, setSliderInput] = useState(null);

  const handleUserResponse = (optionText) => {
    if (fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE") {
      if (optionText === "None of the above") {
        setSelectedAnswer((prevSelectedAnswer) => {
          if (prevSelectedAnswer.includes("None of the above")) {
            // If "None of the above" is already selected, deselect it
            return [];
          } else {
            // Otherwise, clear all other selections and select "None of the above"
            return ["None of the above"];
          }
        });
      } else {
        // Toggle selection for multiple-choice questions
        setSelectedAnswer((prevSelectedAnswer) => {
          if (prevSelectedAnswer.includes(optionText)) {
            return prevSelectedAnswer.filter(
              (selected) => selected !== optionText
            );
          } else {
            // If selecting another option, ensure "None of the above" is deselected
            return [
              ...prevSelectedAnswer.filter(
                (selected) => selected !== "None of the above"
              ),
              optionText,
            ];
          }
        });
      }
    } else if (fetchedQuestionDetails.choice_type === "SINGLE_CHOICE") {
      // For single-choice questions, selecting any option clears "None of the above"
      if (optionText === "None of the above") {
        setSelectedAnswer(["None of the above"]);
      } else {
        setSelectedAnswer([optionText]);
      }
    }

    // Additional logic if needed
  };

  useEffect(() => {
    setInput(null);
    if (fetchedQuestionDetails.answer_skip_enabled === 1) {
      dispatch(setAnswerSkip(1));
    } else {
      dispatch(setAnswerSkip(0));
    }
  }, [fetchedQuestionDetails]);

  const questionId = useSelector(selectQuestionId);

  // function for fetching question detials based on ID -------------------->

  const fetchQuestionDetailsOfId = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await axios.post(
        `/api/QuestionDetailsBasedOnId?questionId=${questionId}&&sessionToken=${token}`
      );
      if (response.status === 200) {
        const questionDetails = response.data.data.data;
        setFetchedQuestionDetails(questionDetails);
        setOptions(questionDetails.options);
        return questionDetails;
      } else {
        throw new Error("Failed to fetch question details");
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
      return null;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    setFetchedQuestionDetails([]);
    if (questionId) {
      fetchQuestionDetailsOfId(questionId);
    }
  }, [questionId]);

  useEffect(() => {
    if (
      fetchedQuestionDetails.question_type === "NO_INPUT" ||
      fetchedQuestionDetails.question_type === "OPT_IN"
    ) {
      setIsQ(false);
    } else {
      setIsQ(true);
    }
  }, [fetchedQuestionDetails]);

  // UseEffect for getting first and Last questions--------------------------->

  useEffect(() => {
    const firstAndLastQuestions = async () => {
      try {
        dispatch(setIsLoading(true));

        const response = await axios.get(
          `/api/IncomefirstAndLastQuestion?token=${token}`
        );
        if (response.status === 200) {
          setLastCategory(response.data.data.last_attempted_category);
          setLastQuestionList(response.data.data.last_attempted_list);
          setFirstQuestionList(response.data.data.question_list);
          dispatch(setFirstQuestionsList(response.data.data.question_list));
          setResponseRecieved(true);
        } else {
          throw new Error("Failed to fetch questions in first and last");
        }
      } catch (error) {
        console.error("Error fetching questions in first and last:", error);
      } finally {
      }
    };

    firstAndLastQuestions();
  }, []);

  // UseEffect for fetching Last Category ----------------------->
  useEffect(() => {
    if (lastCategory) {
      dispatch(setCurrentCategory(lastCategory));
    }
    if (lastCategory && lastQuestionList) {
      dispatch(setQuestionId(lastQuestionList[lastCategory]));
    }
  }, [lastCategory]);

  const handleCheckBoxChange = () => {
    const newValue = fetchedQuestionDetails.question_opt_status === 0 ? 1 : 0; // Toggle between 0 and 1
    // Update fetchQuestionDetails with the new value
    const updatedQuestionDetails = {
      ...fetchedQuestionDetails,
      opt_in_status_default: newValue, // Update the question_opt_status field
    };
    dispatch(setQuestionDetails(updatedQuestionDetails));
  };

  //useEffect for handling all types of initial values ---------------------->

  useEffect(() => {
    if (fetchedQuestionDetails) {
      if (
        fetchedQuestionDetails.question_type === "MCQ" &&
        fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
      ) {
        fetchedQuestionDetails.options.map((option) => {
          if (option.is_selected === 1) {
            setSelectedAnswer([option.option_text]);
          }
        });
      }

      if (
        fetchedQuestionDetails.question_type === "MCQ" &&
        fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE"
      ) {
        const newSelectedAnswer = [];

        fetchedQuestionDetails.options.forEach((option) => {
          // Check if the option is selected
          if (option.is_selected === 1) {
            newSelectedAnswer.push(option.option_text);
          }
        });

        setSelectedAnswer(newSelectedAnswer);
      }

      if (fetchedQuestionDetails.question_type === "USER_INPUT") {
        if (fetchedQuestionDetails.user_input_text_answer) {
          setInput(fetchedQuestionDetails.user_input_text_answer);
        }
      }
    }
  }, [fetchedQuestionDetails]);

  useEffect(() => {
    if (selectedAnswer.length > 0) {
      dispatch(setIsFilled(true));
    } else if (input === null) {
      dispatch(setIsFilled(false));
    } else if (input !== null) {
      dispatch(setIsFilled(true));
    } else {
      dispatch(setIsFilled(false));
    }
  }, [selectedAnswer, input]);

  // Section for all types of Question ------------------->

  const renderOptions = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "MCQ" &&
      fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
    ) {
      const updatedQuestionDetails = {
        ...fetchedQuestionDetails, // Spread existing properties of fetchedQuestionDetails
        options: fetchedQuestionDetails.options.map((option) => ({
          ...option,
          is_selected: selectedAnswer.includes(option.option_text) ? 1 : 0,
        })),
      };

      dispatch(setQuestionDetails(updatedQuestionDetails));

      return (
        <div className="flex flex-wrap gap-3 mt-4 ">
          {fetchedQuestionDetails.options.map((option, index) => (
            <Button
              key={index}
              color="gray_900"
              size="lg"
              shape="round"
              onClick={() => handleUserResponse(option.option_text)}
              className={
                selectedAnswer.includes(option.option_text)
                  ? "bg-gray-950 text-white hover:bg-gray-950 hover:text-white"
                  : "hover:bg-gray-950 hover:text-white"
              }
            >
              {option.option_text}
            </Button>
          ))}
        </div>
      );
    }
  };

  const renderOptionsMultipleChoice = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "MCQ" &&
      fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE"
    ) {
      // Loop through options to update is_selected property
      const updatedQuestionDetails = {
        ...fetchedQuestionDetails, // Spread existing properties of fetchedQuestionDetails
        options: fetchedQuestionDetails.options.map((option) => ({
          ...option,
          is_selected: selectedAnswer.includes(option.option_text) ? 1 : 0,
        })),
      };

      dispatch(setQuestionDetails(updatedQuestionDetails));

      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {fetchedQuestionDetails.options.map((option, index) => (
            <Button
              key={index}
              color="gray_900"
              size="lg"
              shape="round"
              onClick={() => handleUserResponse(option.option_text)}
              className={
                selectedAnswer.includes(option.option_text)
                  ? "bg-gray-950 text-white hover:bg-gray-950 hover:text-white"
                  : "hover:bg-gray-950 hover:text-white"
              }
            >
              {option.option_text}
            </Button>
          ))}
        </div>
      );
    }

    return null;
  };

  const sliderOption = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "SLIDER" &&
      fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
    ) {
      if (fetchedQuestionDetails.slider_type === "Percent") {
        return (
          <div>
            <PercentSlider
              value={sliderInput}
              setValue={(currentValue) => {
                const updatedQuestionDetails = {
                  ...fetchedQuestionDetails,
                  slider_value: currentValue,
                };
                setSliderInput(updatedQuestionDetails.slider_value);
                dispatch(setQuestionDetails(updatedQuestionDetails));
              }}
            />
          </div>
        );
      } else if (fetchedQuestionDetails.slider_type === "Amount") {
        return (
          <div>
            <AmountSlider
              value={sliderInput}
              setValue={(currentValue) => {
                const updatedQuestionDetails = {
                  ...fetchedQuestionDetails,
                  slider_value: currentValue,
                };

                setSliderInput(updatedQuestionDetails.slider_value);
                dispatch(setQuestionDetails(updatedQuestionDetails));
              }}
            />
          </div>
        );
      } else if (fetchedQuestionDetails.slider_type === "Day") {
        return (
          <div>
            <DaySlider />
          </div>
        );
      } else if (fetchedQuestionDetails.slider_type === "Month") {
        return (
          <div>
            <MonthSlider />
          </div>
        );
      } else if (fetchedQuestionDetails.slider_type === "Number") {
        return (
          <div>
            <NumberSlider />
          </div>
        );
      } else if (fetchedQuestionDetails.slider_type === "Year") {
        return (
          <div>
            <YearSlider />
          </div>
        );
      }
    }
  };

  const userInputOption = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "USER_INPUT" &&
      fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
    ) {
      if (fetchedQuestionDetails.user_input_type === "AadharCard") {
        return <AadharCardInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "Amount") {
        return (
          <AmountInput
            value={input}
            setValue={(currentValue) => {
              // Update fetchQuestionDetails with the entered amount value

              const updatedQuestionDetails = {
                ...fetchedQuestionDetails,
                user_input_text_answer: currentValue, // Update the user_input_text_answer field
              };

              setInput(updatedQuestionDetails.user_input_text_answer);

              dispatch(setQuestionDetails(updatedQuestionDetails));
            }}
          />
        );
      } else if (fetchedQuestionDetails.user_input_type === "Calendar") {
        return <CalendarInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "CheckBox") {
        return <CheckBoxInput />;
      } else if (fetchedQuestionDetails.user_input_type === "Email") {
        return <EmailInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "Input") {
        return (
          <Input
            setValue={(enteredValue) => {
              // Update fetchQuestionDetails with the entered amount value

              const updatedQuestionDetails = {
                ...fetchedQuestionDetails,
                user_input_text_answer: enteredValue, // Update the user_input_text_answer field
              };

              dispatch(setQuestionDetails(updatedQuestionDetails));
            }}
          />
        );
      } else if (fetchedQuestionDetails.user_input_type === "Number") {
        return <NumberInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "PanCard") {
        return <PanCardInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "Password") {
        return <PasswordInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "Percent") {
        return <PercentInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "PhoneNumber") {
        return <PhoneNumberInput handleUserInput={handleUserInput} />;
      } else if (fetchedQuestionDetails.user_input_type === "Text") {
        return (
          <TextInput
            value={input}
            setValue={(enteredValue) => {
              // Update fetchQuestionDetails with the entered amount value
              const updatedQuestionDetails = {
                ...fetchedQuestionDetails,
                user_input_text_answer: enteredValue, // Update the user_input_text_answer field
              };

              dispatch(setQuestionDetails(updatedQuestionDetails));
            }}
          />
        );
      } else {
        return null;
      }
    }
  };

  const noInputOption = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "NO_INPUT" &&
      fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
    ) {
      dispatch(setQuestionDetails(fetchedQuestionDetails));
      return <div></div>;
    }
  };

  const optionInput = () => {
    if (
      fetchedQuestionDetails &&
      fetchedQuestionDetails.question_type === "OPT_IN" &&
      fetchedQuestionDetails.choice_type === "SINGLE_CHOICE"
    ) {
      return (
        <div className="flex p-4 items-center gap-4 self-stretch rounded bg-[rgba(16,142,102,0.05)] mt-4">
          <input
            type="checkbox"
            className=""
            onChange={() => handleCheckBoxChange()}
          />{" "}
          <span className="flex-1 text-[rgba(39,43,42,0.90)] font-poppins text-sm font-medium leading-normal">
            {" "}
            {fetchedQuestionDetails.opt_in_text}
          </span>
        </div>
      );
    }
  };

  const handleInputChange = (optionText, value, index) => {
    // Update fetchedQuestionDetails with the new input value
    const updatedQuestionDetails = {
      ...updatedQuestionDetailsOptions,
      options: updatedQuestionDetailsOptions.options.map((option) =>
        option.option_text === optionText
          ? { ...option, user_input_options: value }
          : option
      ),
    };

    if (updatedQuestionDetails.options) {
      setUpdatedQuestionDetailsOptions(updatedQuestionDetails);
    }

    // Dispatch the updated question details
    dispatch(setQuestionDetails(updatedQuestionDetails));

    // Update the local state for multiInput at the specific index
    setMultiInput((prev) => {
      const newMultiInput = [...prev];
      newMultiInput[index] = value;
      return newMultiInput;
    });

    // Dispatch the updated question details again if necessary
    dispatch(setQuestionDetails(updatedQuestionDetails));
  };

  useEffect(() => {
    if (
      fetchedQuestionDetails.question_type === "USER_INPUT" &&
      fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE"
    ) {
      setUpdatedQuestionDetailsOptions(fetchedQuestionDetails);
      const arrayMulti = fetchedQuestionDetails.options.map(
        (option) => option.user_input_options || ""
      );
      setMultiInput(arrayMulti);
    }
  }, [fetchedQuestionDetails]);

  const renderUserInputMultipleChoice = () => {
    if (
      fetchedQuestionDetails.question_type === "USER_INPUT" &&
      fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE"
    ) {
      return (
        <div>
          {fetchedQuestionDetails.options.map((option, index) => (
            <div
              key={option.option_text}
              className="flex flex-col items-start self-stretch gap-2 pt-2"
            >
              <span className="font-sans text-base font-normal text-colors-darkGrey">
                {option.option_text}
              </span>
              <AmountInput
                value={multiInput[index]}
                setValue={(currentValue) =>
                  handleInputChange(option.option_text, currentValue, index)
                }
              />
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div {...props}>
      {isLoading ? (
        <>
          <div className="content-center w-full mt-2 mb-2 mr-8">
            <CircularProgress />
          </div>
        </>
      ) : (
        <>
          <>
            {!showInsight ? (
              <div>
                {isQ && (
                  <>
                    <span>Q. </span>
                  </>
                )}
                <span>{fetchedQuestionDetails.question}</span>
                {fetchedQuestionDetails.question_type === "MCQ" &&
                  fetchedQuestionDetails.choice_type === "SINGLE_CHOICE" ? (
                  <div>{renderOptions()}</div>
                ) : fetchedQuestionDetails.question_type === "MCQ" &&
                  fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE" ? (
                  <div>{renderOptionsMultipleChoice()}</div>
                ) : fetchedQuestionDetails.question_type === "SLIDER" &&
                  fetchedQuestionDetails.choice_type === "SINGLE_CHOICE" ? (
                  <div>{sliderOption()}</div>
                ) : fetchedQuestionDetails.question_type === "USER_INPUT" &&
                  fetchedQuestionDetails.choice_type === "SINGLE_CHOICE" ? (
                  <div>{userInputOption()}</div>
                ) : fetchedQuestionDetails.question_type === "NO_INPUT" &&
                  fetchedQuestionDetails.choice_type === "SINGLE_CHOICE" ? (
                  <div>{noInputOption()}</div>
                ) : fetchedQuestionDetails.question_type === "OPT_IN" &&
                  fetchedQuestionDetails.choice_type === "SINGLE_CHOICE" ? (
                  <div>{optionInput()}</div>
                ) : fetchedQuestionDetails.question_type === "USER_INPUT" &&
                  fetchedQuestionDetails.choice_type === "MULTIPLE_CHOICE" ? (
                  <div>{renderUserInputMultipleChoice()}</div>
                ) : null}
              </div>
            ) : (
              <>
                <Insights handleCategoryChange={handleCategoryChange} />
              </>
            )}
          </>
        </>
      )}
      {showLeadForm && leadFormSubmitted === 0 && <LeadFormComponent />}
    </div>
  );
}
