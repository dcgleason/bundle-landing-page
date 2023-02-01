import React, { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react'
import Box from '@material-ui/core/Box';
import Image from 'next/image';
import Success from '../success';
import Failure from '../error';
import Head from "next/head"
import { useRouter } from 'next/router';
import dotenv from 'dotenv'
dotenv.config()
import RecorderControls from '@/components/recorder-controls/index.jsx'
import RecordingsList from "@/components/recordings-list/index.jsx";
import useRecorder from "@/hooks/useRecorder";




// if picture! --> create PDF page from L-R template
  // if no picture --> store in an object
  // OR we just tell people if no picture, they will create a blank page / we require a picture

  // example two page book object --> one L-R spread per array, for those without a picture (can go at the end)

  // var book = {
  //   "one": [{
  //     "message": "hello",
  //     "contributorName": "jessica",
  //     "audioUrl": "https://bundle-bucket.s3.amazonaws.com/IMG_20210730_165000.jpg"

  //   }, 
  //   {
  //     "message": "hello",
  //     "contributorName": "charlie",
  //     "audioUrl": "https://bundle-bucket.s3.amazonaws.com/IMG_20210730_165000.jpg"
  // }],
  //   "two": [{
  //     "message": "hello there",
  //     "contributorName": "jessica",
  //     "audioUrl": "https://bundle-bucket.s3.amazonaws.com/IMG_20210730_165000.jpg"

  //   }, 
  //   {
  //     "message": "hi buddy",
  //     "contributorName": "james",
  //     "audioUrl": "https://bundle-bucket.s3.amazonaws.com/IMG_20210730_165000.jpg"
  // }]
  // }

const Messages = () => {

  const [ questionOne, setQuestionOne] = useState('');
  const [ contributorName, setContributorName ] = useState('');
  const [ success, setSuccess ] = useState(false);
  const [ failure, setFailure ] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [wantUploadPicture, setWantUploadPicture] = useState(true);
  const router = useRouter();
  const { userID } = router.query;
  const [userData, setUserData] = useState({});
  const [giftData, setGiftData] = useState({});
  const { recorderState, audioRecorded, setAudioRecorded, ...handlers } = useRecorder();
  const { audio } = recorderState;
  const [blob, setBlob] = useState('');
  




  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch(`http://localhost:3001/users/${userID}`);
      const data = await res.json();
      setUserData(data);
      console.log("user first name" + data.firstName); // first name of the gift owner

    }

    async function fetchGiftData() {
      const res = await fetch(`http://localhost:3001/gifts/user/${userID}`);
      const data = await res.json();
      setGiftData(data);

    }

    fetchGiftData();
    fetchUserData();
  }, [userID]); // only run the effect on first render --< how to 

  // 636468ef285378771155ce54

  const getDataChild = (data) => { // make this the same as the onsubmit

   setBlob(data[0].audio)
   console.log('data from parent ' + data[0].audio)
   console.log('this is the blob' + blob);


  }

const submit = async (event) => {
      event.preventDefault();



      // POST request to PDF template ROUTE - create contributor page 

         //post the image to the s3 bucket
         await fetch("url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: file,
        });

   
  
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
  
      const { url } = await fetch("http://localhost:3001/s3Url").then((res) =>
        res.json()
      );
  
      console.log("url" + url);

      //post the image to the s3 bucket
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });

      const imageUrl = url.split("?")[0];
      console.log(imageUrl); //this is the url of the image in the s3 bucket -- you can use this to display the image (or store it in the database)

      // create a new FormData object
       const form = new FormData();
        form.append("audio", audio); // append the audio file
        form.append("imageUrl", imageUrl); // append the image url
        form.append("message", questionOne); // append the message
        form.append("contributorName", contributorName); // append the contributor name

        // make a post request to the endpoint '/contributor/create'
        const res = await fetch('http://localhost:3001/contributor/create', {
          method: 'POST',
          body: form
        });
        if(res.status === 200){
          setSuccess(true);
        }else{
          setFailure(true);
        }
  
      
  
     
    };
  
 if (!userData) return <p>Loading...</p>;

  return (
    <>

    <Head>
        <title>Messages - Bundle</title>
        <meta name="description" content="Where a Bundle contributor submits his or her written messages." />
      </Head>
    {success? <Success/> : <div></div>}
    {failure? <Failure/> : <div></div>}
      <form className="space-y-8 divide-y divide-gray-200 lg:px-32 lg:mx-32"
        onSubmit={submit}
        >
      <div className=" space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg mt-20 leading-6 font-medium text-gray-900">Write a Letter</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
            <div className='underline'>Instructions :</div> <br></br>Please contribute to the Bundle book for {giftData.recipientName} being gifted by {userData.firstName} by filling out the form below.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              <div className='underline'>Your name :</div> What last does {giftData.recipientName} normally call you? <em>e.g. Mom, Dad, Grandma, Grandpa, etc.</em> 
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  onChange={e => setContributorName(e.target.value)}
                  value={contributorName}
                  className="max-w-lg shadow-sm block w-full focus:ring-red-400 focus:border-red-400 sm:text-sm border border-gray-300 rounded-md"
                />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Do you want to upload  picture of you and {giftData.recipientFirstName}? <br></br> <br></br><em> Note: Because each submitter gets just one left-right spread in the book, you can choose to write a one page letter (1750 characters) and include a picture, or if you do not upload a picture you will be able to write two pages (3500 characters). </em>
                  </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <select className='rounded-md shadow-sm  border-gray-300' id="upload" name="upload" onChange={e => setWantUploadPicture(e.target.value === 'yes')}>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"></div>

            <div className="text-center text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 mb-4">
              <em>Here is a message from Manny (to you):</em> <br />
              <strong>NOTE:</strong> [note from {userData.firstName}] <br />
              <br />
              <strong>Suggested PROMPTS:</strong>
              <ul className="list-disc">
                <ol>What are some of your favorite memories with {giftData.recipientName}?</ol>
                <ol>How has {giftData.recipientName} impacted your life?</ol>
                <ol>What advice would you give to {giftData.recipientName} for the future?</ol>
              </ul>
            </div>
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5"></div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 items-start ">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              <div className='underline'>Letter :</div> Please write your letter here (<em> we ask that you write from a place of love, support, and encouragement</em>):
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 w-full">
                <div className="flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  spellCheck="true"
                  placeholder={`Dear ${giftData.recipientFirstName}, ...`}
                  maxLength= {wantUploadPicture ? 1750 : 3500}
                  minLength= {wantUploadPicture ? 0 : 1750}
                  rows={8}
                  onChange={e => setQuestionOne(e.target.value)}
                  value={questionOne}
                  className="max-w-lg shadow-sm block w-full focus:ring-red-400 focus:border-red-400 sm:text-sm border border-gray-300 rounded-md sm:col-span-2 py-2 px-3"
                />
                  <div className=" ml-3 text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> {questionOne.length}/{wantUploadPicture ? 1750 : 3500} characters</div>
                </div>
              </div>
            </div>

            <div className="h-full sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="recording" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              <div className='underline'>Audio :</div> To give {giftData.recipientFirstName} an even more engaging experience, please add a short voice note - something like... &quot;Hey {giftData.recipientFirstName}, this is [YOUR NAME]. Happy birthday! Love you!&quot;  (recommended) 
              </label>
              
              <div className=" h-full mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg sm:w-full flex rounded-md shadow-sm">



            <section className="mx-auto">
            <h1 className="text-xl text-center underline"><em>Voice Recorder</em></h1>
                <div className="">

                  
                  <RecorderControls recorderState={recorderState} handlers={handlers}   />
                
                  <RecordingsList audio={audio} audioRecorded={audioRecorded} setAudioRecorded={setAudioRecorded} getData={getDataChild} />
                  {blob != "" ? <div className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
                    Your recording (ready to submit):  
                    <a className='text-blue-500 underline' href={blob}>Audio recording - {Date()}</a>
                  </div> : <div></div>}
                </div>
              </section>

              </div>
              </div>
            </div>
    

{wantUploadPicture ? 
    <>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> <div className='underline'>Picture (optional) :</div> A picture of you and {giftData.recipientFirstName}: </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                { file == null ? <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" style={{ strokeWidth: 2, strokeLinecap:"round", strokeLinejoin:"round" }}/>
                </svg> : <div> </div>}
                <div className="flex text-sm text-gray-600">
                {   file !== null?  <label htmlFor="file-upload"> <span className="relative bg-white rounded-md font-medium text-grey-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-400"> Image Ready to Send.</span> </label>:  (<>
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-400">
    
                    <input name='file-upload' onChange={(e) => setFile(e.target.files[0])} type='file' accept='image/*'/>
                    <p className="text-xs text-gray-500">PNG or JPG up to 16MB</p>
                  </label>

                  </>
                  )}
                </div>
                
              </div>
            </div>
          </div>
          {/* { imageUrl && selectedImage && (
              <div>
                <div className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2" >Image Preview:</div>
                <Image src={imageUrl} alt={'Image'} height="200" width='200'/>
              </div>
)} */}
        </div>
        </> : <div> </div>}
       </div>
     </div>
     </div>

      <div className="pt-5">
        <div className="flex justify-end">
         
          <button
            type="submit"
            className="ml-3 mb-8 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
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

