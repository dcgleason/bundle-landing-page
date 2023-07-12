import React, { useState, useEffect } from "react";
import {Modal, List, Typography, Button, Table, Input, Select, Upload, message, notification, Form, Row, Col, Space, TextArea, Spin, Card} from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined  } from "@ant-design/icons";
import Papa from 'papaparse';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import moment from 'moment';


export default function Example() {

    const [message, setMessage] = useState("We are creating a book of supportive letters and nice pictures (or 'Bundl') for Dan G. It will only take you a minute to write and submit your letter. It should make for an unforgettable gift that shares our collective love and appreciation. Don't be the last to submit!");
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [userID, setUserID] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [newStudent, setNewStudent] = useState(null);
    const [pictureSubmitted, setPictureSubmitted ] = useState(false);
    const [isTableModalVisible, setIsTableModalVisible] = useState(false);


    const [hover, setHover] = useState(false);

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

    const [userData, setUserData] = useState(null);
    const [recipientFullName, setRecipientFullName] = useState("");
    const [recipientFirstName, setRecipientFirstName] = useState("");
    const [recipientlastName, setRecipientLastName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [googleContacts, setGoogleContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
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
      
  
      const showTableModal = () => {
        setIsTableModalVisible(true);
      };
      
      const handleTableModalOk = () => {
        setIsTableModalVisible(false);
      };
      
      const handleTableModalCancel = () => {
        setIsTableModalVisible(false);
      };
      ;



  const addContactToList = async (contact) => {
    const newContact = {
      id: dataSource.length > 0 ? dataSource[dataSource.length - 1].id + 1 : 0,
      name: contact.names[0].displayName,
      email: contact.emailAddresses[0].value,
      address: '', // Google Contacts does not provide an address field
    };

    // Add the new contact to the dataSource state
    setDataSource(prevDataSource => [...prevDataSource, newContact]);

  };


  const prioritizeEmail = (emailAddresses) => {
    if (!emailAddresses || emailAddresses.length === 0) return '';
    const sortedEmails = emailAddresses.sort((a, b) => {
      if (a.endsWith('.com') && b.endsWith('.edu')) return -1;
      if (a.endsWith('.edu') && b.endsWith('.com')) return 1;
      return 0;
    });
    return sortedEmails[0];
  };

  const filteredContacts = googleContacts.filter(contact => {
    const hasEmail = contact.emailAddresses && contact.emailAddresses.length > 0;
    const matchesSearchTerm = contact.names && contact.names.some(name => name.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    return hasEmail && matchesSearchTerm;
  });

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };


  // In your component's useEffect hook
useEffect(() => {
  const isAuthenticating = localStorage.getItem('isAuthenticating');
  if (isAuthenticating === 'true') {
    setIsAuthenticated(true);
    localStorage.removeItem('isAuthenticating'); // Remove the flag from local storage once it has been checked
  }
}, []);
  

const handleContactSelect = (contact, isSelected) => {
  setSelectedContacts(prevSelectedContacts => {
    if (isSelected) {
      return [...prevSelectedContacts, contact];
    } else {
      return prevSelectedContacts.filter(c => c.resourceName !== contact.resourceName);
    }
  });
};

const addSelectedContactsToList = async () => {
  for (const contact of selectedContacts) {
    await addContactToList(contact);
  }
  setSelectedContacts([]);
  setIsModalOpen(false);
};
  
  async function signInWithGoogle() {
    try {
      const clientId = '764289968872-tdema5ev8sf7djdjlp6a8is5k5mjrf5t.apps.googleusercontent.com';
      const redirectUri = 'https://www.givebundl.com/api/oauth2callback';
      const scope = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/contacts.readonly profile';
      const responseType = 'code';
      const accessType = 'offline';
      const prompt = 'consent';
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}&prompt=${prompt}`;

      localStorage.setItem('isAuthenticating', 'true'); // Set a flag in local storage to indicate that the user is being redirected for authentication   
      window.location.href = url;
    } catch (error) {
      console.error("error in auth" + error);
    }
  }

  async function fetchGoogleContacts() {
    try {
      const auth = Cookies.get('auth');
      if (!auth) {
        console.error('Auth cookie not found');
        return;
      }
  
      const tokens = JSON.parse(auth);
      const response = await fetch('/api/getPeople', {
        headers: {
          'Authorization': `Bearer ${JSON.stringify(tokens)}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contacts = await response.json();
      setGoogleContacts(contacts);
      console.log('Google Contacts:', contacts); // Log the contacts
      setIsModalOpen(true); // Open the modal once the contacts are fetched
    } catch (error) {
      console.error('Failed to fetch Google contacts:', error);
    }
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
    
   
   
    
    const handleEmailModalCancel = () => {
      setEmailModalVisible(false);
    };
    
  
    const closeModal = () => {
      setOpenGmail(false);
    };
  
  
    
    
  
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
          });
        }
      
        // Add the new contacts to the dataSource state
        setDataSource([...dataSource, ...objects]);
      

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

    async function handleSubmit(event) {
        event.preventDefault();
      
        // Check if the user is authenticated
        const auth = Cookies.get('auth'); // Get the authentication tokens from the cookie
        if (!auth) {
          // If the user is not authenticated, redirect them to Google's OAuth URL
          signInWithGoogle();
          return;
        }
      
        // If the user is authenticated, proceed with submitting the form and sending the welcome message
        try {
          await submitAndSendWelcomeMessage(contributors);
          console.log('Form submitted and welcome message sent');
        } catch (error) {
          console.error('Failed to submit form and send welcome message:', error);
        }
      }

   async function submitAndSendWelcomeMessage(contributors) {
  // Assume that contributors is an array of objects, where each object has an email and phone property

  // Step 2: Send email to all contributors
  const emailResponse = await fetch('https://www.givebundl.com/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include the access token in the Authorization header
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      senderName: 'Your Name',
      senderEmail: 'your-email@example.com',
      emailSubject: 'Welcome to the project!',
      emailBody: 'Thank you for contributing to our project. We appreciate your support!',
      recipientEmails: contributors.map(contributor => contributor.email),
    }),
  });

  if (!emailResponse.ok) {
    throw new Error(`Failed to send email: ${emailResponse.status}`);
  }

  // Step 3: Send text message to all contributors
  for (const contributor of contributors) {
    const smsResponse = await fetch('https://www.givebundl.com/api/sendSMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the necessary credentials, if any
      },
      body: JSON.stringify({
        to: contributor.phone,
        message: 'Thank you for contributing to our project. We appreciate your support!',
      }),
    });

    if (!smsResponse.ok) {
      throw new Error(`Failed to send SMS: ${smsResponse.status}`);
    }
  }

  // Step 4: Send all contributors to the backend API
  const bookResponse = await fetch('https://yay-api.herokuapp.com/book/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userID, // The ID of the user
      // Include any other necessary data
    }),
  });

  if (!bookResponse.ok) {
    throw new Error(`Failed to create book: ${bookResponse.status}`);
  }

  const book = await bookResponse.json();
  console.log('Created book:', book);
}

return (
        <>

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
                Your Bundl Recipient&apos;s Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    value={recipientFullName}
                    onChange={(e) => setRecipientFullName(e.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>
           
            
            {isModalOpen && (
                <Modal title="Select a contact" open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                  <input type="text" placeholder="Search contacts..." onChange={handleSearch} />
                  {filteredContacts.map(contact => (
                    <div key={contact.resourceName}>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact)}
                        onChange={event => handleContactSelect(contact, event.target.checked)}
                      />
                      {contact.names && contact.names.length > 0 ? contact.names[0].displayName : 'Unnamed Contact'}
                      <div>Email: {prioritizeEmail(contact.emailAddresses)}</div>
                    </div>
                  ))}
                  <button onClick={addSelectedContactsToList}>Add to list</button>
                </Modal>
              )}
            <Modal
                title={`Contributor List (${dataSource.length})`}
                open={isTableModalVisible}
                onOk={handleTableModalOk}
                onCancel={handleTableModalCancel}
                >
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24}>
                    <Table columns={columns} dataSource={dataSource}></Table>
                    </Col>
                </Row>
                </Modal>

                <div className="col-span-full">
  <Row gutter={[16, 16]} justify="center">
    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
      <Row gutter={[16, 16]} justify="space-around">
        <Col xs={24} sm={12}>
          <Card title="Upload CSV">
            <p className="text-lg text-gray-500">
              Click to upload your CSV file with your contributors information here:
            </p>
            <input
              type="file"
              name="file"
              accept=".csv"
              onChange={changeHandler}
              className="mx-auto d-block"
            />
            <Button className="mt-2" onClick={addtoList}>Add to Contributor List</Button>
            <Button className="mt-2" onClick={handleDownloadCSV}>Download CSV template</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Pull Contacts from Gmail">
          {isAuthenticated ? (
            <Button onClick={fetchGoogleContacts}>Get my Google contacts</Button>
          ) : (
            <Button onClick={signInWithGoogle}>Sign in for Google Contacts</Button>
          )}
          </Card>
        </Col>
      </Row>
      <Row justify="center" className="mt-2">
        <Button onClick={showTableModal}>View Contributor List</Button>
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
          onClick={submitAndSendWelcomeMessage}
        >
          Send Welcome Message & Kickstart Bundl
        </button>
      </div>
    </form>
        </>
      );
}