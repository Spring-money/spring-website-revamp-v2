import { selectSetITMR } from "@/app/features/DashBoard/CategorySelector";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Template from "@/app/report/components/Template/Template";
import TableTemplate from "@/app/report/components/TableTemplate/TableTemplate";
import Last from "@/app/report/components/Last/Last";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { FadeLoader } from "react-spinners";

const Report2 = () => {
  const [res, setRes] = useState(false);
  const [resData, setResData] = useState(false);
  let Id = useSelector(selectSetITMR);
  useEffect(() => {
    const getIncomeTaxReport = async () => {
      try {
        const response = await axios.get(`/api/income_report?id=${Id}`);
        if (response.status === 200) {
          setRes(true);
          setResData(response.data);
        } else {
          throw new Error("Failed to get income report");
        }
      } catch (error) {
        console.error("error in getting income report", error);
      }
    };

    getIncomeTaxReport();
  }, []);

  const targetRef = useRef(null);
  const downloadBtnRef = useRef(null);

  const generatePdf = async () => {
    if (targetRef.current) {
      const pdf = new jsPDF("portrait", "pt", "a4");
      let i = 0;
      for (let child of targetRef.current.children) {
        const data = await html2canvas(child);
        const img = data.toDataURL({
          format: "jpeg",
        });
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
          (imgProperties.height * pdfWidth) / imgProperties.width;
        if (i != 0) {
          pdf.addPage();
        }
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
        const links = Array.from(child.querySelectorAll("a"));

        const A4Width = pdfWidth; // A4 width in pixels
        const A4Height = pdfHeight; // A4 height in pixels

        const widthScaleFactor = A4Width / child.getBoundingClientRect().width;
        const heightScaleFactor =
          A4Height / child.getBoundingClientRect().height;

        const scale_factor = Math.min(widthScaleFactor, heightScaleFactor);
        links.forEach((link) => {
          const rect = link.getBoundingClientRect();
          const x =
            (rect.left - child.getBoundingClientRect().left) * scale_factor;
          const y =
            (rect.top - child.getBoundingClientRect().top) * scale_factor;
          const width = rect.width * scale_factor;
          const height = rect.height * scale_factor;
          pdf.link(x, y, width, height, { url: link.href });
        });
        i++;
      }
      pdf.save(`Income Tax Report-2.pdf`);
    }
  };

  function toPDF() {
    downloadBtnRef.current.classList.add("downloadBtnClicked");
    generatePdf();
    setTimeout(() => {
      downloadBtnRef.current.classList.remove("downloadBtnClicked");
    }, 500);
  }

  return (
    <>
      {res ? (
        <>
          <div ref={targetRef}>
            <div className="flex flex-col  self-stretch justify-evenly flex-1 w-[595px] h-[842px] p-[28px]  md:p-[28px 28px 96px 28px] items-center mx-auto  flex-shrink-0 bg-white ">
              <div className="flex flex-col items-center self-stretch gap-8">
                <div className="flex gap-4">
                  <div className="self-stretch text-[#0E5235] font-sans text-3xl font-semibold leading-normal">
                    Income Tax Savings Report
                  </div>
                  <button
                    className="flex flex-col justify-center items-center p-[0.25rem] px-3 rounded bg-[#108E66]"
                    ref={downloadBtnRef}
                    onClick={toPDF}
                  >
                    <span className="self-stretch text-white text-center font-sans text-sm font-semibold leading-normal">
                      Download
                    </span>
                  </button>
                </div>

                <div className="self-stretch text-[rgba(39,43,42,0.90)] font-poppins text-sm font-normal leading-normal">
                  The Income Tax Savings Report provides a snapshot of your
                  income taxes, highlighting maximum possible tax savings and
                  suggestions for filing taxes through old or new regime.
                </div>
              </div>

              <div className="flex p-5 flex-col items-start gap-5 self-stretch rounded-lg border border-solid border-[rgba(16,142,102,0.50)] bg-[rgba(16,142,102,0.05)]">
                <div className="flex items-center self-stretch gap-6">
                  <div className="w-18 h-18">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_556_1458)">
                        <path
                          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                          stroke="#108E66"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                          stroke="black"
                          stroke-opacity="0.2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12V9"
                          stroke="#108E66"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 12V9"
                          stroke="black"
                          stroke-opacity="0.2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 6H9.0075"
                          stroke="#108E66"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 6H9.0075"
                          stroke="black"
                          stroke-opacity="0.2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_556_1458">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex-1 text-[#108E66] font-poppins text-xs font-semibold leading-normal">
                    You do not have to pay tax, but you should file Income Tax
                    Return (ITR)
                  </div>
                </div>
                <div className="self-stretch text-[#272B2A] font-poppins text-xs font-normal leading-normal">
                  <p className="mb-2">
                    As your income is less than Rs 7,00,000, you will not have
                    to pay any tax under "New Regime". Under the "New Regime",
                    deductions for various investments or insurances are not
                    allowed.
                  </p>
                  <p className="mb-2">
                    Under "Old Regime", you will not have to pay any taxes if
                    you are earning below Rs 5,00,000.
                  </p>
                  <p className="mb-2">
                    Even though you do not have to pay tax, we strongly
                    recommend to file Income Tax Return (ITR), especially if
                    your income is above Rs 2,50,000. Not filing of income tax
                    returns may invite a notice from Income Tax Department.
                    Also, Income Tax Return is an important document which acts
                    as your income proof, especially if you want to avail a
                    loan, get benefits under some government or get a visa.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 p-2 bg-gray-800 rounded-md md:p-4">
                  <a
                    href="#"
                    class="text-white font-poppins text-xs font-semibold "
                  >
                    Click here to file ITR with our help
                  </a>
                  <div class="w-12 h-0 pb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="9"
                      viewBox="0 0 13 9"
                      fill="none"
                    >
                      <path
                        d="M12.3536 4.85355C12.5488 4.65829 12.5488 4.34171 12.3536 4.14645L9.17157 0.964466C8.97631 0.769204 8.65973 0.769204 8.46447 0.964466C8.2692 1.15973 8.2692 1.47631 8.46447 1.67157L11.2929 4.5L8.46447 7.32843C8.2692 7.52369 8.2692 7.84027 8.46447 8.03553C8.65973 8.2308 8.97631 8.2308 9.17157 8.03553L12.3536 4.85355ZM0 5H12V4H0V5Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-col self-stretch text-[#272B2A] font-poppins text-xs font-normal leading-normal">
                <p className="mb-2">
                  There are 7 key aspects which determine your tax amount:
                </p>
                <ul className="pl-4 mb-2 list-disc">
                  <li>Investments</li>
                  <li>HRA & Rent</li>
                  <li>Home Loan</li>
                  <li>Education Loan</li>
                  <li>Electric Vehicle Loan</li>
                  <li>Health Expenditures</li>
                  <li>Donations</li>
                </ul>
                <p className="mb-2">
                  Even though you don’t have to pay any tax right now, we have
                  provided more information about these aspects further in the
                  report. You can use this information to plan your taxes when
                  your income goes above Rs 7,50,000.
                </p>
              </div>
            </div>

            <Template
              data={resData.data}
              header="Exemptions & Deductions details"
            >
              <div className="point">
                <div className="point-heading">Investments</div>
                <ul className="point-content">
                  <li>
                    Under section 80C, the investments in various products are
                    allowed as deduction up to Rs 1,50,000. These products are
                    life insurance, provident fund, superannuation funds, ULIP,
                    Annuity Plan, Tuition Fee, 5 year FD, 5 year post office
                    deposits, Senior Citizen Schemes, ELSS Mutual Funds, NPS,
                    repayment of home loan (principal component), stamp duty
                    paid on home purchase and Tuition Fee.
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                  <li>
                    Under section 80CCD(1b), the investment in NPS is allowed as
                    deduction up to Rs 50,000. This is over and above the limit
                    of section 80C. However, please note, if you have claim the
                    deduction of NPS under 80C, then the same investment
                    can&apos;t be claimed under this section as well, you will
                    have to invest different amount in that case.
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                  <li>
                    Under section 80CCD(2), the contribution by employer in NPS
                    is allowed as deduction. The deduction is allowed upto 12%
                    of salary (Basic + DA) for government employees and 10% of
                    salary (Basic + DA) for non government employees. This is
                    over and above the limits of section 80C and 80CCD(1b).
                    <span>
                      This deduction is allowed under both old regime and new
                      regime.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="point">
                <div className="point-heading">HRA & Rent</div>
                <ul className="point-content">
                  <li>
                    Exemption for House Rent Allowance (HRA) is received under
                    section 10(13A). Under this section, lowest amount in
                    following 3 is exempted from being taxed.
                    <br />
                    1. HRA Received <br />
                    2. Rent paid - 10% of salary (Basic + DA)
                    <br />
                    3. 40%* of salary (Basic + DA)
                    <span>
                      *50% in case you are paying rent in
                      Delhi/Mumbai/Bengaluru/Kolkata.{" "}
                    </span>
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                  <li>
                    If you are not receiving HRA, but paying rent, then you may
                    get deduction under section 80GG. The amount of deduction is
                    lowest of the following,
                    <br />
                    1. Rs 5,000 per month
                    <br />
                    2. Rent Paid - 10% of Total Taxable Income (before deduction
                    under section 80GG)
                    <br />
                    3. 25% of Total Taxable Income (before deduction under
                    section 80GG)
                    <span>
                      This deduction is available only if exemption under HRA is
                      not claimed.
                    </span>
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                  <li>
                    Did you know? If you are living with your parents and you
                    pay rent to them, then it can be used to claim tax related
                    benefits.
                  </li>
                </ul>
              </div>
            </Template>
            {/* page no. 2 */}
            <Template data={resData.data}>
              <div className="point">
                <div className="point-heading">Home Loan</div>
                <ul className="point-content">
                  <li>
                    If you are paying interest on the home loan, then you can
                    get the tax benefits for the same under section 24.
                    <br /> If you are staying in the home (self - occupied
                    property) for which you have taken the loan, then you can
                    get benefit for interest paid up to Rs 2,00,000 only.
                    <br /> If you have put the home on rent (let out property)
                    for which you are paying interest, then no such limit is
                    applicable.
                    <span>
                      The benefit for interest payment in case of self -
                      occupied property is available only under old regime.
                      There is no such condition for let out property.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="point">
                <div className="point-heading">Education Loan</div>
                <ul className="point-content">
                  <li>
                    If you have taken an education loan, then you can get the
                    benefits for the interest you are paying on such loan. The
                    tax benefits are available to you without any limits if you
                    satisfy all of the following conditions:
                    <br />
                    1. You have taken loan for the education of
                    yourself/spouse/children
                    <br />
                    2. Loan is taken for educational degree after 12th standard.
                    <br />
                    3. The educational institute is approved by
                    central/state/local Government in India
                    <br />
                    4. Loan is taken from Bank/NBFC
                    <br />
                    5. 8 years have not been passed from the 1st time you have
                    paid the interest.
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="point">
                <div className="point-heading">Electric Vehicle Loan</div>
                <ul className="point-content">
                  <li>
                    If you have taken a loan to buy an electric vehicle, then
                    you can get the benefits for the interest you are paying on
                    such loan. The tax benefits are available to you for
                    interest paid up to Rs 1,50,000 per year if you satisfy all
                    of the following conditions
                    <br />
                    1. You have taken the loan between April 2019 and March
                    2023. <br />
                    2. Loan is taken from Bank/NBFC
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="point">
                <div className="point-heading">Donations</div>
                <ul className="point-content">
                  <li>
                    If you have made the donations to Government Funds,
                    registered Charitable Institutions, Scientific Research
                    Funds, Rural Funds then you can claim the tax benefits for
                    the same. The amount of benefit is either 50% or 100% of the
                    donations made.
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                  <li>
                    If you have made the donations to registered Political
                    Parties, then you can claim the tax benefits for the same.
                    The amount of benefit is 100% of the donations made.
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                </ul>
              </div>
            </Template>
            {/* page 3 */}
            <Template data={resData.data}>
              <div className="point">
                <div className="point-heading">Health Expenditure</div>
                <ul className="point-content">
                  <li>
                    Deduction under section 80D is available for Health
                    Insurance Premium paid, Medical Expenditure Incurred and
                    expenses paid for preventive health check up. The amount of
                    deduction available actual amount paid or following limits
                    whichever is lower.
                    <div className="KeypointsTable">
                      <div className="pointTable">
                        <div className="KeypointRow">
                          <div className="pointDataCommon"></div>
                          <div className="pointDataCommon pointCenter">
                            For Self, Spouse, Child
                          </div>
                          <div className="pointDataCommon pointCenter">
                            For Parents
                          </div>
                        </div>
                        <div className="pointRow pointTableHeading">
                          <div className="pointDataCommon"></div>
                          <div className="pointDataCommon pointCenter">
                            If nobody is above the age of 60
                          </div>
                          <div className="pointDataCommon pointCenter">
                            If at least 1 person is above the age of 60
                          </div>
                          <div className="pointDataCommon pointCenter">
                            If nobody is above the age of 60
                          </div>
                          <div className="pointDataCommon pointCenter">
                            If at least 1 person is above the age of 60
                          </div>
                        </div>
                        <div className="pointRow">
                          <div className="pointDataCommon">
                            Medical Insurance Premium
                          </div>
                          <div className="pointDataCommon pointCenter">
                            ₹ 25,000
                          </div>
                          <div className="pointDataCommon pointCenter">-</div>
                          <div className="pointDataCommon pointCenter">
                            ₹ 25,000
                          </div>
                          <div className="pointDataCommon pointCenter">-</div>
                        </div>
                        <div className="pointRow">
                          <div className="pointDataCommon">
                            Expenditure for Treatment*
                          </div>
                          <div className="pointDataCommon pointCenter">-</div>
                          <div className="pointDataCommon pointCenter pointRecommendedTableData">
                            ₹ 25,000
                          </div>
                          <div className="pointDataCommon pointCenter">-</div>
                          <div className="pointDataCommon pointCenter">
                            ₹ 25,000
                          </div>
                        </div>
                      </div>
                    </div>
                    <span>
                      *Benefits for medical expenditure are allowed only for
                      those for whom Medical Insurance Premium is not paid.
                      Expenses for health check up paid in cash up to Rs 5,000
                      is allowed within above mentioned limits only.
                    </span>
                    <span>
                      This deduction is allowed only under old regime.
                    </span>
                  </li>
                </ul>
              </div>
            </Template>
            <Last data={resData.data}>What&apos;s Next</Last>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center z-10">
            <FadeLoader color="#108E66" />
          </div>
        </>
      )}
    </>
  );
};

export default Report2;
