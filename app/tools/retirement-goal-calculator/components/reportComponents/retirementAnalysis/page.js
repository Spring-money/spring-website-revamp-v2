'use client'
import graphImg from "../../../../../../public/retirement-calculator/retirementGraphImage.png";
import Image from "next/image";


export default function RetirementAnalysis(props) {
    return (
        <>
            <div className="w-[100%] pt-4 bg-white flex-col justify-start items-start gap-4 inline-flex">
                <div className="self-stretch text-zinc-800 text-xl font-medium font-['Poppins']">Your retirement analysis</div>
                <div className="self-stretch  flex-col justify-start items-center gap-8 flex">
                    <div className="self-stretch">
                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']">As per the inputs given provided by you, you will need the corpus of </span>
                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                        }).format(props.targetCorpus)}</span>

                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']">  at the time of your retirement. You can accumulate the corpus if you invest </span>
                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                        }).format(props.monthlySavings)}/month</span>
                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']"> for </span>
                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{props.timeTillRetirement} years</span>
                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']">  into investment products which gives returns </span>
                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{props.expectedReturnsBefore * 100}%</span>
                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']"> per annum.</span>

                        <br></br>
                        <br></br>

                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']">You can also start investing with lesser amount of </span>

                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                        }).format(props.monthlySavingsAtProvidedIncrement)}/month</span>

                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']"> and then increase your investment amount per month by </span>
                        <span className="text-zinc-800 text-sm font-medium font-['Poppins']">{props.increaseSavingsPerYear}%</span>
                        <span className="text-zinc-800 text-sm font-normal font-['Poppins']"> per year to accumulate the same corpus.</span>

                    </div>
                    <Image className="w-[100%] self-stretch rounded border border-zinc-800/opacity-25" src={graphImg} />
                    <div className="self-stretch">
                        <div className="text-zinc-800 text-sm font-normal font-['Poppins'] mb-4">The entire retirement journey is divided into 2 parts - Accumulation and Withdrawal.</div>
                        <ul className="ml-8" style={{ listStyleType: "disc" }}>
                            <li>
                                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">Investment refers to the total amount invested by an individual.</span>
                            </li>
                            <li>
                                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">Returns are the profits earned on investments during the accumulation phase.</span>
                            </li>
                        </ul>
                        <div className="text-zinc-800 text-sm font-normal font-['Poppins'] my-4">When transitioning to the withdrawal phase, it is assumed that the retirement corpus will be divided into separate products to account for higher risks associated with longer investment durations. Similarly, the corpus for retirement usage will be allocated to products with lower risks at retirement.</div>
                        <ul className="ml-8" style={{ listStyleType: "disc" }}>
                            <li>
                                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">The retirement corpus depletes to zero around the individual's life expectancy (i.e., at the time of passing).</span>
                            </li>
                            <li>
                                <span className="text-zinc-800 text-sm font-normal font-['Poppins']">The inheritance corpus is passed on to the next generation.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}