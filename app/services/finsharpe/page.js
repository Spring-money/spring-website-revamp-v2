"use client";
import style from "../finsharpe/page.module.css";
import Image from "next/image";
import FineSharp from "../components/images/FineSharpLarge.svg";
import Accreditations from "../components/images/Accreditations.svg";
import RohanPic from "../components/images/image 29.svg";
import linkdinPic from "../components/images/logos_linkedin-icon.svg";
import SabirPic from "../components/images/image 28.svg";
import phone from "../components/images/phone.svg";
import mail from "../components/images/mail.svg";
import YouTube from "react-youtube";

export default function FinSharpeAdvisorsOverview() {
  const opts = {
    height: "390",
    width: "100%",
  };
  return (
    <div className={style.container}>
      <div className={style.leftMiddlePannel}>
        {/* <div className={style.leftPannel}>
                        <LeftPannel
                            selected={"Overview"}
                        />
                        <div className={style.leftPannelLowerCard}>
                            <LeftPannelLowerCard />
                        </div>
                    </div> */}
        <div className={style.middlePannel}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={style.topHead}>
              <div>
                <Image src={FineSharp} alt="FinSharpe Investment Advisors logo" />
              </div>
              <div>
                <div className={style.text1}>
                  <span>FinSharpe Investment Advisors</span>
                </div>
                <div className={style.text2}>
                  <span>Principal Advisor: Rohan Borawake</span>
                </div>
                <div className={style.upper4}>
                  <span>SEBI RIA Reg No: INA000018489</span>
                </div>
              </div>
            </div>
            <div className={style.linkdinPic}>
              <Image
                src={linkdinPic}
                alt="LinkedIn icon"
                width={30}
                style={{ marginTop: "1.25vw" }}
              />
            </div>
          </div>
          <div
            className={style.middleTextConatinerText2}
            style={{ marginBottom: "1.25vw" }}
          >
            <span>
              FinSharpe is a SEBI registered investment advisor that creates
              long term investment strategies using quantitative finance.
            </span>
          </div>
          <hr className={style.horizontalLine} />
          <div className={style.middleTextConatiner}>
            <div className={style.middleTextConatinerText1}>
              <span>Why FinSharpe?</span>
            </div>
            <div
              style={{
                width: "100%",
                marginBottom: "1.25vw",
                marginTop: "1.25vw",
              }}
            >
              {/* <Image src={youtubeVideoImg} style={{ width: '100%' }} /> */}
              <YouTube videoId="3UJcfUdvF4U" opts={opts} />
            </div>
            <div className={style.middleTextConatinerText2}>
              <span>
                FinSharpe came into existence to enable investors to reduce
                psychological biases from investment decisions by providing data
                driven insights. As fiduciaries, we offer investment advice with
                full transparency and without any conflict of interest.
              </span>
            </div>
          </div>
          <hr className={style.horizontalLine} />
          <div className={style.middleTextConatiner}>
            <div className={style.middleTextConatinerText1}>
              <span>The Process</span>
            </div>
            <div
              className={style.middleTextConatinerText2}
              style={{ marginTop: "1%" }}
            >
              <span>
                We follow a thorough research process that comprises of :-
              </span>
              <li>
                Ranking
                <ul style={{ marginLeft: "3%" }}>
                  An appropriate universe with a suitable benchmark is selected
                  based on the investment theme. Fundamental & pricing factors
                  that have a long-term relation with the assets are applied to
                  rank the universe.
                </ul>
              </li>
              <li>
                Allocation
                <ul style={{ marginLeft: "3%" }}>
                  Advanced statistical methods are applied to find the optimal
                  asset allocation on the efficient frontier curve. Constraints
                  on security and sector level weights are applied with a
                  suitable rebalance frequency to create an optimal portfolio.
                </ul>
              </li>
              <li>
                Risk Management
                <ul style={{ marginLeft: "3%" }}>
                  A 10+ years backtest is done after accounting for various data
                  biases, trading fees, & slippages with a dataset of more than
                  2 million records. The strategies are evaluated based on 50+
                  performance parameters to ensure comparitive.
                </ul>
              </li>
            </div>
          </div>
          <hr className={style.horizontalLine} />
          <div className={style.middleTextConatiner}>
            <div className={style.middleTextConatinerText1}>
              <span>The Founders</span>
            </div>
            <div style={{ display: "flex", gap: "4%" }}>
              <div className={style.founders}>
                <Image src={RohanPic} alt="Founder Rohan Borawake portrait" />
                <span className={style.middleTextConatinerText2}>
                  Rohan Borawake
                </span>
                <Image src={linkdinPic} alt="LinkedIn icon" />
              </div>
              <div className={style.founders}>
                <Image src={SabirPic} alt="Founder Sabir Jana (CFA) portrait" />
                <span className={style.middleTextConatinerText2}>
                  Sabir Jana (CFA)
                </span>
                <Image src={linkdinPic} alt="LinkedIn icon" />
              </div>
            </div>
          </div>
          <hr className={style.horizontalLine} />
          <div className={style.middleTextConatiner}>
            <div className={style.middleTextConatinerText1}>
              <span>Accreditations</span>
            </div>
            <div>
              <Image
                src={Accreditations}
                alt="Accreditations logos"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <hr className={style.horizontalLine} />
          <div className={style.middleTextConatiner}>
            <div className={style.middleTextConatinerText1}>
              <span>Compliance & Grievances</span>
            </div>
            <div
              className={style.middleTextConatinerText2}
              style={{ marginTop: "1%" }}
            >
              <span>Principal Officer: Mr. Rohan Borawake</span>
              <div style={{ display: "flex", alignItems: "center", gap: "1%" }}>
                <Image src={phone} alt="Phone icon" />
                <span>+91 9923411966</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1%" }}>
                <Image src={mail} alt="Email icon" />
                <span>info@finsharpe.com</span>
              </div>
            </div>
            <div
              className={style.middleTextConatinerText2}
              style={{ marginTop: "1%" }}
            >
              <span>Compliance & Grievance Officer: Mr. Sabir Bakir Jana</span>
              <div style={{ display: "flex", alignItems: "center", gap: "1%" }}>
                <Image src={phone} alt="Phone icon" />
                <span>+91 7028004994</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1%" }}>
                <Image src={mail} alt="Email icon" />
                <span>info@finsharpe.com</span>
              </div>
              <span>For grievances - https://smartodr.in/</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={style.leftPannelLowerCardMobile}>
                    <LeftPannelLowerCard />
                </div>
                <div className={style.rightPannel}>
                    <RightPannel />
                </div> */}
    </div>
  );
}
