import React, { useState } from 'react';
import Success from './success';
import Failure from './error';
import Head from "next/head"

// when you input the gift code, the person's whose Bundle it is should appear in the question.

const Messages = () => {

  const [ questionOne, setQuestionOne] = useState('');
  const [ questionTwo, setQuestionTwo] = useState('');
  const [ questionThree, setQuestionThree] = useState('');
  const [ name, setName] = useState('');
  const [ street, setStreet] = useState('');
  const [ city, setCity] = useState('');
  const [ state, setState] = useState('');
  const [ zip, setZip] = useState('');
  const [ country, setCountry] = useState('');
  const [ responseFour, setResponseFour] = useState('');
  const [ responseFive, setResponseFive] = useState('');
  const [ additionalComments, setAdditionalComments ] = useState('');
  const [ contributorName, setContributorName ] = useState('');
  const [ giftCode, setGiftCode ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ picture, setPicture] = useState({});
  const [ success, setSuccess ] = useState(false);
  const [ failure, setFailure ] = useState(false);

  const uploadPicture = (e) => {
    setPicture({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      picturePreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile: e.target.files[0],
    });
  };;


  const postMessagesMongoDB = async (e) => {
    e.preventDefault();
    try{


      // image upload

      if(picture){

      const formData = new FormData();
      formData.append("file", picture.pictureAsFile);
  
      console.log(picture.pictureAsFile);
  
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
  
      const data = await fetch("https://yay-api.herokuapp.com/gift/imageupload", {
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const uploadedImage = await data.json();
      if (uploadedImage) {
        console.log("Successfully uploaded image");
      } else {
        console.log("Error Found");
      }
    }
      // message upload
      const resp =  await fetch("https://yay-api.herokuapp.comg/gift/insertmessages", { 
        method: 'POST', 
        headers: { 
          'Content-type': 'application/json'
         }, 
        body: JSON.stringify({
          createdAt: Date.now(),
          contributorName: contributorName, 
          recipientName: name,
          questionOne: questionOne,
          recipientStreet: street,
          recipientCity: city,
          recipientState: state,
          recipientZip: zip,
          recipientCountry: country,
          giftCode: giftCode, // need to pass in the gift code from somewhere...when the person ordres it,
        }) 
        });
        setSuccess(true);
     
    }
    catch{
      console.error(error)
      setFailure(true);
    }
  }

  return (
    <>

    <Head>
        <title>Messages - Bundle</title>
        <meta name="description" content="Where a Bundle contributor submits his or her written messages." />
      </Head>
    {success? <Success/> : <div></div>}
    {failure? <Failure/> : <div></div>}
      <form className="space-y-8 divide-y divide-gray-200 lg:px-32 lg:mx-32 shadow-md rounded border-gray-200 border"
        onSubmit={postMessagesMongoDB}
        action="/pictureUpload"
        method="post" 
        encType="multipart/form-data"
        >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg mt-20 leading-6 font-medium text-gray-900">Write</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Please answer the questions below your friend / family member / etc.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Your First and Last Name:
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  onChange={e => setContributorName(e.target.value)}
                  value={contributorName}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
                </div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Recipient Name:
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  onChange={e => setName(e.target.value)}
                  value={name}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
                </div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              
              <div className="sm:col-span-2">
                <label htmlFor="address"  className="block text-gray-700 text-sm pb-2 font-bold mb-2">
                  Street address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    onChange={e => setAddress(e.target.value)}
                    value={address}
                    placeholder="123 Main St."
                    id="address"
                    autoComplete="street-address"
                    className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="apartment"  className="block text-gray-700 text-sm pb-2 font-bold">
                  Apartment, suite, etc.
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    onChange={e => setApartment(e.target.value)}
                    value={apartment}
                    name="apartment"
                    placeholder="Apt 1A"
                    id="apartment"
                    className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
              </div>
              <div>
                <label htmlFor="city"  className="block text-gray-700 text-sm pb-2 font-bold">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    onChange={e => setCity(e.target.value)}
                    value={city}
                    placeholder="Boston"
                    autoComplete="address-level2"
                    className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country"  className="block text-gray-700 text-sm pb-2 font-bold">
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    onChange={e => setCountry(e.target.value)}
                    value={country}
                    autoComplete="country-name"
                    className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="region"  className="block text-gray-700 text-sm pb-2 font-bold">
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="region"
                    id="region"
                    onChange={e => setState(e.target.value)}
                    value={state}
                    placeholder="MA"
                    autoComplete="address-level1"
                    className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postal-code"  className="block text-gray-700 text-sm pb-2 font-bold">
                  Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="postal-code"
                    onChange={e => setZip(e.target.value)}
                    value={zip}
                    id="postal-code"
                    placeholder="02117"
                    autoComplete="postal-code"
                    className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-gray-700 text-sm pb-2 font-bold">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    onChange={e => setPhone(e.target.value)}
                    value={phone}
                    placeholder="(555) 555-5555"
                    id="phone"
                    autoComplete="tel"
                    className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
                </div>
              </div>
            </div>
            </div>
            
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Why are you grateful for this person? Has this person impacted your life positively? What qualities do you admire in this person? Your message here:
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  placeholder='Dear (your recipient),'
                  rows={8}
                  onChange={e => setQuestionOne(e.target.value)}
                  value={questionOne}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
                </div>
              </div>
            </div>

    


            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Photo: </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" style={{ strokeWidth: 2, strokeLinecap:"round", strokeLinejoin:"round" }}/>
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a image</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                  </label>
                  <p className="pl-1">here</p>
                </div>
                <p className="text-xs text-gray-500">PNG or JPG up to 16MB</p>
              </div>
            </div>
          </div>
        </div>


        


    
          </div>
        </div>

      </div>

      <div className="pt-5">
        <div className="flex justify-end">
         
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </div>
    </form>
    </>
  );
}

export default Messages;