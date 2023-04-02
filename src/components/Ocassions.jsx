import React from "react";

const Categories = () => {

    return(
        <>
         <section aria-labelledby="policy-heading" className="mt-16 lg:mt-24">
              <div className="flex flex-col items-center pb-10 text-center">
              <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
      {/* <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
      Give a Bundl book with our app on the following occasions:
      </h2>{" "} */}
      {/* <p className="text-base text-gray-700 md:text-lg">
        Give a Bundl book with our app on the following occasions:
      </p> */}
    </div>
                {/* <h2 id="details-heading" className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Great times to give a Bundle book:
                </h2> */}
                <p className="mt-3 max-w-3xl text-lg text-gray-600">
                 
                </p>
              </div>
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {/* {policies.map((policy) => ( */}
              {/* Start of occations */}
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Birthdays</h3>
                  <p className="mt-3 text-base text-gray-500">Wish a team member a happy birthday from a larger group.</p>
                </div>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Graduations</h3>
                  <p className="mt-3 text-base text-gray-500">Congratulate someone on his or her accomplishments.</p>
                </div>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Anniversaries</h3>
                  <p className="mt-3 text-base text-gray-500">Wish a team member a happy anniversary from the group.</p>
                </div>

                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Weddings</h3>
                  <p className="mt-3 text-base text-gray-500">Give a the groom a gift he or she can cherish for years to come.</p>
                </div>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">A Thank You</h3>
                  <p className="mt-3 text-base text-gray-500">Send a group thank you to a special someone.</p>
                </div>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Retirement</h3>
                  <p className="mt-3 text-base text-gray-500">Offer well-wishes to a co-worker on his or her final day.</p>
                </div>

                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Get Well Soon</h3>
                  <p className="mt-3 text-base text-gray-500">Offer up support for a sick colleague from your team.</p>
                </div>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-auto text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                  <h3 className="mt-6 text-base font-medium text-gray-900">Just Because</h3>
                  <p className="mt-3 text-base text-gray-500">Let someone know how much they are appreciated, just as a nice gesture.</p>
                </div>
              {/* ))} */}
       </div>
    </section>
        </>
    )

}

export default Categories