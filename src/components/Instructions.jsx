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
               Give us the basics:
              </p>{" "}
              <p className="text-gray-700">
              We just need a few things from you. Tell us what you want your friends and family to write about (those are the prompts). Write a welcome message for them. Give us their contact details, and we&apos;ll help you collect these. Tell us who the gift is for and where we should send the Bundl. And finally, give us your email so we can keep you updated.              </p>
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
              <p className="text-gray-900 mb-2 text-lg font-bold">We handle everything else:</p>{" "}
              <p className="text-gray-700">
              We&apos;ll ask your friends and family to write their messages and submit their pictures with your welcome message and collect all of your submissions. We&apos;ll put everything together in a beautiful Bundl book. You&apos;ll get a message each time someone adds to the book.  </p>
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
              Relax and wait for the surprise:
              </p>{" "}
              <p className="text-gray-700">
              Now, you can sit back and relax. We&apos;ll take care of everything else. Within two weeks, they&apos;ll get a special book, sent to the address you provided, filled with loving messages and pictures from their loved ones. It&apos;s a gift they&apos;ll for sure cherish.              </p>
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
            {/* <div className="pt-1 pb-8">
              <p className="text-gray-900 mb-2 text-lg font-bold">
                Feel the love:
              </p>{" "}
              <p className="text-gray-700">
               Once the Bundl book is delivered, you&apos;ll be able to surprise your recipient with it! The reveal is always a special moment.     
              </p>
            </div> */}
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default Instructions;
