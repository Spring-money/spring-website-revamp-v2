import React from "react";
import { Text, Img, Heading, Button } from "./..";

export default function MultiSelectOneRightpanel({ ...props }) {
  return (
    <div {...props}>
      <div className="flex items-center gap-2 self-stretch rounded-lg border border-solid border-gray-900_3f bg-white-A700 p-4">
        <div className="flex flex-1 flex-col items-start gap-4">
          <div className="flex flex-col gap-2 self-stretch">
            <Text size="md" as="p" className="!text-gray-900">
              Get your free Financial X-Ray Report!
            </Text>
            <Text size="xs" as="p" className="leading-[140%] !text-gray-900_e5">
              Get a detailed assessment report of your financial life.
            </Text>
          </div>
          <Button
            color="teal_600"
            size="sm"
            shape="round"
            rightIcon={<Img src="images/img_arrow_1_teal_600.svg" alt="Arrow 1" className="h-px w-[10px]" />}
            className="min-w-[108px] gap-1.5 border font-semibold"
          >
            Scan now
          </Button>
        </div>
        <Img src="images/img_computer.svg" alt="computer_one" className="h-[83px] w-[83px]" />
      </div>
      <div className="self-stretch rounded-lg border border-solid border-gray-900_3f bg-white-A700">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-solid border-gray-900_3f bg-white-A700 p-[15px]">
          <Text size="md" as="p" className="!text-gray-900">
            More tools
          </Text>
          <a href="#" className="self-start">
            <Heading as="h1">View all</Heading>
          </a>
        </div>
        <div className="px-4">
          <div className="flex flex-col gap-px md:flex-row sm:flex-col">
            <div className="flex flex-1 items-center justify-between gap-5 bg-white-A700 py-4">
              <div className="flex w-[63%] flex-col items-start gap-2">
                <div className="flex">
                  <Text as="p" className="!font-medium !text-gray-900">
                    Goal Calculator
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Heading as="h2">Calculate</Heading>
                  <Img src="images/img_arrow_1_teal_600.svg" alt="calculate_two" className="mb-2 h-px self-end" />
                </div>
              </div>
              <Img
                src="images/img_goal_calculator.png"
                alt="goal_calculator"
                className="h-[72px] w-[72px] object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-px">
              <div className="flex flex-1 items-center justify-between gap-5 border-t border-solid border-gray-900_3f bg-white-A700 py-4">
                <div className="flex w-[63%] flex-col gap-[7px]">
                  <Text as="p" className="!font-medium !text-gray-900">
                    Two-Wheeler EMI Calculator
                  </Text>
                  <div className="flex items-center gap-2">
                    <Heading as="h3">Calculate</Heading>
                    <Img src="images/img_arrow_1_teal_600.svg" alt="calculate_two" className="mb-2 h-px self-end" />
                  </div>
                </div>
                <Img src="images/img_insurance.png" alt="image" className="h-[72px] w-[72px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 self-stretch rounded-lg border border-solid border-gray-900_3f bg-white-A700">
        <div className="flex border-b border-solid border-gray-900_3f p-[15px]">
          <Text size="md" as="p" className="!text-gray-900">
            See also
          </Text>
        </div>
        <div className="bg-white-A700 px-4">
          <div>
            <div className="flex flex-col gap-px">
              <div className="flex flex-1 flex-col gap-[7px] border-b border-solid border-gray-900_3f bg-white-A700 py-4">
                <div className="flex items-center gap-4">
                  <Text as="p" className="w-[66%] !font-medium !text-gray-900">
                    The length of the short read can be up to max 80 characters
                  </Text>
                  <div className="flex w-[34%] rounded bg-gray-400">
                    <Img
                      src="images/img_img_9906.png"
                      alt="image"
                      className="h-[64px] w-full rounded object-cover md:h-auto"
                    />
                  </div>
                </div>
                <div className="flex self-start">
                  <div className="flex flex-wrap gap-1">
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      Short Read
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      •
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      2 mins
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-[7px] border-b border-solid border-gray-900_3f bg-white-A700 py-4">
                <div className="flex items-center gap-4">
                  <Text as="p" className="w-[66%] !font-medium !text-gray-900">
                    The length of the article can be up to max 100 characters
                  </Text>
                  <div className="flex w-[34%] rounded bg-gray-400">
                    <Img
                      src="images/img_img_9906_64x90.png"
                      alt="img9906_one"
                      className="h-[64px] w-full rounded object-cover md:h-auto"
                    />
                  </div>
                </div>
                <div className="flex self-start">
                  <div className="flex flex-wrap gap-1">
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      Article
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      •
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      8 mins
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-[7px] border-b border-solid border-gray-900_3f bg-white-A700 py-4">
                <div className="flex items-center gap-4">
                  <Text as="p" className="w-[66%] !font-medium !text-gray-900">
                    This is the title of a video and it can be maximum 120 characters
                  </Text>
                  <div className="w-[34%] rounded bg-gray-400">
                    <Img
                      src="images/img_img_9906_64x90.png"
                      alt="img9906_one"
                      className="h-[64px] w-full rounded object-cover md:h-auto"
                    />
                    <div className="relative mt-[-64px] h-[64px] rounded md:h-auto">
                      <Img
                        src="images/img_img_9917.png"
                        alt="img9917_one"
                        className="h-[64px] w-full rounded object-cover"
                      />
                      <Button
                        color="gray_900_ce"
                        size="xs"
                        variant="fill"
                        shape="circle"
                        className="absolute bottom-0 left-0 right-0 top-0 m-auto w-[26px] !rounded-[13px]"
                      >
                        <Img src="images/img_overflow_menu.svg" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex self-start">
                  <div className="flex flex-wrap gap-1">
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      Video
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      •
                    </Text>
                    <Text size="xs" as="p" className="!text-blue_gray-400_02">
                      6 mins
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2 border-b border-solid border-gray-900_3f bg-white-A700 py-3.5">
                <div className="flex items-center gap-4">
                  <Text as="p" className="w-[66%] !font-medium !text-gray-900">
                    This is the title of a cardpack and it can be max 120 characters
                  </Text>
                  <div className="w-[34%] rounded bg-gray-400">
                    <Img
                      src="images/img_img_9906_64x90.png"
                      alt="img9906_one"
                      className="h-[64px] w-full rounded object-cover md:h-auto"
                    />
                    <Img
                      src="images/img_img_9920.png"
                      alt="img9920_one"
                      className="relative mt-[-64px] h-[64px] w-full rounded object-cover md:h-auto"
                    />
                  </div>
                </div>
                <div className="flex self-start">
                  <div className="flex flex-wrap gap-1">
                    <Text size="xs" as="p" className="self-end !text-blue_gray-400_02">
                      Cardpack
                    </Text>
                    <Text size="xs" as="p" className="self-start !text-blue_gray-400_02">
                      •
                    </Text>
                    <Text size="xs" as="p" className="self-end !text-blue_gray-400_02">
                      10 pages
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2 bg-white-A700 py-[15px]">
              <div className="flex items-center justify-between gap-5">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex flex-col items-start">
                    <Text as="p" className="!font-medium !text-gray-900">
                      Very Interesting Quiz Name
                    </Text>
                    <Text size="xs" as="p" className="!font-medium !text-gray-900_89">
                      Personal Finance - General
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heading as="h2">Start quiz</Heading>
                    <Img src="images/img_arrow_1_teal_600.svg" alt="arrowone_one" className="h-px" />
                  </div>
                </div>
                <Img src="images/img_image_8.png" alt="imageeight_one" className="h-[76px] w-[76px] object-cover" />
              </div>
              <div className="flex self-start">
                <div className="flex flex-wrap gap-1">
                  <Text size="xs" as="p" className="!text-blue_gray-400_02">
                    Quiz
                  </Text>
                  <Text size="xs" as="p" className="self-start !text-blue_gray-400_02">
                    •
                  </Text>
                  <Text size="xs" as="p" className="self-end !text-blue_gray-400_02">
                    10 questions
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
