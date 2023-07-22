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
import Dialog from "@mui/material/Dialog";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/Alert';
dotenv.config()

import RecorderControls from '@/components/recorder-controls/index.jsx'
import RecordingsList from "@/components/recordings-list/index.jsx";
import useRecorder from "@/hooks/useRecorder";
import LoadingSpinnerContr from '@/components/LoadingSpinnerContr'




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
  const [blob, setBlob] = useState(null);
  const [pageTwo, setPageTwo] = useState('');
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [alert, setAlert] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState({});
  const [layoutId, setLayoutId] = useState("1");
  const [userEmail, setUserEmail] = useState("dddaanniiieldliie@testinngig.com");

  useEffect(() => {
    if (submissionStatus) {
      handleClick(submissionStatus);
    }
  }, [submissionStatus]);

  useEffect(() => {
    if (!blob) {
      setError('Blob (audio) is not set');
    }
  }, [blob]);


  useEffect(() => {
    if (!userID) {
      console.log('no userID...')
      return; // Don't run the fetching functions if userID is not available
    }
  })
  
  



  useEffect(() => {

    console.log("userid is " + userID);
    async function fetchUserData() {
      const res = await fetch(`https://yay-api.herokuapp.com/users/${userID}`);
      const data = await res.json();
      setUserData(data);
      console.log("user first name" + data.firstName); // first name of the gift owner

    }

    fetchUserData();
  }, [userID]); // only run the effect on first render --< how to 

  // 636468ef285378771155ce54 --> user id of the giftOwner --> use this in the url to get the gift id

  // gift ID of eliza's gift 63c55c5ee92e0ca3cbbececf
  const getDataChild = (data) => { // make this the same as the onsubmit 

  setBlob(data[0].audio)
   console.log('data from parent ' + data[0].audio)


  }

  const handleClick = (status) => {

    if(status === 200) {
    setAlert({
      type: "success",
      text: "Contribution submitted!",
      title: "Success!",
      open: true

    })

    } else {
      setAlert({
        type: "error",
        text: "Contribution failed to submit.",
        title: "Error!",
        open: true
      })
    }
  }

  const handleClose = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };
  

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    let responseStatus = null; // Initialize responseStatus variable
  
    // Create a FormData object to hold the file and other parameters
    const formData = new FormData();
    formData.append("layout_id", layoutId); // Replace with actual layout id need to be able to calulate this with logic based on if they include a picture and word count
    formData.append("name", contributorName);
    formData.append("msg", questionOne);
    formData.append("email", userEmail); // Replace with actual email -- need to add this field to the form
    formData.append("imageAddress", file);


    // Fetch the audio Blob from the URL and append it to the FormData
    if (blob) {
      const response = await fetch(blob);
      const audioBlob = await response.blob();
      formData.append("audio", audioBlob, "audio.webm"); // You may need to adjust the file type depending on the format of your audio Blob
    }
    try {
      // Send the POST request to add a message to the book
      const response = await fetch(`https://yay-api.herokuapp.com/book/${userData._id}/message`, {
        method: "POST",
        body: formData,
      });
  
      responseStatus = response.status; // Assign the status to responseStatus
  
      if (response.ok) {
        console.log("Success!");
      } else {
        console.log("Error of some kind");
        console.log('Status:', responseStatus);
        console.log('Status text:', response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  
  
    setSubmissionStatus(responseStatus);
    setIsLoading(false);
  };



  
 if (!userData) return <p>Loading...</p>;

  return (
    <>

    <Dialog open={alert.open} onClose={handleClose}>
        <Alert
          severity={alert.type}
          color={alert.type}
          role="button"
          closeText="Doesn't Work!"
          sx={{
            width: '80%',
            margin: 'auto',
            "& .MuiAlert-icon": {
              color: "blue"
            }
            //backgroundColor: "green"
          }}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.text}
        </Alert>
      </Dialog>

    <Head>
        <title>Messages - Bundl</title>
        <meta name="description" content="Where a Bundle contributor submits his or her written messages." />
      </Head>
    {success? <Success/> : <div></div>}
    {failure? <Failure/> : <div></div>}
      <form className="space-y-8 divide-y divide-gray-200 lg:px-32 lg:mx-32"
      
        >
      <div className=" space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg mt-20 leading-6 font-medium text-gray-900">Write a Letter</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
            <div className='underline'>Instructions :</div> <br></br>Please contribute to the Bundl book for {userData.recipient} being gifted by {userData.name} by filling out the form below.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              <div className='underline'>Your name :</div> What does {userData.recipientFirst} normally call you? <em>e.g. Mom, Dad, your first name, nickname, etc.</em> 
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
                Do you want to upload a picture of you and {userData.recipientFirst}? <em>(optional)</em>
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select className='rounded-md shadow-sm  border-gray-300' id="upload" name="upload" onChange={e => setWantUploadPicture(e.target.value === 'yes')}>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
                <label htmlFor="cover-photo" className="block text-sm italic text-gray-700 sm:mt-px sm:pt-2">
                    Note: this will impact your max character count for your letter.
                </label>
            </div>
        </div>


            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"></div>
            <div className="text-center text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 mb-4">
            <div className="underline"><em>Here is a message from {userData.name} (to you):</em> </div> <br />
                <strong></strong> {userData.introNote ? userData.introNote : 'oops! Having a technical error.'} <br />
                  <br />
                  <strong>Suggested PROMPTS (from {userData.name}):</strong>
                  <ul className="list-disc">
                    {userData.prompts &&
                      userData.prompts.map((prompt, index) => (
                        <ol key={index}>{prompt}</ol>
                      ))}
                  </ul>
                </div>
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5"></div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 items-start ">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              <div className='underline'>Letter :</div> Please write your letter here (<em>ask that you write from a place of love, support, and encouragement</em>):
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 w-full">
                <div className="flex rounded-md shadow-sm">
                <textarea
                  id="about"
                  name="about"
                  spellCheck="true"
                  placeholder={`Dear ${userData.recipientFirst}, ...`}
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
              <div className='underline'>Audio :</div> To give {giftData.recipientFirstName} an even more engaging experience, please read your message out loud (recommended). 
              </label>
              
              <div className=" h-full mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg sm:w-full flex rounded-md shadow-sm">



                      <section className="mx-auto">
                      <h1 className="text-xl text-center underline"><em>Voice Recorder</em></h1>
                          <div className="">

                            
                            <RecorderControls recorderState={recorderState} handlers={handlers}   />
                          
                            <RecordingsList audio={audio} audioRecorded={audioRecorded} setAudioRecorded={setAudioRecorded} getData={getDataChild} />
                            {blob != null ? <div className="overflow-hidden rounded-md bg-white px-6 py-4 shadow">
                              Your recording:  
                              <a className='text-blue-500 underline' href={blob}>Audio message - {Date()}</a>
                            </div> : <div></div>}
                          </div>
                        </section>

              </div>
              </div>
            </div> 
    

        {wantUploadPicture ? 
           <>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> <div className='underline'>Picture (optional) :</div> A picture of you and {userData.recipient}: </label>
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

         {isLoading? <LoadingSpinnerContr/>: 
         
          <button
            type="submit"
            className="ml-3 mb-8 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
            onClick={submit}
          >
            Send
          </button>
}
        </div>
      </div>
    </form>
    </>
  );
}

export default Messages;

