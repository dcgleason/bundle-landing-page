import React from "react";

const LoadingSpinnerContr = () => {

    return (

        <button
        type="submit"
        className="ml-3 mb-8 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200" disabled
      >
            <svg className="animate-spin h-5 w-5 mr-3 inline border-4 rounded-full" viewBox="0 0 24 24" xmlns='https://www.w3.org/TR/SVG2/' fill='none'>
                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
            </svg>
            Sending...
      </button>
    );
};

export default LoadingSpinnerContr;