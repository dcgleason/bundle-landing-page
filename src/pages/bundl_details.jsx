import React, { useState, useEffect } from "react";
import {Modal, List, Typography, Button, Table, Input, Select, Upload, message, notification, Form, Row, Col, Space, TextArea, Spin} from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined  } from "@ant-design/icons";
import Papa from 'papaparse';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import moment from 'moment';

export default function Example() {

    const [message, setMessage] = useState("We are creating a book of supportive letters and nice pictures (or 'Bundl') for Dan G. It will only take you a minute to write and submit your letter. It should make for an unforgettable gift that shares our collective love and appreciation. Don't be the last to submit!");
    const [values, setValues] = useState([]);
    const [parsedData, setParsedData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [userID, setUserID] = useState(null);


    
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token is not available in local storage');
      signInWithGoogle(); // Redirect to Google's authorization URL
      return;
    }
  
    // Decode the JWT token to get the user's ID
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userId; // Changed from 'userID' to 'userId'
    if (!userID) {
      console.error('User ID is not available in the decoded JWT token');
      return;
    }
  
    setUserID(userID);
  
    // Fetch the book messages using the user's ID
    fetch(`https://yay-api.herokuapp.com/book/${userID}/messages`, {
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Check if data.messages is an object before proceeding
      if (data && typeof data.messages === 'object') {
        const transformedData = Object.entries(data.messages).map(([key, value], index) => {
          return {
            id: index + 1, // This is the index in the table
            uuid: key, // This is the UUID of the message
            name: value.name || "Name not available",
            email: value.email || "No email given",
            submitted: value.msg ? "Yes" : "No",
            notes: '', // Not sure where this data comes from
            submission: value.msg || "No submission",
            picture: !!value.img_file, // Convert to boolean; true if exists, false otherwise
          };
        });
  
          setDataSource(transformedData);
          console.log('Transformed data:', transformedData);
        } else {
          console.log('Data is not in the expected format');
        }
      })
      .catch(error => {
        console.error('Failed to fetch:', error);
      });
  }, []);


  function signInWithGoogle() {
    const clientId = '764289968872-3rstr2akvdot7cfjk9ektjeaghe2pghr.apps.googleusercontent.com';
    const redirectUri = 'https://www.givebundl.com/api/oauth2callback'; // Update this to your actual server address
    const scope = 'https://www.googleapis.com/auth/gmail.send';
    const responseType = 'code';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
    window.location.href = url;
  }

  function onSendSMS(time, recipient, gifter, to) {
    const url = 'https://yay-api.herokuapp.com/sms/sendSMS';
    const data = {
      time: time,
      recipient: recipient,
      gifter: gifter,
      to: to
    };
  
    fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
    const addtoList = async () => {
        let objects = [];
        console.log('values', values)
      
        const firstValue = dataSource.length > 0 ? dataSource[dataSource.length - 1].id : 0;
        console.log('firstValue', firstValue);
        for (let i = 0; i < values.length; i ++) {
          objects.push({
            id: firstValue + 1 + i,
            name: values[i][1],
            email: values[i][2],
            address: values[i][3],
            submitted: false,
            submission: '',
            picture: '',
          });
        }
      
        // Add the new contacts to the dataSource state
        setDataSource([...dataSource, ...objects]);
      
        // Now, send the new contacts to the server
        try {
          const promises = objects.map((contact) => {
            return fetch(`https://yay-api.herokuapp.com/book/${userID}/message`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                layout_id: 1, // Or whatever layout_id you want to use
                name: contact.name,
                msg: contact.submission,
                img_file: contact.picture,
                email: contact.email,
              }),
            });
          });
      
          console.log('promises', promises);
      
          const responses = await Promise.all(promises);
      
          responses.forEach((response, index) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status} for contact ${objects[index].name}`);
            }
          });
      
          const data = await Promise.all(responses.map(response => response.json()));
      
          data.forEach((item, index) => {
            if (!item.success) { // Check if the server actually saved the new contributor
              throw new Error(`Server failed to save contact ${objects[index].name}`);
            }
          });
      
          console.log('Contacts added to the server successfully');
        } catch (error) {
          console.error('Failed to add contacts to the server:', error);
        }
      };
      

    const handleDownloadCSV = () => {
        window.open('https://docs.google.com/spreadsheets/d/1_fXj2aWK8dXI-GgjzuObLC0crXYx7HpVGTTaQZmdj7g/edit?usp=sharing', '_blank');
      }

      const handleHoverOn = () => {
        setHover(true);
      }
      
    const handleHoverOff = () => {
        setHover(false);
      }
  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    console.log('event.target.files[0]', event.target.files[0])
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });


        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
        console.log('values = '+ values)
        console.log('parsedData = '+ parsedData)
      },
    });
  };

    return (
        <>

    
    <form className="space-y-8 divide-y divide-gray-200 lg:px-32 lg:mx-32">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Your Bundl Details</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Recipient Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>

            <form className="mt-10" action="#" method="POST">
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
                        <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <p className="text-lg text-gray-500">
                            Click to upload your CSV file with your contributors information here:
                            </p>
                        </Col>
                        <Col xs={24} sm={12} md={8} className="mx-auto">
                            <input
                            type="file"
                            name="file"
                            accept=".csv"
                            onChange={changeHandler}
                            />
                        </Col>
                        </Row>
                    </div>
                    <Row justify="space-between" align="middle">
                        <Button onClick={addtoList}>Add to above list</Button>
                        <Button
                            onClick={handleDownloadCSV}
                            onMouseEnter={handleHoverOn}
                            onMouseLeave={handleHoverOff}
                        >
                            Download CSV template
                        </Button>
                 </Row>
                            <div className="mt-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        {tableRows.map((rows, index) => {
                                        return (
                                            <th key={index}>{rows}</th>
                                        )
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {values.map((value, index) => {
                                        return (
                                        <tr key={index}>
                                            {value.map((val, i) => {
                                            return <td key={i} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{val}</td>
                                            })}
                                        </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            </Col>
                        </Row>
                        </form>

            <div className="col-span-full">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                        Welcome Message.
                    </label>
                    <div className="mt-2">
                        <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">Welcome message.</p>
                    </div>
          </div>
        </div>

        <div className=" border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Messages to your Contributors</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            How do you want to send your welcome message to the contributors you have selected (we recommend both via email and text message)?
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">We will message via...</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                       Email
                    </label>
                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="candidates" className="font-medium text-gray-900">
                       Text Message
                    </label>
                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="offers" className="font-medium text-gray-900">
                       Facebook Messenger
                    </label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>

          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Where do you want to send the Bundl?</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Send Welcome Message & Kickstart Bundl
        </button>
      </div>
    </form>
        </>
      );
}