import React, { useState, useEffect } from "react";
import {Modal, List, Typography, Button, Table, Input, Select, Upload, message, notification, Form, Row, Col, Space, TextArea, Spin} from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined  } from "@ant-design/icons";
import Papa from 'papaparse';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import moment from 'moment';

export default function Example() {

    const [message, setMessage] = useState("We are creating a video montage (or 'Tribute') for Dan G. It will only take you a minute to film and submit your video. It should make for an unforgettable gift that shares our collective love and appreciation. Don't be the last to submit!");
    const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [newStudent, setNewStudent] = useState(null);
  const [pictureSubmitted, setPictureSubmitted ] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [hover, setHover] = useState(false);
  const [userID, setUserID] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [emailSubject, setEmailSubject] = useState("Contribute please - 3 days left!");
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [values, setValues] = useState([]);
  const [modalData, setModalData] = useState("");
  const [ submission, setSubmission ] = useState("");
  const [openGmail, setOpenGmail] = useState(false)
  const [ gmailContacts, setGmailContacts ] = useState([{}]);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [layout, setLayout] = useState('');
  const [msg, setMsg] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastEmailSent, setLastEmailSent] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [viewPicture, setViewPicture] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [prompts, setPrompts] = useState([
    "How has Jimmy affected your life?",
    "What do you love about Jimmy?",
    "What's your favorite memory with Jimmy?",
    "How has Jimmy inspired you?",
    "What do you wish for Jimmy's future?"
  ]);
  const [longMessage, setLongMessage] = useState('');
  const [token, setToken] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientlastName, setRecipientLastName] = useState("");
  const [userData, setUserData] = useState(null);

  



  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "4",
      title: "SMS",
      dataIndex: "sms",
    },
    {
      key: "5",
      title: "Submitted",
      dataIndex: "submitted",
      render: (_, record) => {
        return record.submitted == "Yes" ? "Yes" : "No";
      },
    },
    {
      key: "6",
      title: "Submission",
      dataIndex: "submission",
      render: (_, record) => { 
        return (
          <>
          {record.submission && record.submission !== "No submission" ?
          <a className="underline" onClick={ () => handleModalOpen(record)}>Preview Submission</a>
          :
          "No Submission"
          }
          </>
        )
      }
    },   
    {
      key: "7",
      title: "Picture",
      dataIndex: "picture",
      render: (_,record) => { 
        return (
          <>
          {record.img_file && record.img_file !== "" ?
          <a className="underline" onClick={ () => handleViewPicture(record)}>View Picture</a>
          :
          "No Picture Uploaded"
          }
          </>
        )
      }
    },
    {
      key: "8",
      title: "Notes",
      dataIndex: "notes",
    },
    {
      key: "9",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {

    const token = localStorage.getItem('token');
    const userID = jwt_decode(token).userId;


    const fetchUser = async () => {
      const response = await fetch(`https://yay-api.herokuapp.com/users/${userID}`);
      const data = await response.json();

      if (data) {
        setUserData(data);
        console.log('User data inside fetch user: ', data);
        if (data.recipient === "") {
          console.log('Recipient is empty');
          setRecipientModalIsOpen(true);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  
    if (!token) {
      console.error('Token is not available in local storage');
      signInWithGoogle(); // Redirect to Google's authorization URL
      return;
    }
  
    setEmailBody(`We'd love you to contribute to this bundle -- link here: <a href="https://www.givebundl.com/contribute/${jwt_decode(token).userId}">Link to Contribution Page</a>`)

    // Decode the JWT token to get the user's ID
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.userId; // Changed from 'userID' to 'userId'
    const fetchUser = async () => {
      const response = await fetch(`https://yay-api.herokuapp.com/users/${userID}`);
      const user = await response.json();
      if (user.lastEmailed) {
        let localEmailDate = localStorage.getItem('lastEmailSent');
        let emailDate = moment(user.lastEmailed);
        if (localEmailDate && moment(localEmailDate).isAfter(emailDate)) {
          emailDate = moment(localEmailDate);
        }
        setLastEmailSent(emailDate.format('MMMM Do, YYYY @ h:mm A'));
        console.log("lastEmailSent", emailDate.format());
      }
      console.log("user", user);
      console.log("lastEmailSent", user.lastEmailed);
    };
  if(userID){
    fetchUser();
  }
  }, [lastEmailSent]);


  useEffect(() => {
    const auth = Cookies.get('auth'); // Get the authentication tokens from the cookie
    console.log("auth", auth);
    // If the authentication tokens are present, set isAuthenticated to true
    if (auth) {
      setIsAuthenticated(true);
      console.log('Authentication tokens are available in the cookie')
    } else {
      setIsAuthenticated(false);
      console.log('Authentication tokens are not available in the cookie')
    }
  }, [isAuthenticated]);

  console.log("isAuthenticated", isAuthenticated);


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
    const redirectUri = 'https://www.console.givebundl.com/api/oauth2callback'; // Update this to your actual server address
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

  const openEmailModal = () => {
    // Get the emails of people who have not yet contributed
    const nonContributors = dataSource.filter(student => student.submitted === "No").map(student => student.email);
    setEmailRecipients(nonContributors.join(', '));
    console.log('Non-contributors:', nonContributors);
    setEmailModalVisible(true);
  };
  
  // const handleEmailModalOk = async () => {
  //   // Here you would handle sending the email
  //   console.log(emailBody, emailSubject, emailRecipients);
  
  //   // Prepare the data to send
  //   const emailData = {
  //     body: emailBody,
  //     subject: emailSubject,
  //     recipients: emailRecipients.split(', '), // Assuming recipients are separated by a comma and a space
  //   };
  
  //   try {
  //     // Send a POST request to your backend
  //     const response = await fetch('https://yay-api.herokuapp.com/email/send', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${session.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         subject: 'Contribute please - 3 days left!',
  //         body: 'We would love you to contribute to this bundle',
  //         recipients: emailRecipients.split(', ')
  //       }),
  //     })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  
  //     // Check if the request was successful
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  
  //     console.log('Email sent successfully');
  //   } catch (error) {
  //     console.error('Failed to send email:', error);
  //   }
  
  //   setEmailModalVisible(false);
  // };
 
  
  const handleEmailModalCancel = () => {
    setEmailModalVisible(false);
  };
  

  const closeModal = () => {
    setOpenGmail(false);
  };


  
    // const contactsResponse = await fetch('https://yay-api.herokuapp.com/email/contacts', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`,
    //   },
    // });
  
    // const contacts = await contactsResponse.json();
    // setContacts(contacts);
    // setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChangeUpload = (info) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);

    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      notification.success({
        message: 'Picture successfully uploaded',
        duration: 2,
      });
      setPictureSubmitted(true);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = (data) => {
    setModalData(data);
    console.log("data is", data)
    setShowModal(true);
  };

  const displaySubmission = (data) => {
    if (!data || !data.submission) {
      return "No submission available";
    }
  
    return (
      <div>
        <p>{data.submission}</p>
      </div>
    );
  };

  const handleViewPicture = (record) => {
    setPictureUrl(record.img_file);
    setViewPicture(true)
  };
  
  const handleClosePictureModal = () => {
    setPictureUrl(null);
    setViewPicture(false);
  };
  
  
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

  const handlePromptOk = async () => {
    const token = localStorage.getItem('token');
    const userID = jwt_decode(token).userId;
    const url = `https://yay-api.herokuapp.com/users/${userID}/prompts`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompts, longMessage }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Prompts updated on the server successfully');
      setIsPromptModalVisible(false);
    } catch (error) {
      console.error('Failed to update prompts on the server:', error);
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
  
  const onAddStudent = () => {
    setIsModalVisible(true);
  
    const newStudent = {
      id: dataSource[dataSource.length - 1].id + 1,
      name: name,
      email: email,
      layout: layout? layout : 1,
      msg: msg,
    };
  
    // Make a POST request to your API endpoint
    fetch(`https://yay-api.herokuapp.com/book/${userID}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Update the local state only after the new student has been added to the database
      setDataSource((pre) => {
        return [...pre, newStudent];
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };


  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    console.log('email sent')
    let token = localStorage.getItem('token');
    if (!token) {
      // If the user is not signed in, prompt them to do so
      // You would need to implement this part based on how your sign-in system works
    } else {
      // If the user is signed in, send the email
      const recipientEmails = emailRecipients.split(',').map(email => email.trim());
  
      // Decode the JWT
      const decoded = jwt_decode(token);
  
      // Extract the sender's name and username from the decoded JWT
      const senderName = decoded.name;
      const senderEmail = decoded.username;
      const userID = decoded.userId;
  
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use the new token
        },
        body: JSON.stringify({
          senderName,
          senderEmail,
          emailSubject, // Use the emailSubject state variable
          emailBody, // Use the emailBody state variable
          recipientEmails,
          userID,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Email sent successfully');
      setIsSendingEmail(false);
      setEmailModalVisible(false);
      setShowSuccessModal(true);
  
      // Create a new date only if lastEmailSent is null
      let newDate;
      newDate = moment().toDate();
      localStorage.setItem('lastEmailSent', newDate);
  
        // Update lastEmailed attribute in the backend
        await fetch(`https://yay-api.herokuapp.com/users/${userID}/lastEmailed`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lastEmailed: newDate,
          }),
        });
  
        // Format the new date and update the lastEmailSent state variable
        setLastEmailSent(moment(newDate).format('MMMM Do, YYYY @ h:mm A'));
    }
  };
  


  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  
  
  const onDeleteStudent = (record) => {
    console.log('delete record.uuid = '+ record.uuid)
    Modal.confirm({
      title: "Are you sure, you want to delete this student record?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        setDataSource((pre) => {
          return pre.filter((student) => student.id !== record.id);
        });
  
        // Send a DELETE request to your server to delete the student
        const response = await fetch(`https://yay-api.herokuapp.com/book/${userID}/message/${record.uuid}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        console.log('Student deleted from the server successfully');
      },
    });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  const openPrompts = () => {
    setIsPromptModalVisible(true);
  };


  const handlePromptCancel = () => {
    setIsPromptModalVisible(false);
  };

  const handleRecipientOk = async () => {
    const response = await fetch(`https://yay-api.herokuapp.com/users/${userID}/recipient`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientFullName: `${firstName} ${lastName}`,
        recipientFirstName: firstName,
      }),
    });

    if (response.ok) {
      setModalIsOpen(false);
    } else {
      console.error('Failed to update recipient');
    }
  };

  const handleOk = async () => {
    setIsModalVisible(false);
  
    const newStudent = {
      id: dataSource.length + 1,
      name: name,
      email: email,
      submitted: submitted,
      submission: submission,
      picture: pictureSubmitted, // starts as an empty string
      notes: notes,
    };
  
    // Add the new student to the dataSource state
    setDataSource([...dataSource, newStudent]);
  
    // Now, send the new student to the server
    try {
      const formData = new FormData();
      formData.append('layout_id', 1); // Or whatever layout_id you want to use
      formData.append('name', newStudent.name);
      formData.append('msg', newStudent.submission || 'none');
      formData.append('imageAddress', newStudent.picture || 'none'); // Assuming newStudent.picture is a File object
      formData.append('email', newStudent.email || 'none');
  
      const response = await fetch(`https://yay-api.herokuapp.com/book/${userID}/message`, {
        method: 'POST',
        body: formData, // Send formData instead of JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Student added to the server successfully');
    } catch (error) {
      console.error('Failed to add student to the server:', error);
    }
  }
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };
    return (
        <>

            <Modal
                    title="Who is this bundl for?"
                    open={modalIsOpen}
                    onOk={handleRecipientOk}
                    onCancel={() => setModalIsOpen(false)}
                >
                    <Input placeholder="First Name" onChange={e => setRecipientFirstName(e.target.value)} />
                    <Input placeholder="Last Name" onChange={e => setRecipientLastName(e.target.value)} />
                </Modal>

                
                <Modal
                    open={showModal}
                    onCancel={handleModalClose}
                    title="Submission"
                    props={{ data: modalData }}
                    footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose}>
                        OK
                    </Button>,
                    ]}
                >
                    {displaySubmission(modalData)}
                </Modal>
                <Modal title="Choose Prompts and Note" open={isPromptModalVisible} onOk={handlePromptOk} onCancel={handlePromptCancel}>
                {prompts.map((prompt, index) => (
                    <Input
                    key={index}
                    placeholder={`Prompt ${index + 1}`}
                    value={prompt}
                    onChange={(e) => {
                        const newPrompts = [...prompts];
                        newPrompts[index] = e.target.value;
                        setPrompts(newPrompts);
                    }}
                    style={index > 0 ? { marginTop: '10px' } : {}}
                    />
                ))}
                <TextArea
                    placeholder="Longer message"
                    value={longMessage}
                    onChange={(e) => setLongMessage(e.target.value)}
                    style={{ marginTop: '10px' }}
                    />
                </Modal>
                <div className="App">
                <header className="App-header px-4 sm:px-6 md:px-8 mb-4">
                        <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Button onClick={openPrompts}>Write Prompts and Note</Button>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Button onClick={onAddStudent}>Add contributor manually</Button>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        {isAuthenticated ? (
                        <Button onClick={openEmailModal}>Send Email</Button>
                        ) : (
                        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
                        )}
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Button onClick={onSendSMS}>Send SMS</Button>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        {lastEmailSent && <p className='text-sm'>Last email sent: {lastEmailSent}</p>}
                    </Col>
                    </Row>
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24}>
                        <Table columns={columns} dataSource={dataSource}></Table>
                        </Col>
                    </Row>
                    <Modal
                    title="Send Email"
                    open={emailModalVisible}
                    onCancel={handleEmailModalCancel}
                    footer={null} 
                    >
                    <Form layout="vertical">
                        <Form.Item label="To">
                        <Input.TextArea value={emailRecipients} onChange={e => setEmailRecipients(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Subject">
                        <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Body">
                        <Input.TextArea value={emailBody} onChange={e => setEmailBody(e.target.value)} />
                        </Form.Item>
                    </Form>
                    {isSendingEmail ? (
                        <Spin />
                    ) : (
                        <Button key="ok" type="primary" onClick={handleSendEmail}>
                        Send it
                        </Button>
                    )}
                    </Modal>
                    <Modal
                            title="Success"
                            open={showSuccessModal}
                            onCancel={() => setShowSuccessModal(false)}
                            footer={null}
                        >
                            <p>Email has been sent.</p>
                        </Modal>
                        <Modal
                        title="Edit Contributor"
                        open={isEditing}
                        okText="Save"
                        onCancel={() => {
                            resetEditing();
                        }}
                        onOk={async () => {
                            setDataSource((pre) => {
                            return pre.map((student) => {
                                if (student.id === editingStudent.id) {
                                return editingStudent;
                                } else {
                                return student;
                                }
                            });
                            });

                            try {
                            const response = await fetch(`https://yay-api.herokuapp.com/book/${userID}/message/${editingStudent.uuid}`, {
                                method: 'PUT',
                                headers: {
                                'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                layout_id: 1,
                                name: editingStudent.name,
                                msg: editingStudent.submission || 'None',
                                img_file: editingStudent.picture || 'None',
                                email: editingStudent.email || 'None', 
                                }),
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            console.log('Student updated on the server successfully');
                            } catch (error) {
                            console.error('Failed to update student on the server:', error);
                            }

                            resetEditing();
                        }}
                        >
                        <label>Name</label>
                        <Input
                            value={editingStudent?.name}
                            onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, name: e.target.value };
                            });
                            }}
                        />
                        <label>Email</label>
                        <Input
                            value={editingStudent?.email}
                            onChange={(e) => {
                            setEditingStudent((pre) => {
                            
                                return { ...pre, email: e.target.value };
                            });
                            }}
                        />
                        <label>Submitted</label>
                        <Select
                            value={editingStudent?.submitted}
                            onChange={(value) => {
                            setEditingStudent((pre) => {
                                return { ...pre, submitted: value };
                            });
                            }}
                            options={[
                            {
                                value: 'Yes',
                                label: 'Yes',
                            },
                            {
                                value: 'No',
                                label: 'No',
                            },
                            ]}
                        />
                        <label>Submission</label>
                        <TextArea
                            rows={10}
                            type="textarea"
                            maxLength={3500}
                            value={editingStudent?.submission}
                            onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, submission: e.target.value };
                            });
                            }}
                        />
                        
                        <label>Notes</label>
                        <Input
                            value={editingStudent?.notes}
                            onChange={(e) => {
                            setEditingStudent((pre) => {
                                return { ...pre, notes: e.target.value };
                            });
                            }}
                        />

                        <label>Picture Upload</label>
                        <Upload
                            name="avatar"
                            listType="picture"
                            className="avatar-uploader"
                            showUploadList={false}
                            action='api/upload'
                            onChange={handleChangeUpload}
                        >
                            <div>
                            <InboxOutlined />
                            </div>
                        </Upload>
                        </Modal>
                    <Modal
                        title="Add a new contributor manually"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <label>Name</label> <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                        <label>Email</label> <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <label>Submitted</label> 
                        <Select
                        defaultValue="Yes"
                        style={{ width: 120 }}
                        onChange={(value) => setSubmitted(value)}
                        allowClear
                        options={[
                            {
                            value: 'yes',
                            label: 'Yes',
                            },
                            {
                            value: 'no',
                            label: 'No',
                            }
                        ]}
                        />
                        <label>Submission</label> 
                        <TextArea type='textarea' rows={10} maxLength={650} placeholder="Submission" value={submission} onChange={(e) => setSubmission(e.target.value)}/>
                        <label>Picture Upload</label>
                        <Upload
                        name="avatar"
                        listType="picture"
                        className="avatar-uploader"
                        showUploadList={false}
                        action='api/upload' // POST request to this api endpoint for picture
                        onChange={handleChangeUpload}
                        >
                        <div>
                            <InboxOutlined />
                        </div>
                        </Upload>
                        <label>Notes</label> 
                        <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Modal>
                            <Modal
                            title="View Picture"
                            open={viewPicture}
                            onCancel={handleClosePictureModal}
                            footer={null}
                        >
                            {/* <img src={pictureUrl} alt="Submission" style={{ maxWidth: '100%' }} /> */}
                        </Modal>
                </header>
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
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
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

            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
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

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We will always let you know about important changes, but you pick what else you want to hear about.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
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
                      Comments
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
                      Candidates
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
                      Offers
                    </label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-everything"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                    Everything
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-email"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                    Same as email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
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
          Save
        </button>
      </div>
    </form>
        </>
      );
}