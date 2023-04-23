import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Dialog from "@mui/material/Dialog";
import LoadingSpinner from "./LoadingSpinner"
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentElement,
  Elements,
  CardElement, 
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import { Modal } from 'antd';
 
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const Input = (props) => {
  const [emails, setEmail] = useState([ { id: uuidv4(),  email: '' }]);
  const [randomNumber, setRandomNumber] = useState(-1)
  const [name, setName] = useState(['']);
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('');
  const [secret, setSecret] = useState(null);
  const [alert, setAlert] = useState({
    type: 'error',
    text: '',
    title: 'Error',
    open: false
  })
  const [ownBundle, setOwnBundle] = useState({
    open: false
  })
  const [ paymentStatus, setPaymentStatus ] = useState({
    status: null,
    title: "Error",
    type: "error",
    open: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startDate, setStartDate] = useState(new Date());

  const stripe = useStripe();
  const elements = useElements();
 
  // useEffect(() => {

  // const fetchData = async () => {
  //   var random = Number((Math.random() * 1000000000).toFixed())
  //     // get the data from the api
  //     const resp =  await fetch("https://yay-api.herokuapp.com/unique/check", { 
  //       method: 'POST', 
  //       headers: { 
  //         'Content-type': 'application/json'
  //        }, 
  //       body: JSON.stringify({
  //        giftCode: random // possible random Number 
  //       })  
  //       }); 
  //    if (!resp){ ////response false - there does not exist a number in the db already, set 
  //      console.log("the repsonse is: " + resp);
  //      setRandomNumber(random);
  //      console.log('random number set to:' + random)
  //    }
  //   else {
  //     fetchData()  // recusively run until response is false and setRandomNumber has run.
  //   }
  // };
  //   fetchData();
  //   }, [])

    useEffect(() => {
      setAlert({
        type: paymentStatus.type,
        text: paymentStatus.status,
        title: paymentStatus.title,
        open: paymentStatus.open
      }); // This will always use latest value of count
  }, [paymentStatus]);



  const handleChangeInput = (id, e) => {
    // generateUniqueRandom();
 
     const newInputFields = emails.map(i => {
       if(id === i.id) {
         i[e.target.name] = e.target.value
       }
       return i;
     })
     
     setOwnEmail(newInputFields);
     console.log(emails);
   }
 
 const handleAddFields = () => {
     setEmail([...emails, { id: uuidv4(),  email: '' }])
   }
 
 const handleRemoveFields = id => {
     const values  = [...emails];
     values.splice(values.findIndex(value => value.id === id), 1);
     setEmail(values);
   }
  
 function timeout(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }
 

 const sendEmails = async () => {
  //const questions = [`What your favorite story about ${name}?`, `What is your favorite memory of you and ${name}?`]
  try {
          if(ownerEmail){
            const response =  await fetch("https://yay-api.herokuapp.com/email/send", { 
              method: 'POST', 
              headers: { 
                'Content-type': 'application/json'
               }, 
              body: JSON.stringify({
                email: ownerEmail,
                ownerName: ownerName,
                recipient: name
              }) 
              }); 
      
            if (response === 200){
             alert("Message Sent."); 
              this.resetForm()
             }else if(response === 500){
               alert("Message failed to send.")
             }

          }
        
      }
      catch {
        console.log('error in sending email(s)');
      }
    };



    const getClientSecret = async (customerEmail) => {
      const response = await fetch('https://yay-api.herokuapp.com/stripe/secret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: customerEmail }),
      }).then((res) => res.json());
    
      const { client_secret } = response;
      var secret = client_secret;
      return secret;
    };
    
    const submitPayment = async () => {
      setIsLoading(true);
      console.log('ownerName: ' + ownerName);
      console.log('ownerEmail: ' + ownerEmail);
    
      // Fetch the client secret
     // Fetch the client secret
  const clientSecret = await getClientSecret(ownerEmail); // Get the client secret directly

    
  // Confirm the card payment
  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: ownerName,
        email: ownerEmail,
      },
    },
  });
    
       // Handling return values
  if (error) {
    setPaymentStatus({
      status: 'Error: ' + error.message,
      title: 'Error',
      type: 'error',
      open: true,
    });
    console.log('There has been a payment error', error.message);
    setIsLoading(false);
    return 'submitpayment function complete - error';
  } else if (paymentIntent && paymentIntent.status === 'succeeded') {
    console.log('Your payment has succeeded', paymentIntent.status);
    setPaymentStatus({
      status: 'Your payment of $49 dollars succeeded',
      title: 'Success',
      type: 'success',
      open: true,
    });

    // Code block to post order to MongoDB
    try {
      const resp = await fetch("https://yay-api.herokuapp.com/gifts/create", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          owner: {
            ownerName: ownerName,
            ownerEmail: ownerEmail,
          },
          gift: {
            recipient: name,
            date: startDate,
          },
        }),
      });

      if (resp) {
        console.log('order posted to mongoDB');
      } else {
        console.log('order not posted to mongoDB');
      }
    } catch (error) {
      console.error(error);
    }

       // postOrderMongoDB();
       // await sendEmails();
        setIsLoading(false);
        return 'submitpayment function complete - success';
      }
    };
//  })();



const postOrderMongoDB = async () => {
  try{
    const resp =  await fetch("https://yay-api.herokuapp.com/gift/create", { 
      method: 'POST', 
      headers: { 
        'Content-type': 'application/json'
       }, 
      body: JSON.stringify({
          owner: {
            ownerName: ownerName,
            ownerEmail: ownerEmail        
          },
          gift: {
              recipient: name,
              date: startDate,
          }
      }) 
      }); 

      if(resp){
        console.log('order posted to mongoDB');
      }
      else {
        console.log('order not posted to mongoDB');
      }
  }
  catch{
    console.error(error)
  }


}

const submitForm = async (e) => {
  e.preventDefault();
  console.log('submitform clicked');

  // Calculate the date 3 weeks from now
  let threeWeeks = new Date(Date.now() + 18144e5);

  // Check if the selected date is before 3 weeks from now
  if (selectedDate < threeWeeks) {
    // Show the modal with the warning message
    Modal.warning({
      title: 'Invalid Date',
      content: 'Please select a date at least 3 weeks from now.',
    });
    return;
  }

  try {
    setIsLoading(true);
    const result = await submitPayment();
    console.log("result is" + result);
  } catch (error) {
    console.error("Error in submitPayment:", error);
  } finally {
    setIsLoading(false);
  }
};

// const updatePaymentIntent = async () => {

//   const resp =  await fetch("https://yay-api.herokuapp.com/stripe/updatePaymentIntent", { 
//     method: 'POST', 
//     headers: { 
//       'Content-type': 'application/json'
//      }, 
//     body: JSON.stringify({
//      receipt_email: ownerEmail
//     })  
//     });
//   const respData = await resp.json(); 
//   console.log('after payment intent update with price amount: '+respData);
//   if(respData){ // work on this to properply handle the error / return message paymentIntent.status would be what?
//     return true
//   }
//   else {
//     return false
//   }
// }

// const databasePost = async () => {
//   const responseEmail =  await fetch("https://yay-api.herokuapp.com/bundle", { 
//      method: 'POST', 
//       headers: { 
//         'Content-type': 'application/json'
//        }, 
//       body: JSON.stringify({
//         email_id: randomNumber,
//         name: name,
//         ownerName: ownerName,
//         ownerEmail: ownerEmail,
//         address: address,
//         apartment: apartment,
//         city: city,
//         state: state,
//         zipCode: zip,
//         country: country,
//         phone: phone
        
//       }) 
//       }); 
//     const rData = await responseEmail.json(); 
//     if (rData.status === 'success'){
//      alert("Message with owner and recipeint info sent Sent."); 
//       this.resetForm()
//      }else if(rData.status === 'fail'){
//        alert("Message failed to send.")
//      }
//     }

let fortnight = new Date(Date.now() + 12096e5);
let month = fortnight.getMonth() + 1;
let day = fortnight.getDate();
let year = fortnight.getFullYear();
let twoWeekDate = month + "/" + day + "/" + year;

let threeWeeks = new Date(Date.now() + 18144e5);
let theMonth = threeWeeks.getMonth() + 1;
let theDay = threeWeeks.getDate();
let theYear = threeWeeks.getFullYear();
let threeWeekDate = theMonth + "/" + theDay + "/" + theYear;
 



const handleClick = () => {
  setAlert({
    open: false
  })
}



// const submitRequest = async (e) => {
//   e.preventDefault();
//   // setOwnBundle({
//   //   open: false
//   // })
//   const result = await submitPayment();
//  // alert('Form submitted. Y&Y is still in development - your card was not charged!')
// console.log(result);
// setIsLoading(false);
// //setNotification(true);
// //postOrderMongoDB()
// //sendEmails()
// };


  return (
    <div>

      <Dialog open={alert.open} onClose={handleClick}>
        <Alert
          severity={alert.type}
          color={alert.type}
          role="button"
          onClose={() => handleClick()}
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

      {/* <Dialog open={ownBundle.open} onClose={handleOwnBundleClose}>
        <DialogTitle>Get a Bundle for yourself!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like us to gather your own Bundle for you? If so, fill out who you would like to write in your Bundle. If not, just leave this field blank.

          </DialogContentText>
           {ownEmails.map(obj => (
             <TextField
             key={obj.id}
             autoFocus
             id="name"
             label="Contributor Email Address"
             type="email"
             fullWidth
             onChange={e => handleChangeInputOwnBundle(obj.id, e)}
             value={ownEmails.email}
             variant="standard"
           />
    
            ))}
             <div className="inline-flex">
               <button  onClick={handleAddFieldsOwnBundle} className="bg-gray-300 hover:bg-gray-400 text-gray-800 border-4 py-1 px-6 rounded-l">
             <span className='font-bold'> Add Contributor </span> 
              </button>
            <button disabled={ownEmails.length === 1} onClick={() => handleRemoveFieldsOwnBundle(ownEmails.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 border-4 py-1 px-2 rounded-r">
             <span className='font-bold'> Remove Contributor </span>
            </button>
           
           </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOwnBundleClose}>Go back</Button>
          <Button onClick={submitRequest}>Submit and Continue</Button>
        </DialogActions>
      </Dialog> */}
      
      <div className="flex flex-col items-center justify-around bg-gray-200"></div>
      {/* <div className="w-full max-w-sm m-auto flex flex-col my-32"> */}

        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border-gray-200 border"
          // onSubmit={submitForm}
        >
          <h1 className="text-2xl pt-6 pb-6 text-center font-medium text-gray-800">
            Order your Bundl book
          </h1>
          <div className="text-m pt-2 pb-2 text-center font-small text-gray-800">
            Note: a Bundl concierge will collect all necessary information (shipping address, Bundl book contributor email addresses, etc.) in a subsequent email to you and will continue to coordinate the creation of your Bundl book gift. 
         </div>
          <h2 className="text-xl pt-3 pb-3 text-center underline font-medium text-gray-800">
            Your Information
          </h2>
          <div className="mb-4">
          <label
              className="block text-gray-700 text-sm py-2 font-bold mb-2"
              htmlFor="Email"
            >
             Your first and last name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="Full name"
              onChange={e => setOwnerName(e.target.value)}
              value={ownerName}
              required
            />
          <label
              className="block text-gray-700 text-sm py-2 font-bold mb-2"
              htmlFor="Email"
            >
              Your email address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="Email address"
              onChange={e => setOwnerEmail(e.target.value)}
              value={ownerEmail}
              required
            />
            {/* Shipping information top */}  
            
            {  ownerEmail.length >= 1 ?
           (
           <>
           <div className='sm:border-t sm:border-gray-200 mt-7 '>
           <h2 className="text-xl pt-5 font-medium text-center underline text-gray-800">Billing Information</h2>
            {/* <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
  
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
            </div> */}
            <label
              className="block text-gray-700 text-sm py-2 font-bold"
              htmlFor="Email"
            >
              
            </label>
             <CardElement  className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
             </div>
            </>
           )
          : <div></div> 
          }

          
            {/* Shipping information bottom */}  
    
          <div className='sm:border-t sm:border-gray-200 sm:pt-5 mt-7'>
            <h2 className="text-xl pt-3 pb-3 text-center underline font-medium text-gray-800">
            Bundl book Information
           </h2>
           <label
              className="block text-gray-700 text-sm py-2 font-bold mb-2"
              htmlFor="Email"
            >
              First and last name of your Bundl book recipient:
            </label>
            <input
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="Full name of Bundle recipient "
              onChange={e => setName(e.target.value)}
              value={name}
              required
            />
            <label  className="block text-gray-700 text-sm py-2 font-bold mb-2">
             Your Bundl book delivery date (earliest possible: {String(threeWeekDate)}):
            </label>
            <div className="form-group">
                <DatePicker
                    selected={startDate }
                    onChange={setStartDate}
                    name="startDate"
                    dateFormat="MM/dd/yyyy"
                    className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-1/4"
                />
        </div>
            {/* <label
              className="block text-gray-700 text-sm py-2 font-bold mb-2"
              htmlFor="Email"
            >
              Email addresses of Bundle contributor:
            </label>
            {emails.map(obj => (
            <input
              key={obj.id}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="email"
              placeholder="Email address of contributor"
              onChange={e => handleChangeInput(obj.id, e)}
              value={emails.email}
              required
            />
            ))} */}
           {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="about" className="block text-sm font-bold text-gray-700 sm:mt-px sm:pt-2">
                Your message to contributors:
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  required
                  onChange={e => setGiftOwnerMessage(e.target.value)}
                  value={giftOwnerMessage}
                  className="max-w-lg shadow block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div> */}
          </div>
            
     
     {isLoading ? 
          <LoadingSpinner /> : 
          <div className="flex items-center justify-between">
         
           <button
              className="bg-[#f8ad9d] hover:bg-[#f4978e] text-white font-bold py-2 px-4 mt-6 w-full rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={submitForm}
            >
              Submit Payment ($49) & Order Bundl book
            </button>  
          </div>
      }
          </div>
        </form>
      {/* <div className="inline-flex">
        <button  onClick={handleAddFields} className="bg-gray-300 hover:bg-gray-400 text-gray-800 border-4 py-1 px-6 rounded-l">
             <span className='font-bold'> Add Contributor </span> 
              </button>
            <button disabled={emails.length === 1} onClick={() => handleRemoveFields(emails.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 border-4 py-1 px-2 rounded-r">
             <span className='font-bold'> Remove Contributor </span>
            </button>
           
           </div> */}
              {/* </div> */}
      
      
      </div>

    
  );
};

export default Input;
  