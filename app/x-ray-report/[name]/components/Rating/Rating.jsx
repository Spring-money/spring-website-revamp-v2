'use client';

import './Rating.css';
import Image from 'next/image';
import plant1 from './static/score1.svg'
import plant2 from './static/score2.svg'
import plant3 from './static/score3.svg'
import plant4 from './static/score4.svg'
import plant5 from './static/score5.svg'
import plant1Dark from './static/score1Dark.svg'
import plant2Dark from './static/score2Dark.svg'
import plant3Dark from './static/score3Dark.svg'
import plant4Dark from './static/score4Dark.svg'
import plant5Dark from './static/score5Dark.svg'



function Rating(props) {
    let score;
    if (props.score < 100) {
        score = Math.floor(props.score / 20);
    } else {
        score = 4;
    }
    let plants = [plant1, plant2, plant3, plant4, plant5]
    let plantsDark = [plant1Dark, plant2Dark, plant3Dark, plant4Dark, plant5Dark]
    let ratingText = ["Foundation Builder", "Learning Investor", "Growth Explorer", "Skilled Investor", "Wealth Architect"]

    let oddLines = {
        "Savings & Budgeting": {
            heading: [["Savings", "Fresher"], ["Financial", "Organizer"], ["Budgeting", "Pro"], ["Smart","Allocator"], ["Budget", "Expert"]],
            content: ["Welcome to the world of budgeting! At this stage, you're starting your budgeting journey. Hope you are on your way to learning basic financial management skills, understanding expenses, and starting to track your spending. Taking the initial steps toward financial organization is crucial, and you doing that's fantastic!", "Great progress! You're evolving as a financial organizer. Now you should be getting good at categorizing expenses, setting simple budgeting goals, and beginning to control unnecessary spending. Your commitment to organizing finances is commendable.", "Well done! You're getting proficient in budgeting. Setting realistic financial goals, tracking expenses meticulously, and using tools to manage your finances efficiently is what you should look forward to at this stage. Display responsible financial behavior and take charge of your financial future.", "Impressive work! You've elevated your budgeting skills. You're planning for the future, optimizing your budget, and adapting to financial changes and challenges. Taking a proactive approach and strategic financial planning will take you far in personal finance management. Best luck!", "Exceptional expertise! You're a master of budgeting. You're employing financial strategies, making smart investments, and setting a visionary financial course. Your comprehensive financial knowledge and exceptional budgeting skills set a benchmark for others."]
        },
        "Investment": {
            heading: [["Foundation", "Builder"], ["Learning", "Investor"], ["Growth", "Explorer"], ["Skilled","Investor"], ["Wealth", "Architect"]],
            content: ["Congratulations on stepping into the investment world! At this stage, being curious and eager to learn will help a lot. Let's start with absorbing basic concepts, grasping investment terms, and understanding the importance of savings. Your journey is just beginning, and it's fantastic that you're exploring new financial horizons", "Good job! Your future self will thank you for expanding your knowledge base about investment. Keep up with researching investment options, understanding risk, and learning about various asset classes. You're on path to make informed decisions. Keep showing enthusiasm to explore further. Have fun nurturing your curiosity!", "Well done! Diving deeper into the investment landscape will benefit you greatly. Gaining confidence in analyzing market trends, evaluating risks, and formulating strategies is worthwhile. Keep up with demonstrating proactive behavior, seeking expert advice, and making calculated investment decisions.", "Impressive work! You're translating knowledge into action. You're effectively executing your investment plans, monitoring markets, and adapting to changing conditions. Your proactive approach and disciplined behavior in managing your portfolio are commendable.", "Exceptional expertise! You're a visionary in the investment arena. Your extensive knowledge, astute decision-making, and forward-thinking approach set you apart. You're an inspiration, showcasing exceptional behavior, and influencing others positively in the investment realm."]
        },
        "Insurance": {
            heading: [["Novice", "Insured"], ["Growing", "Guard"], ["Learned", "Protector"], ["Proficient","Safeguard"], ["Masterful", "Insurer"]],
            content: ["You're starting your insurance journey! At this stage, keep learning the basics of insurance, understanding policy types, and grasping the importance of coverage. Your curiosity about insurance is commendable.", "Great job! You're progressing as an insurance learner. Let's keep getting familiar with various insurance options, comparing policies, and assessing basic coverage needs. Your growing knowledge will be helpful later.", "Excellent work! You've become proficient in protecting yourself through insurance. Understanding how to get adept at evaluating insurance coverage, understanding terms, and selecting policies aligned with your needs will help you a lot. Your focus on protection is admirable.", "Fantastic! You've evolved into an insurance planner. You're strategizing your insurance portfolio, optimizing coverage, and making informed decisions on complex policies. Your thoughtful planning stands out.", "Exceptional expertise! You're a master in insurance matters. Looks like you're keen to be adept at comprehensive risk management, devising intricate insurance plans, and providing insightful advice. Your extensive insurance knowledge and adept strategies are remarkable.",
            ]
        },
        "Taxation": {
            heading: [["Tax", "novice"], ["Tax", "learner"], ["Developing", "Planner"], ["Strategic","Tax-saver"], ["Tax", "Maestro"]],
            content: ["Welcome to the world of taxes! At this stage, learning about the basics of taxation should be focused on. Get started with understanding tax terms, filing procedures, and the importance of tax compliance. Your eagerness to learn will be essential!", "Well done! You're evolving as a tax learner. Getting familiar with tax deductions, exemptions, and basic filing requirements is important. Your efforts in understanding tax implications are commendable.", "Great progress! You've become proficient in tax efficiency. It is smart to be using tax-saving instruments, optimizing deductions, and planning finances around tax benefits. Your proactive approach to tax planning is impressive.", "Impressive work! You're a skilled tax strategist. You're utilizing advanced tax-saving schemes, investing tax-efficiently, and making informed financial decisions aligned with tax goals. Your strategic tax planning sets you apart.", "Exceptional expertise! You're a master of taxation. You're employing intricate tax-saving strategies, optimizing investments for tax benefits, and providing insightful tax advice. Your comprehensive tax knowledge and exceptional strategies are exemplary."]
        },
        "Loans": {
            heading: [["Novice", "Debtor"], ["Loan", "newbie"], ["Debt", "Controller"], ["Loan","Planner"], ["Debt", "Master"]],
            content: ["Congratulations! You're ready to embark on your loan journey. At this stage, it' will be helpful to explore basic loan options, understand relevant terms, and start evaluating your borrowing needs. Your initial curiosity will determine your progress.", "Great progress! You're initiating your loan journey. You're comfortable with different types of loans, comparing terms, and recognizing initial financial implications. Your learning curve is commendable.", "Well done! Managing loans effectively affects the overall financial health by huge margins. Let's keep getting proficient in assessing loan offers, planning repayments, and understanding the impact of borrowing on your finances. Your prudent loan management is impressive.", "Impressive growth! You've become a loan strategist. You excel in strategic borrowing decisions, optimizing loan structures, and minimizing interest costs. Your calculated approach to borrowing is admirable.", "Exceptional expertise! You're a master in managing loans. The ability to demonstrate advanced loan expertise, managing multiple debts astutely, and providing insightful guidance is impressive, when mastered. Your extensive knowledge and prudent borrowing strategies are remarkable.",]
        },
    }

    let heading = oddLines[props.category].heading[score][0]+" "+oddLines[props.category].heading[score][1];
    let content = oddLines[props.category].content[score];
    return (
        <section className="Rating">
            <div className="Rating-container">
                {ratingText.map((_, index) => {
                    if (index === score) {
                        return (<div key={"Rating" + index} className="Rating-logo-container"><div className={"Rating-logo-dark Rating-img-"+index}><Image className={"Rating-img-"+index} src={plantsDark[index]} alt="Rating-logo" /><p>{oddLines[props.category].heading[index][0]}<br/>{oddLines[props.category].heading[index][1]}</p></div></div>)
                    } else {
                        return (<div key={"Rating" + index} className="Rating-logo-container"><div className={"Rating-logo Rating-img-"+index}><Image className={"Rating-img-"+index} src={plants[index]} alt="Rating-logo" /><p>{oddLines[props.category].heading[index][0]}<br/>{oddLines[props.category].heading[index][1]}</p></div></div>)
                    }
                })}
            </div>
            <div className="Rating-content-container">
                <div className="Rating-content-heading">
                    What does it mean to be a {heading} in {props.category}?
                </div>
                <div className="Rating-content">
                    {content}
                </div>
            </div>
        </section>
    );
};
export default Rating;