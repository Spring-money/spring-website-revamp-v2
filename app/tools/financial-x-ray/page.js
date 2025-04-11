"use client";
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import date from "date-and-time";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";

// Component Imports
import LeftPanel from "./components/income-tax-revamp/LeftPanel";
import { Heading, Text } from "./components/income-tax-revamp";
import Quiz from "./components/level4/quiz/Quiz";
// import Promo from "@/components/tools/Promo";
import {
  getCompleteDetailsHealthCheckResultApiCaller,
  healthCheckReportResultApiCaller,
  getAllQuestionApiCaller,
  responsesByUserApiCaller,
  getUserIpApiCaller,
  getSessionTokenApiCaller,
} from "./components/level3/questions/Utitlity";
import Insights from "./components/level4/insights/Insights";
import LeadForm from "./utilities/LeadForm/LeadForm";
// import ShareButton from "@/app/academy/components/share-button/page"

// API Imports
import Api_Urls from "../../../Api_Urls";
import GetHealthCheckFormId from "../../../pages/api/Get_the_Health_Check_Form_ID_configured";

// Report Import
import Report from "../../x-ray-report/[name]/page";

// Image Imports
// import retirementCaluHeadImage from "@/app/academy/tools/retirement-goal-calculator/images/image 17.svg"
import x_ray_view_full_report_down_arrow from "../../../public/financial-x-ray/x_ray_view_full_report_down_arrow.svg";
import x_ray_report_download_btn_icon from "../../../public/financial-x-ray/x_ray_report_download_btn_icon.svg";
// import x_ray_report_share_btn_icon from "@/public/images/x_ray_report_share_btn_icon.svg";
import chevron_right_arrow from "../../../public/financial-x-ray/chevron_right_arrow.svg";
import ep_success_filled from "../../../public/financial-x-ray/ep_success-filled.svg";
import arrow_left from "../../../public/financial-x-ray/img_arrow_left.svg";
import xRayHeadImg from "../../../public/financial-x-ray/x-ray-1.png";

export default function Home() {
  const [data, setData] = useState();
  const [showReport, setShowReport] = useState(false);
  const [endOfForm, setEndOfForm] = useState(false);
  const [sessionFlag, setSessionFlag] = useState(false);
  const [dataFlag, setDataFlag] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Savings & Budgeting"
  );
  const [activeCategory, setActiveCategory] = useState({
    "Savings & Budgeting": 1,
    Investment: 0,
    Insurance: 0,
    Loans: 0,
    Taxation: 0,
    Report: 0,
  });

  const [progressCategory, setProgressCategory] = useState({
    "Savings & Budgeting": 0,
    Investment: 0,
    Insurance: 0,
    Loans: 0,
    Taxation: 0,
    Report: 0,
  });

  const [endOfCategory, setEndOfCategory] = useState({
    "Savings & Budgeting": 0,
    Investment: 0,
    Insurance: 0,
    Loans: 0,
    Taxation: 0,
    Report: 0,
  });

  const [scoreOfCategory, setScoreOfCategory] = useState({
    "Savings & Budgeting": 0,
    Investment: 0,
    Insurance: 0,
    Loans: 0,
    Taxation: 0,
    Report: 0,
  });

  const [totalScore, setTotalScore] = useState(0);
  const [totalProgress, setTotalProgress] = useState();

  const [sessionTokenId, setSessionTokenId] = useState();
  const [previousResponse, setPreviousResponse] = useState();
  const [responseID, setResponseID] = useState();
  const [reportFormLink, setReportFormLink] = useState();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [healthCheckFormId, setHealthCheckFormId] = useState();
  const [generatedToken, setGeneratedToken] = useState();
  const modalRef = useRef(null);

  useEffect(() => {
    if (generatedToken) {
      Cookies.set("sm-token-2024", generatedToken, { expires: 30 });
      setSessionTokenId(generatedToken);
    }
  }, [generatedToken]);
  useEffect(() => {
    if (healthCheckFormId) {
      localStorage.setItem("healthCheckForm", healthCheckFormId);
    }
  }, [healthCheckFormId]);
  useEffect(() => {
    // captured date and time for the first time user enter----------------------
    const now = new Date();
    const dateTime = date.format(now, "YYYY-MM-DD HH:mm:ss");

    const getHealthCheckFormId = async () => {
      const formType = {
        form_type: "X-RAY",
      };
      const healthCheckForm = await GetHealthCheckFormId(formType);
      setHealthCheckFormId(healthCheckForm);
    };
    getHealthCheckFormId();

    // captured user's device info------------------------
    const deviceInfo = window.navigator.userAgent;

    //captured user's device source-------------------------------
    let sBrowser,
      sUsrAg = navigator.userAgent;
    if (
      sUsrAg.indexOf("Firefox") > -1 ||
      sUsrAg.indexOf("Opera") > -1 ||
      sUsrAg.indexOf("OPR") > -1 ||
      sUsrAg.indexOf("Trident") > -1 ||
      sUsrAg.indexOf("Edge") > -1 ||
      sUsrAg.indexOf("Chrome") > -1
    ) {
      sBrowser = "Windows Web";
    } else if (sUsrAg.indexOf("Safari") > -1) {
      sBrowser = "Mac Web";
    } else {
      sBrowser = "Other";
    }

    //check for uuid in user's local storage-----------------------------------
    let uuid = localStorage.getItem("spring_uuid");

    if (!uuid) {
      // Generate a random UUID---------------------------------------
      function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }
      uuid = uuidv4();
      localStorage.setItem("spring_uuid", uuid);
    }

    const SESSION_COOKIE_KEY = "sm-token-2024";

    const existingToken = Cookies.get(SESSION_COOKIE_KEY);
    const isExpired = !existingToken;

    if (existingToken) {
      // console.log('if loop chala ...........');
      setSessionTokenId(existingToken);
    } else if (!existingToken || isExpired) {
      //get users ipv4 address--------------------------------
      const getUserIp = async () => {
        const ip = await getUserIpApiCaller();

        const payLoad = {
          session_form_link: localStorage.getItem("healthCheckForm"),
          session_device_source: sBrowser,
          session_device_id: uuid,
          session_device_information: deviceInfo,
          session_location: "",
          session_ip_address: ip,
          session_user: "",
          session_start_datetime: dateTime,
        };
        // call session token api to get generated tokken of user--------------------------

        if (ip !== null) {
          // console.log('health check form link...',localStorage.getItem('healthCheckForm'));
          const generateSessionToken = async () => {
            const generatedTokenResponse = await getSessionTokenApiCaller(
              payLoad
            );
            // console.log('cookies for session token......................',ip);
            setGeneratedToken(generatedTokenResponse);
          };
          generateSessionToken();
        }
      };
      getUserIp();
    }

    const xRayCompletedCategories = localStorage.getItem(
      "xRayCompletedCategories"
    )
      ? JSON.parse(localStorage.getItem("xRayCompletedCategories"))
      : endOfCategory;
    setEndOfCategory(xRayCompletedCategories);
    localStorage.setItem(
      "xRayCompletedCategories",
      JSON.stringify(xRayCompletedCategories)
    );
  }, [healthCheckFormId]);

  useEffect(() => {
    if (
      healthCheckFormId &&
      sessionTokenId &&
      selectedCategory &&
      selectedCategory !== "Report"
    ) {
      async function userPostedResponse() {
        const response = await responsesByUserApiCaller(
          selectedCategory,
          sessionTokenId
        );
        console.log("response", response);
        if (response && response.data.length === 0) {
          async function getAllQues() {
            const ques = await getAllQuestionApiCaller(selectedCategory);
            setData(ques.data[0].name);
            return ques;
          }
          setPreviousResponse(false);
          getAllQues();
        } else if (response && response.data.length !== 0) {
          setData(response.data[0].question_link);
          setPreviousResponse(true);
          setResponseID(response.data[0].name);
        }
        if (!dataFlag) {
          setDataFlag(true);
        }
      }
      userPostedResponse();
    }
  }, [selectedCategory, sessionTokenId, healthCheckFormId]);

  useEffect(() => {
    async function previousScoreAndProgress() {
      if (sessionTokenId != undefined) {
        const response = await healthCheckReportResultApiCaller(sessionTokenId);
        if (response?.length) {
          const data = await getCompleteDetailsHealthCheckResultApiCaller(
            response[0].name
          );
          let score = {
            "Savings & Budgeting": 0,
            Investment: 0,
            Insurance: 0,
            Loans: 0,
            Taxation: 0,
          };
          let categoryProgress = {
            "Savings & Budgeting": 0,
            Investment: 0,
            Insurance: 0,
            Loans: 0,
            Taxation: 0,
          };
          if (data) {
            let totalProgress = data.total_progress;
            let totalScore = data.total_score;

            data.health_check_score_table.forEach((key) => {
              score[key.category] = key.score;
              categoryProgress[key.category] = key.category_progress;
            });

            setProgressCategory(categoryProgress);
            setScoreOfCategory(score);
            setTotalProgress(totalProgress);
            setTotalScore(totalScore);
            if (totalProgress == 100) {
              setEndOfForm(true);
              setReportFormLink(data.name);
            }
          }
        }
      }
      if (sessionTokenId && !sessionFlag) {
        setSessionFlag(true);
      }
    }
    previousScoreAndProgress();
  }, [sessionTokenId]);

  const handleCategory = (category) => {
    const updatedActiveCategory = { ...activeCategory }; // Create a copy of the state object
    // Iterate through all keys in the updatedActiveCategory object
    if (category != selectedCategory) {
      setData();
      Object.keys(updatedActiveCategory).forEach((key) => {
        // If the current key (category) matches the clicked category,
        // set its value to 1 (active), otherwise set it to 0 (inactive)
        if (key === category) {
          updatedActiveCategory[key] = 1;
        } else {
          updatedActiveCategory[key] = 0;
        }
      });
      setActiveCategory(updatedActiveCategory);
      setSelectedCategory(category);
    }
  };

  const reportSection = (
    <span>
      <span className="text-teal-600">Ready!</span>
      <br />
      Financial X-Ray Report
    </span>
  );

  return (
    <div className="font-sans">
      <Helmet>
        <title>X-ray-revamp-new</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="flex flex-col items-center bg-gray-100 ">
        <div className="w-full mx-auto ">
          <div className="flex items-start gap-5 px-2 flex-col md:flex-row md:px-6">
            <div className=" py-6 self-stretch  sm:py-5">
              <div className="mb-6 border border-solid rounded-lg border-gray-900_3f bg-white-A700">
                <div className="flex flex-col gap-4 rounded-lg bg-white-A700 pt-[16px] ">
                  <div className="flex flex-col gap-4 px-4">
                    <div className="flex justify-between gap-5 self-stretch">
                      <div className="flex items-center gap-1.5">
                        <Link href={"/tools"}>
                          <Image
                            src={arrow_left}
                            width={20}
                            height={20}
                            alt="arrowdown_three"
                            className="h-[18px] w-[18px] self-end"
                          />
                        </Link>
                        <Heading as="h1">Tools</Heading>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 self-stretch">
                      <Image
                        src={xRayHeadImg}
                        width={60}
                        height={65}
                        alt="imagefifteen"
                        className=" object-cover"
                      />
                      <Text size="xl" as="p" className="!text-gray-900">
                        Financial X-Ray
                      </Text>
                      <Text size="xs" as="p" className="!text-gray-900_bf">
                        Get a customised snapshot of your financial health,
                        strengths and areas of improvement.
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col bg-gray-900_3f rounded-xl">
                    {endOfCategory["Taxation"] == 1 &&
                    endOfCategory["Loans"] == 1 &&
                    endOfCategory["Insurance"] == 1 &&
                    endOfCategory["Investment"] == 1 &&
                    endOfCategory["Savings & Budgeting"] == 1 ? (
                      <div
                        className={`bg-white-A700 cursor-pointer ${
                          selectedCategory === "Report"
                            ? "border-teal-400_05 border-l-4 bg-gray-200"
                            : ""
                        } hover:bg-gray-200`}
                        onClick={() => {
                            handleCategory("Report");
                            setActiveCategory(prev => ({...prev, Report: 1}));
                        }}
                      >
                        <LeftPanel
                          panelName={reportSection}
                          flag={activeCategory["Report"]}
                          icon={chevron_right_arrow}
                          className="flex items-center justify-between gap-5 p-[16px] border-b border-solid border-gray-900_3f"
                        />
                      </div>
                    ) : null}
                    <div
                      className={`bg-white-A700 cursor-pointer ${
                        selectedCategory === "Savings & Budgeting"
                          ? "border-teal-400_05 border-l-4 bg-gray-200"
                          : ""
                      } hover:bg-gray-200`}
                      onClick={() => {
                        handleCategory("Savings & Budgeting");
                        setActiveCategory(prev => ({...prev, "Savings & Budgeting": 1}));
                      }}
                    >
                      <LeftPanel
                        panelName="Savings & Budgeting"
                        className="flex items-center justify-between gap-5 p-[16px] border-b border-solid border-gray-900_3f"
                        flag={activeCategory["Savings & Budgeting"]}
                        icon={
                          endOfCategory["Savings & Budgeting"]
                            ? ep_success_filled
                            : ""
                        }
                      />
                    </div>
                    <div
                      className={`bg-white-A700 cursor-pointer ${
                        selectedCategory === "Investment"
                          ? "border-teal-400_05 border-l-4 bg-gray-200"
                          : ""
                      } hover:bg-gray-200`}
                      onClick={() => {
                        handleCategory("Investment");
                        setActiveCategory(prev => ({...prev, Investment: 1}));
                      }}
                    >
                      <LeftPanel
                        panelName="Investment"
                        flag={activeCategory["Investment"]}
                        icon={
                          endOfCategory["Investment"] ? ep_success_filled : ""
                        }
                        className="flex items-center justify-between gap-5 p-[16px] border-b border-solid border-gray-900_3f"
                      />
                    </div>
                    <div
                      className={`bg-white-A700 cursor-pointer ${
                        selectedCategory === "Insurance"
                          ? "border-teal-400_05 border-l-4 bg-gray-200"
                          : ""
                      } hover:bg-gray-200`}
                      onClick={() => {
                        handleCategory("Insurance");
                        setActiveCategory(prev => ({...prev, Insurance: 1}));
                      }}
                    >
                      <LeftPanel
                        panelName="Insurance"
                        flag={activeCategory["Insurance"]}
                        icon={
                          endOfCategory["Insurance"] ? ep_success_filled : ""
                        }
                        className="flex items-center justify-between gap-5 p-[16px] border-b border-solid border-gray-900_3f"
                      />
                    </div>
                    <div
                      className={`bg-white-A700 cursor-pointer ${
                        selectedCategory === "Loans"
                          ? "border-teal-400_05 border-l-4 bg-gray-200"
                          : ""
                      } hover:bg-gray-200`}
                      onClick={() => {
                        handleCategory("Loans");
                        setActiveCategory(prev => ({...prev, Loans: 1}));
                      }}
                    >
                      <LeftPanel
                        panelName="Loans"
                        flag={activeCategory["Loans"]}
                        icon={endOfCategory["Loans"] ? ep_success_filled : ""}
                        className="flex items-center justify-between gap-5 p-[16px] border-b border-solid border-gray-900_3f"
                      />
                    </div>
                    <div
                      className={`bg-white-A700 cursor-pointer rounded-b-lg ${
                        selectedCategory === "Taxation"
                          ? "border-teal-400_05 border-l-4 bg-gray-200"
                          : ""
                      } hover:bg-gray-200`}
                      onClick={() => {
                        handleCategory("Taxation");
                        setActiveCategory(prev => ({...prev, Taxation: 1}));
                      }}
                    >
                      <LeftPanel
                        panelName="Taxation"
                        flag={activeCategory["Taxation"]}
                        icon={
                          endOfCategory["Taxation"] ? ep_success_filled : ""
                        }
                        className="flex items-center justify-between gap-5 p-[16px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              <div className="flex md:w-[60%] py-6 w-full sm:py-5">
                <div
                  className={`relative mb-6 flex w-full flex-col gap-4 rounded-lg border border-solid border-gray-900_3f bg-white-A700 p-[16px] overflow-hidden ${
                    endOfCategory[selectedCategory] === 1 ||
                    showReport ||
                    selectedCategory !== "Report"
                      ? "h-full"
                      : "h-screen"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap self-start gap-1">
                      <Link href={"/tools"}>
                        <Text
                          size="xs"
                          as="p"
                          className="self-start !font-medium !text-teal-600"
                        >
                          Tools
                        </Text>
                      </Link>
                      <Text
                        size="xs"
                        as="p"
                        className="self-start !font-medium !text-teal-600"
                      >
                        &gt;
                      </Text>
                      <Text
                        size="xs"
                        as="p"
                        className="self-end !font-medium !text-teal-600"
                      >
                        Financial X-Ray
                      </Text>
                      <Text
                        size="xs"
                        as="p"
                        className="self-start !font-medium !text-teal-600"
                      >
                        &gt;
                      </Text>
                      <Text
                        size="xs"
                        as="p"
                        className="self-start !font-medium !text-teal-600"
                      >
                        {selectedCategory}
                      </Text>
                    </div>
                    {selectedCategory == "Report" &&
                    endOfCategory["Report"] === 1 ? (
                      <div className="flex justify-center items-center gap-2 ">
                        <a
                          href={
                            Api_Urls.springMoneyX_rayReport + reportFormLink
                          }
                          target="_blank"
                        >
                          <div className="flex justify-center items-center border border-zinc-500 rounded text-zinc-800 py-1.5 px-3">
                            <Image
                              className="social-media-img"
                              src={x_ray_report_download_btn_icon}
                              alt="download-btn"
                            />
                          </div>
                        </a>
                        {/* <ShareButton position={"left center"} url={encodeURI(Api_Urls.springMoneyX_rayReport+reportFormLink)} /> */}
                      </div>
                    ) : null}
                  </div>
                  {selectedCategory == "Report" ? (
                    <Report name={reportFormLink} />
                  ) : (
                    data && (
                      <>
                        {endOfCategory[selectedCategory] == 0 ? (
                          <Quiz
                            responseID={responseID}
                            setPreviousResponse={setPreviousResponse}
                            previousResponse={previousResponse}
                            sessionTokenId={sessionTokenId}
                            firstQuestion={data}
                            progressCategory={progressCategory}
                            setProgressCategory={setProgressCategory}
                            selectedCategory={selectedCategory}
                            endOfCategory={endOfCategory}
                            setEndOfCategory={setEndOfCategory}
                            setEndOfForm={setEndOfForm}
                            setReportFormLink={setReportFormLink}
                            setTotalProgress={setTotalProgress}
                          />
                        ) : (
                          <Insights
                            reportLink={Api_Urls.springMoneyX_rayReport}
                            modalRef={modalRef}
                            setProgressCategory={setProgressCategory}
                            sessionTokenId={sessionTokenId}
                            setSelectedCategory={setSelectedCategory}
                            setActiveCategory={setActiveCategory}
                            selectedCategory={selectedCategory}
                            setScoreOfCategory={setScoreOfCategory}
                            setData={setData}
                            endOfForm={endOfForm}
                            setReportFormLink={setReportFormLink}
                            setTotalScore={setTotalScore}
                            reportFormLink={reportFormLink}
                            showReport={showReport}
                            scoreOfCategory={scoreOfCategory}
                          />
                        )}
                      </>
                    )
                  )}

                  {!showReport &&
                  selectedCategory === "Report" &&
                  endOfCategory["Report"] === 0 ? (
                    <div
                      className="absolute w-full h-28 bottom-4 pt-12 pb-4"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.2))",
                      }}
                    >
                      <div className="flex justify-center gap-2">
                        <div
                          className="flex justify-center gap-2 rounded items-center px-6 py-2.5 bg-emerald-600 w-48 hover:cursor-pointer"
                          onClick={() => {
                            setShowLeadForm(true);
                          }}
                        >
                          <span className="text-sm text-slate-50 font-semibold">
                            View Full Report
                          </span>
                          <Image
                            className="social-media-img"
                            src={x_ray_view_full_report_down_arrow}
                            alt="whatsapp-contact"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <LeadForm
                  showLeadForm={showLeadForm}
                  setShowLeadForm={setShowLeadForm}
                  reportLink={Api_Urls.springMoneyX_rayReport}
                  endOfForm={endOfForm}
                  setShowReport={setShowReport}
                  modalRef={modalRef}
                  reportFormLink={reportFormLink}
                  sessionTokenId={sessionTokenId}
                />
              </div>
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}
