import { React, useState } from "react";
import axios from "axios";


const Login = () => {


    const [id, setId ] = useState('')

    const submitLogin = (e) => {

        e.preventDefault();

        fetch("https://dog.ceo/api/breeds/image/random")
            .then((response) => response.json())
            .then(data => console.log(data))
            .catch(error => {
                console.error('Error fetching data ' + error)
            }

    }

//63658fba375bc87352c7454a

    const handleInput= (e) =>{

        setId(e.target.value)
        console.log('id is --> ' + id)

    }


    return (
        <>
        <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <svg
          className="absolute left-full transform translate-x-1/2"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <svg
          className="absolute right-full bottom-0 transform -translate-x-1/2"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"> Login</h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
          Please enter your login details below:
          </p>
        </div>
        <div className="mt-12">
        <form>
         <input
         type="text"
         name="first"
        onChange={e => handleInput(e)}
        value={id}
        autoComplete="name"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring-red-300 sm:text-sm"
        />   
        <button
        onClick={submitLogin}
        type = 'submit'
        className="bg-[#f8ad9d] hover:bg-[#f4978e] text-white font-bold py-2 px-4 mt-6 w-full rounded focus:outline-none focus:shadow-outline"
        >Submit</button>
        </form>      
        </div>
      </div>
    </div>

        </>
    )
}

export default Login;