'use client';

import React from "react";
import './Footer.css'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import sm1 from './static/facebook.svg';
import sm2 from './static/instagram.svg';
import sm3 from './static/linkedin.svg';
import sm4 from './static/twitter.svg';
import sm5 from './static/whatsapp.svg';
import sm6 from './static/youtube.svg';
import Image from "next/image";
import bg from './static/honeyComb.svg';
import whatsapp_contact from './static/whatsapp_contact.svg';

export default function footer(props) {
    return (
        <div className="Footer">
            <Header>{props.children}</Header>
            <section className="Footer-content">
                <div className="connect">
                    <div className="connect-content-container">
                        <div className="connect-heading">
                            Connect with Spring Money
                        </div>
                        <div className="connect-content">
                            Make informed financial decisions and work on stress-free financial future. Discover expert financial strategies personalised just for you and take control of your financial future with our holistic advisory solutions. Let&apos;s embark on a journey to make smarter financial decisions together.
                        </div>
                    </div>
                    <div className="connect-btn">
                        <p><a href="https://wa.me/918459070919?text=Hey%2C%20I%20would%20like%20to%20book%20a%20call%20with%20financial%20expert%20at%20Spring%20Money.%20">Book a free introductory call</a></p>
                    </div>
                </div>
                <div className="second-para">
                    Spring Money empowers you to make smarter financial decisions through informative content and powerful tools. We simplify complex financial topics, provide personalised insights, and offer intuitive tools to take control of your money. Grow your knowledge, optimise your finances, and achieve your financial goals with Spring Money.
                    <a className="chatBtn" href="https://wa.me/918459070919" target="_blank"><Image className="social-media-img" src={whatsapp_contact} alt="whatsapp-contact" />

                    </a>
                </div>
                <div className="social-media">
                    <p>Find us on</p>
                    <div className="social-media-links">
                        {/* <a href="#"><Image className="social-media-img" src={sm1} alt="facebook"/></a> */}
                        <a href="https://www.instagram.com/springmoneyapp/"><Image className="social-media-img" src={sm2} alt="instagram" /></a>
                        <a href="https://www.linkedin.com/company/springmoney/"><Image className="social-media-img" src={sm3} alt="linkedin" /></a>
                        <a href="https://twitter.com/springmoneyapp"><Image className="social-media-img" src={sm4} alt="twitter" /></a>
                        {/* <a href="https://wa.me/918459070919"><Image className="social-media-img" src={sm5} alt="whatsapp"/></a> */}
                        <a href="https://www.youtube.com/@springmoney"><Image className="social-media-img" src={sm6} alt="youtube" /></a>
                    </div>
                </div>
            </section>
            <figure className="Footer-honeyComb-img">
                <Image src={bg} alt="honeyComb" />
            </figure>
            <div className="Template-line"></div>
            <div className="disclaimer">
                <div className="disclaimer-heading">
                    Disclaimer
                </div>
                <p className="disclaimer-content">
                    This Financial X-Ray Report has been prepared by 2AN Technologies Private Limited (&rsquo;Spring Money&rsquo;) based on the details provided by the user of this report. The findings of this report are meant to act as broad guidelines for attaining financial well-being. This assessment is not a recommendation or advice for making any financial or non-financial decision. Before making any financial decisions, the user must study and comprehend the applicable rules, regulations, and legal framework in addition to conducting his/her own independent analysis and due diligence. For more information, please visit our website <a href="https://spring.money" target="_blank">www.spring.money</a>.
                </p>
            </div>

        </div>
    )
}

