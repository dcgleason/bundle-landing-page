import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { Contributors, Input } from "../components/index"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Example() {
  const [agreed, setAgreed] = useState(false)
  const [secret, setSecret] = useState(null);

  const stripePromise = loadStripe('pk_test_51KtCf1LVDYVdzLHCzEQuGuw08kKelgXO7AgN6VDN874gIPxfr7dl7PvcNgUZUSnypEOxqJcMCu4G119l0MQixCkj00Rr1fOuls');

    useEffect(() => {
        const getClientSecret = async () => {
        const response =  await fetch('https://yay-api.herokuapp.com/stripe/secret').then(res => res.json());
        console.log('response: '+ JSON.stringify(response));
        const data = JSON.stringify(response);
        const {client_secret} = JSON.parse(data);
        console.log('JSON.parse(Data): ' + JSON.parse(data))
        console.log('client secret: ' + client_secret)
        setSecret(client_secret)
    }

        getClientSecret();

    }, []);

const options = {
    client_secret: secret
  }  

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-3xl mx-auto">
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
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"> Add Contributors to Your Bundl</h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
           We will send each an email with your message to invite and remind them to contribute.
          </p>
        </div>
        <div className="mt-12">

                <Contributors/>

         
        </div>
      </div>
    </div>
  )
}