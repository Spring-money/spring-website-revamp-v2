// import style from "@/app/services/components/style/rightPannel.module.css"
// import Image from "next/image"
// import xRay from "@/app/services/components/images/x-ray.svg"
// import arrow from "@/app/services/components/images/Arrow1.svg"
// import Link from "next/link"
// import { Text } from "@/components/tools";
// import Article from "@/components/tools/Article";
// import Quiz from "@/components/tools/Quiz";

// export default function RightPannel() {
//     return (
//         <>

//             <div className={style.topCard}>
//                 <div className="w-[80%] sm:w-[65%]">
//                     <div className={style.topCardText1}>
//                         <span>Get your free Financial X-Ray Report!</span>
//                     </div>
//                     <div className={style.topCardText2}>
//                         <span>Get a detailed assessment report of your financial life.</span>
//                     </div>
//                     <div className={style.topCardButton}>
//                         <Link href={'/academy/tools/financial-x-ray'}>
//                             <span>Scan now</span>
//                         </Link>
//                         <Image src={arrow} style={{ marginLeft: '4%' }} />
//                     </div>
//                 </div>
//                 <div >
//                     <Image src={xRay} className='mt-[50%] lg:mt-[25%] sm:w-[100px] sm:mt-0' />
//                 </div>
//             </div>
//             <div className="flex mt-[2%] flex-col items-center justify-start w-full mb-6 border-gray-900_3f border border-solid bg-white-A700 rounded-lg">
//                 <div className="flex flex-row justify-start w-full p-[15px] border-gray-900_3f border-b border-solid">
//                     <Text size="md" as="p" className="!text-gray-900">
//                         See also
//                     </Text>
//                 </div>
//                 <div className="flex flex-col items-center justify-start w-full bg-white-A700">
//                     <div className="flex flex-col items-center justify-start w-[90%]">
//                         <div className="flex flex-col w-full gap-px">
//                             <Article
//                                 articleTitle="How should one plan for retirement?"
//                                 articleImg="https://spring-money-production-bucket.s3.ap-south-1.amazonaws.com/Short+Read+Thumbnails/SPMN-SART-220722-00004.png"
//                                 articleType="Article"
//                                 articleTime="3 mins"
//                                 onClickLink="How should one plan for retirement?"
//                                 wixArticleLink='https://nikhil460.wixsite.com/spring-internal-blog/post/how-should-one-plan-for-retirement'
//                                 className="flex flex-col items-center justify-start w-full pt-4 pb-[15px] gap-[7px] border-gray-900_3f border-b border-solid bg-white-A700"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     )
// }