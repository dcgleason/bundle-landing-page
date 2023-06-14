import React from "react";
import  Link  from 'next/link'
import Image from 'next/image'


const Instructions = () => {
  return (
    <div className="px-4 py-16 mx-auto w-full bg-white md:px-24 lg:px-8 lg:py-20">
      <div className="grid gap-6 row-gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
        <h2 id="details-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          How it works:
        </h2>
        <div className="lg:py-6 lg:pr-16">
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                  <svg
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className="w-4 text-red-500"
                  >
                    <line
                      fill="none"
                      strokeMiterlimit={10}
                      x1={12}
                      y1={2}
                      x2={12}
                      y2={22}
                    />{" "}
                    <polyline
                      fill="none"
                      strokeMiterlimit={10}
                      points="19,15 12,22 5,15"
                    />
                  </svg>
                </div>
              </div>{" "}
              <div className="w-px h-full bg-gray-300" />
            </div>{" "}
            <div className="pt-1 pb-8">
              <p className="text-gray-900 mb-2 text-lg font-bold">
                Upload your contacts:
              </p>{" "}
              <p className="text-gray-700">
                Upload the contacts of the family and friends of the person you are giving your Bundl book to. You can also write a short message that will be sent out to all of your Bundl book contributors so that each person knows the gift is coming from you. 
              </p>
            </div>
          </div>{" "}
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                  <svg
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className="w-4 text-red-500"
                  >
                    <line
                      fill="none"
                      strokeMiterlimit={10}
                      x1={12}
                      y1={2}
                      x2={12}
                      y2={22}
                    />{" "}
                    <polyline
                      fill="none"
                      strokeMiterlimit={10}
                      points="19,15 12,22 5,15"
                    />
                  </svg>
                </div>
              </div>{" "}
              <div className="w-px h-full bg-gray-300" />
            </div>{" "}
            <div className="pt-1 pb-8">
              <p className="text-gray-900 mb-2 text-lg font-bold">Collect the love:</p>{" "}
              <p className="text-gray-700">
               Our web app automatically reaches out with your message to your Bundl book contributors and collects loving and supportive letters (from your prompts) and memorable pictures from them over 1-2 weeks. 
              </p>
            </div>
          </div>{" "}
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                  <svg
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className="w-4 text-red-500"
                  >
                    <line
                      fill="none"
                      strokeMiterlimit={10}
                      x1={12}
                      y1={2}
                      x2={12}
                      y2={22}
                    />{" "}
                    <polyline
                      fill="none"
                      strokeMiterlimit={10}
                      points="19,15 12,22 5,15"
                    />
                  </svg>
                </div>
              </div>{" "}
              <div className="w-px h-full bg-gray-300" />
            </div>{" "}
            <div className="pt-1 pb-8">
              <p className="text-gray-900 mb-2 text-lg font-bold">
                Compile the love:
              </p>{" "}
              <p className="text-gray-700">
              Once the letters and pictures are collected from friends and family, our web app automatically compiles their kind words and special pictures into a personalized, physical book, aka a Bundl book, for you to gift to your intended recipient.
              </p>
            </div>
          </div>{" "}
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className="flex items-start justify-center w-10 h-10 border rounded-full">
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="mt-2 w-6 text-red-500"
                  >
                    <polyline
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      points="6,12 10,16 18,8"
                    />
                  </svg>
                </div>
              </div>
            </div>{" "}
            <div className="pt-1 pb-8">
              <p className="text-gray-900 mb-2 text-lg font-bold">
                Feel the love:
              </p>{" "}
              <p className="text-gray-700">
               Once the Bundl book is delivered to you, you'll be able to surprise your recipient with it! The reveal is always a special moment.     
              </p>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default Instructions;
