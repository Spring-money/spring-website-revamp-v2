'use client'
import style from "../components/style/rightPannel.module.css"
import Image from "next/image"
import xRay from "../components/images/x-ray.svg"
import arrow from "../components/images/Arrow1.svg"
// import { Text } from "@/components/tools";
// import Article from "@/components/tools/Article";
import Link from "next/link"

export default function RightPannel() {
    return (
        <>

            <div className={style.topCard}>
                <div className="w-[80%] sm:w-[65%]">
                    <div className={style.topCardText1}>
                        <span>Get your free Financial X-Ray Report!</span>
                    </div>
                    <div className={style.topCardText2}>
                        <span>Get a detailed assessment report of your financial life.</span>
                    </div>
                    <div className={style.topCardButton}>
                        <Link href={'/academy/tools/financial-x-ray'}>
                            <span>Scan now</span>
                        </Link>
                        <Image src={arrow} style={{ marginLeft: '4%' }} />
                    </div>
                </div>
                <div >
                    <Image src={xRay} className='mt-[50%] lg:mt-[25%] sm:w-[100px] sm:mt-0' />
                </div>
            </div>
            <div className="flex mt-[2%] flex-col items-center justify-start w-full mb-6 border-gray-900_3f border border-solid bg-white-A700 rounded-lg">
                {/* <div className="flex flex-row justify-start w-full p-[15px] border-gray-900_3f border-b border-solid">
                    <Text size="md" as="p" className="!text-gray-900">
                        See also
                    </Text>
                </div> */}
                <div className="flex flex-col items-center justify-start w-full bg-white-A700">
                    <div className="flex flex-col items-center justify-start w-[90%]">
                        {/* <div className="flex flex-col w-full gap-px">
                            <Article
                                articleTitle="Magic Of Compounding"
                                articleImg="https://spring-money-production-bucket.s3.ap-south-1.amazonaws.com/Short+Read+Thumbnails/SPMN-SART-220715-00001.png"
                                articleType="Article"
                                articleTime="2 mins"
                                onClickLink="Magic Of Compounding"
                                wixArticleLink='https://nikhil460.wixsite.com/spring-internal-blog/post/magic-of-compounding'
                                className="flex flex-col items-center justify-start w-full pt-4 pb-[15px] gap-[7px] border-gray-900_3f border-b border-solid bg-white-A700"
                            />
                            <Article
                                articleTitle="Hybrid Mutual Funds"
                                articleImg="https://spring-money-production-bucket.s3.ap-south-1.amazonaws.com/Short+Read+Thumbnails/SPMN-SART-220721-00015.png"
                                articleType="Article"
                                articleTime="2 mins"
                                onClickLink="Hybrid Mutual Funds"
                                wixArticleLink='https://nikhil460.wixsite.com/spring-internal-blog/post/hybrid-mutual-funds'
                                className="flex flex-col items-center justify-start w-full pt-4 pb-[15px] gap-[7px] border-gray-900_3f border-b border-solid bg-white-A700"
                            />
                            <Article
                                articleTitle="Solution-oriented Funds"
                                articleImg="https://spring-money-production-bucket.s3.ap-south-1.amazonaws.com/Short+Read+Thumbnails/SPMN-SART-220721-00016.png"
                                articleType="Article"
                                articleTime="2 mins"
                                onClickLink="Solution-oriented Funds"
                                wixArticleLink='https://nikhil460.wixsite.com/spring-internal-blog/post/solution-oriented-funds'
                                className="flex flex-col items-center justify-start w-full pt-4 pb-[15px] gap-[7px] border-gray-900_3f border-b border-solid bg-white-A700"
                            />
                            <Article
                                articleTitle="Real Estate Investment Trust"
                                articleImg="https://spring-money-production-bucket.s3.ap-south-1.amazonaws.com/Short+Read+Thumbnails/SPMN-SART-220721-00017.png"
                                articleType="Article"
                                articleTime="3 mins"
                                onClickLink="Real Estate Investment Trust"
                                wixArticleLink='https://nikhil460.wixsite.com/spring-internal-blog/post/real-estate-investment-trust'
                                className="flex flex-col items-center justify-start w-full pt-4 pb-[15px] gap-[7px] border-gray-900_3f border-b border-solid bg-white-A700"
                            />
                        </div> */}
                    </div>
                </div>
            </div>

        </>
    )
}