/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Fragment, useState } from 'react'
import { Dialog, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import { MenuIcon, SearchIcon, ShieldCheckIcon, ShoppingBagIcon, XIcon } from '@heroicons/react/outline'
import { StarIcon } from '@heroicons/react/solid'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { Input, Instructions, NewsletterContactForm } from "../components/index"
import { HubspotContactForm } from '../components/index';
import Head from "next/head"
import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

const Footer = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://testimonial.to/js/iframeResizer.min.js';
    script.onload = () => {
      if (iframeRef.current) {
        window.iFrameResize({ log: false, checkOrigin: false }, iframeRef.current);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id="testimonialto-bundl-tag-all-light"
      src="https://embed-v2.testimonial.to/carousel/all/bundl?theme=light&autoplay=off&showmore=on&one-row=on&same-height=off&tag=all"
      width="100%"
    ></iframe>
  );
};


const navigation = {
  categories: [
    // {
    //   id: 'women',
    //   name: 'Women',
    //   featured: [
    //     {
    //       name: 'New Arrivals',
    //       href: '#',
    //       imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
    //       imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
    //     },
    //     {
    //       name: 'Basic Tees',
    //       href: '#',
    //       imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
    //       imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
    //     },
    //   ],
    //   sections: [
    //     {
    //       id: 'clothing',
    //       name: 'Clothing',
    //       items: [
    //         { name: 'Tops', href: '#' },
    //         { name: 'Dresses', href: '#' },
    //         { name: 'Pants', href: '#' },
    //         { name: 'Denim', href: '#' },
    //         { name: 'Sweaters', href: '#' },
    //         { name: 'T-Shirts', href: '#' },
    //         { name: 'Jackets', href: '#' },
    //         { name: 'Activewear', href: '#' },
    //         { name: 'Browse All', href: '#' },
    //       ],
    //     },
    //     {
    //       id: 'accessories',
    //       name: 'Accessories',
    //       items: [
    //         { name: 'Watches', href: '#' },
    //         { name: 'Wallets', href: '#' },
    //         { name: 'Bags', href: '#' },
    //         { name: 'Sunglasses', href: '#' },
    //         { name: 'Hats', href: '#' },
    //         { name: 'Belts', href: '#' },
    //       ],
    //     },
    //     {
    //       id: 'brands',
    //       name: 'Brands',
    //       items: [
    //         { name: 'Full Nelson', href: '#' },
    //         { name: 'My Way', href: '#' },
    //         { name: 'Re-Arranged', href: '#' },
    //         { name: 'Counterfeit', href: '#' },
    //         { name: 'Significant Other', href: '#' },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: 'men',
    //   name: 'Men',
    //   featured: [
    //     {
    //       name: 'New Arrivals',
    //       href: '#',
    //       imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
    //       imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
    //     },
    //     {
    //       name: 'Artwork Tees',
    //       href: '#',
    //       imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
    //       imageAlt:
    //         'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
    //     },
    //   ],
    //   sections: [
    //     {
    //       id: 'clothing',
    //       name: 'Clothing',
    //       items: [
    //         { name: 'Tops', href: '#' },
    //         { name: 'Pants', href: '#' },
    //         { name: 'Sweaters', href: '#' },
    //         { name: 'T-Shirts', href: '#' },
    //         { name: 'Jackets', href: '#' },
    //         { name: 'Activewear', href: '#' },
    //         { name: 'Browse All', href: '#' },
    //       ],
    //     },
    //     {
    //       id: 'accessories',
    //       name: 'Accessories',
    //       items: [
    //         { name: 'Watches', href: '#' },
    //         { name: 'Wallets', href: '#' },
    //         { name: 'Bags', href: '#' },
    //         { name: 'Sunglasses', href: '#' },
    //         { name: 'Hats', href: '#' },
    //         { name: 'Belts', href: '#' },
    //       ],
    //     },
    //     {
    //       id: 'brands',
    //       name: 'Brands',
    //       items: [
    //         { name: 'Re-Arranged', href: '#' },
    //         { name: 'Counterfeit', href: '#' },
    //         { name: 'Full Nelson', href: '#' },
    //         { name: 'My Way', href: '#' },
    //       ],
    //     },
    //   ],
    // },
  ],
  pages: [
    { name: 'Home', href: '#' },
    { name: "AI Gift Idea Generator", href: 'https://givebundl.com/gift-idea-generator' },
  //  { name: "Add Contributors", href: 'http://bundlbooks.com/contributors'} // need a way for the browser to known what gift the person is writing for / adding contributors to (and they can only add contributors once) - git code;

  ],
}
const userNavigation = [
 // { name: 'AI Gift Idea Generator', href: 'https://givebundl.com/gift-idea-generator' },
  // { name: 'Create account', href: '#' },
]
const product = {
  name: "Give a special keepsake to your loved one.", // // give love, get love. //   "Love is not just an emotion, it's an action."
  price: '$59',
  description:
   '',
  imageSrc: "test",
  imageAlt: 'Bundl logo',
  breadcrumbs: [
    { id: 1, name: 'Travel', href: '#' },
    { id: 2, name: 'Bags', href: '#' },
  ],
  sizes: [
    { name: '10 pages', description: 'Perfect for a reasonable amount of snacks.' },
    { name: '20 pages', description: 'Enough room for a serious amount of snacks.' },
  ],
}
const policies = [
  {
    name: 'Create a special memory',
    description:
      'Give a gift your family member or friend will remember for the rest of his or her life.',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg', 
  },
  {
    name: '24/7 Customer Support',
    description:
      'As a company, we are committed to answering any questions or addressing any concerns you might have, quickly. Email us and we will respond within 24 hours.',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-chat-light.svg',
  },
  {
    name: 'Fast turn-around',
    description:
      "Within three weeks after ordering, you'll have your Bundle at your door-step, ready to gift.",
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-fast-checkout-light.svg',
  },
  {
    name: 'Vouchers',
    description:
      "Not a great time for you to gift a Bundle right now? Email us your details and we will send you a voucher to use for later, or to gift to someone you know.",
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg',
  },
]
const reviews = {
  average: 5,
  totalCount: 2,
  counts: [
    { rating: 5, count: 1 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 }, 
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ],
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>Great gift! We have used Bundl most recently to honor our school retirees...it went over really well.</p>
      `,
      author: 'Eliza Irwin',
      avatarSrc:
        'https://i.ibb.co/b60fvcy/eliza.jpg',
    },
    // More reviews...
  ],
}
const footerNavigation = {
  products: [
    // { name: 'Bags', href: '#' },
    // { name: 'Tees', href: '#' },
    // { name: 'Objects', href: '#' },
    // { name: 'Home Goods', href: '#' },
    // { name: 'Accessories', href: '#' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  customerService: [
    { name: 'Contact', href: '#' },
    { name: 'Return Policy', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'Secure Payments', href: '#' },
    { name: 'FAQ', href: '#' }
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Front() {


  const [open, setOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [secret, setSecret] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[betaEmail, setBetaEmail] = useState('');
  const[betaReferralSource, setBetaReferralSource] = useState('');
  const[betaName, setBetaName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const stripePromise = loadStripe('pk_live_51KtCf1LVDYVdzLHCUtQK32jpPhwyxyjzgPrrkkmMILYyKKIZ0IQMg6qcabL5jZm1Po6hrjoTNPOpkcaCrTyIXPyK00vfZkVAtP');

  const showModal = () => {
    setModalVisible(true);
  };

// useEffect(() => {
//         const getClientSecret = async () => {
//         const response =  await fetch('https://yay-api.herokuapp.com/stripe/secret').then(res => res.json());
//        // console.log('response: '+ JSON.stringify(response));
//         const {client_secret} = response;
       
//         setSecret(client_secret)
      
// }

    
//         getClientSecret();
//       //  console.log('secret: ' + secret)

// }, []);

// useEffect(() => {
//   console.log('secret updated:', secret);
// }, [secret]);





// const options = {
//     client_secret: secret
//   }  

// const submitBetaInfo = async () => {
//   setIsModalOpen(false)
//   const response =  await fetch("https://yay-api.herokuapp.com/beta/signup", { 
//     method: 'POST', 
//     headers: { 
//       'Content-type': 'application/json'
//      }, 
//     body: JSON.stringify({
//      name: betaName,
//      email: betaEmail,
//      referralSource: betaReferralSource
//     })  
//     });
//   console.log("modal submit api response" + response);
// }


  return (

    <>

<Head>
    <title>Bundl - The Perfect Keepsake for Life&apos;s Special Moments</title>
    <meta name="description" content="Bundl - The Perfect Keepsake for Life's Special Moments" />
  </Head>
<div>

    <Script id='google-inline' strategy='lazyOnload' src={`https://www.googletagmanager.com/gtag/js?id=G-Q7EKYQCWR0`}> </Script>
    <Script id='google-analytics' strategy='lazyOnload'>{` window.dataLayer = window.dataLayer || [];
  function gtag(){
    dataLayer.push(arguments);
  }
  gtag('js', new Date());

  gtag('config', 'G-Q7EKYQCWR0');`}</Script>
    
    </div><div className="bg-gray-100">
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 pt-5 pb-2 flex">
                  <button
                    type="button"
                    className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex px-4 space-x-8">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) => classNames(
                            selected ? 'text-indigo-600 border-indigo-600' : 'text-gray-900 border-transparent',
                            'flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium'
                          )}
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="pt-10 pb-8 px-4 space-y-10">
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative text-sm">
                              <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                <Image src={item.imageSrc} alt={item.imageAlt} className="object-center object-cover" height='10' width='10' />
                              </div>
                              <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                <span className="absolute z-10 inset-0" aria-hidden="true" />
                                {item.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <a href={item.href} className="-m-2 p-2 block text-gray-500">
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>

                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 p-2 block font-medium text-gray-900">
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                {/* <div className="border-t border-gray-200 py-6 px-4 space-y-6">
      <div className="flow-root">
        <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
          Sign in
        </a>
      </div>
      <div className="flow-root">
        <a href="#" className="-m-2 p-2 block font-medium text-gray-900">
          Create account
        </a>
      </div>
    </div> */}




                <div className="border-t border-gray-200 py-6 px-4">

                  <a href="#" className="m-2 p-2 flex items-center">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1600px-Flag_of_the_United_States.svg.png?20151118161041"
                      alt=""
                      className="w-5 h-auto block flex-shrink-0"
                      height='25'
                      width='30' />
                    {/* <span className="ml-3 block text-base font-medium text-gray-900">USA</span>
                    <span className="sr-only">, change currency</span> */}
                  </a>
                </div>

              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        <header className="relative bg-white">
          {/* <p className=" bg-[#ffdab9] h-12 flex items-center justify-center text-sm font-medium text-white px-4 sm:px-6 lg:px-8">
      DEV
    </p> */}

          <nav aria-label="Top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200">
              <div className="h-16 flex items-center">
                <button
                  type="button"
                  className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Logo */}
                <div className="ml-4 flex lg:ml-0 relative">
                  <a href="#">
                    <span className="sr-only">Bundl Books</span>
                    <Image
                      className="h-6 w-auto"
                      src='https://upload.wikimedia.org/wikipedia/commons/5/59/Bundl_Books_Logo_%281%29.png'
                      alt=""
                      height='6'
                      width='6' />
                  </a>
                </div>
                {/* Flyout menus */}
                <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="h-full flex space-x-8">
                    {navigation.categories.map((category) => (
                      <Popover key={category.name} className="flex">
                        {({ open }) => (
                          <>
                            <div className="relative flex">
                              <Popover.Button
                                className={classNames(
                                  open
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-700 hover:text-gray-800',
                                  'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                                )}
                              >
                                {category.name}
                              </Popover.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Popover.Panel className="absolute z-10 top-full inset-x-0 text-sm text-gray-500">
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                                <div className="relative bg-white">
                                  <div className="max-w-7xl mx-auto px-8">
                                    <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                      <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                        {category.featured.map((item) => (
                                          <div key={item.name} className="group relative text-base sm:text-sm">
                                            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden group-hover:opacity-75">
                                              <Image
                                                src={item.imageSrc}
                                                alt={item.imageAlt}
                                                className="object-center object-cover"
                                                height='50'
                                                width='50' />
                                            </div>
                                            <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                              <span className="absolute z-10 inset-0" aria-hidden="true" />
                                              {item.name}
                                            </a>
                                            <p aria-hidden="true" className="mt-1">
                                              Shop now
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                        {category.sections.map((section) => (
                                          <div key={section.name}>
                                            <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                              {section.name}
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby={`${section.name}-heading`}
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {section.items.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <a href={item.href} className="hover:text-gray-800">
                                                    {item.name}
                                                  </a>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ))}

                    {navigation.pages.map((page) => (
                      <a
                        key={page.name}
                        href={page.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {page.name}
                      </a>
                    ))}
                  </div>
                </Popover.Group>
{/* {beta button for sign ups - will not use} */}
                {/* <Transition
                  show={isModalOpen}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-15 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Dialog
                    onClose={() => setIsModalOpen(false)}
                    as="div"
                    className=" fixed inset-0 opacity-100 flex items-center justify-center overflow-y-auto bg-gray-100">

                    <div className="flex flex-col bg-gray-300 text-white w-96 py-8 px-4 text-center">
                      <Dialog.Overlay />
                      <Dialog.Title className="text-[#f08080] text-3xl">
                        Try the beta version of <em>Bundle</em>
                      </Dialog.Title>
                      <Dialog.Description className="text-xl m-2">
                        (it is free! We will send you an email with instructions.)
                      </Dialog.Description>
                      <form className="mt-2 flex-col sm:max-w-md">
                        <label className="text-gray-700 underline text-sm font-bold">
                          Full Name
                        </label>
                        <input
                          id="email-address"
                          type="text"
                          placeholder="Full Name"
                          required
                          value={betaName}
                          onChange={(e) => setBetaName(e.target.value)}
                          className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#f4978e] focus:ring-1 focus:ring-[#f4978e]" />
                        <label className="text-gray-700 underline text-sm font-bold">
                          Email address
                        </label>
                        <input
                          id="email-address"
                          type="email"
                          placeholder="Email address"
                          autoComplete="email"
                          required
                          value={betaEmail}
                          onChange={(e) => setBetaEmail(e.target.value)}
                          className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#f4978e] focus:ring-1 focus:ring-[#f4978e]" />
                        <label className="text-gray-700 underline text-sm font-bold">
                          How did you hear about Bundle?
                        </label>
                        <div className="mt-1">
                          <select
                            id="heardOf"
                            name="heardOf"
                            onChange={e => setBetaReferralSource(e.target.value)}
                            value={betaReferralSource}
                            autoComplete="country-name"
                            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          >
                            <option>Friend or family member</option>
                            <option>Google search</option>
                            <option>Advertisement</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            className="w-full bg-[#f8ad9d] hover:bg-[#f4978e] border border-transparent rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f08080]"
                            onClick={() => submitBetaInfo()} //need to submit email onSubmit without slowing down performance
                          >
                            Sign-up
                          </button>
                        </div>
                      </form>

                    </div>
                  </Dialog>
                </Transition> */}

                {/* Join beta pop up */}

                <div className="ml-auto flex items-center">
                  {/* <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
      <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
        Sign in
      </a>
      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
      <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
        Create account
      </a>
    </div> */}
                  {/* <button
                    type="button"
                    className="w-full bg-[#f8ad9d] hover:bg-[#f4978e] border border-transparent rounded-md shadow-sm py-2 px-4 flex items-center justify-center text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f08080]"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Try Beta Version (it is free)
                  </button> */}

                  <div className="hidden lg:ml-8 lg:flex ">
                    <a href="#" className="text-gray-700 hover:text-gray-800 flex items-center">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1600px-Flag_of_the_United_States.svg.png?20151118161041"
                        alt=""
                        className="w-5 h-auto block flex-shrink-0"
                        width='20'
                        height='15' />
                      <span className="ml-3 block text-sm font-medium">USA</span>
                      <span className="sr-only">, change currency</span>
                    </a>
                  </div>

                  {/* Search */}
                  <div className="flex lg:ml-6">
                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Search</span>
                      <SearchIcon className="w-6 h-6" aria-hidden="true" />
                    </a>
                  </div>

                  {/* Cart */}
                  {/* <div className="ml-4 flow-root lg:ml-6">
      <a href="#" className="group -m-2 p-2 flex items-center">
        <ShoppingBagIcon
          className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
        <span className="sr-only">items in cart, view bag</span>
      </a>
    </div> */}
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main>
          {/* Product */}
          <div className="bg-white">
            <div className="max-w-2xl mx-auto px-4 pt-10 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
              {/* Product details */}
              <div className="lg:max-w-lg mb-40 pb-40 lg:self-end">
                {/* <nav aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {product.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
          <li key={breadcrumb.id}>
            <div className="flex items-center text-sm">
              <a href={breadcrumb.href} className="font-medium text-gray-500 hover:text-gray-900">
                {breadcrumb.name}
              </a>
              {breadcrumbIdx !== product.breadcrumbs.length - 1 ? (
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  aria-hidden="true"
                  className="ml-2 flex-shrink-0 h-5 w-5 text-gray-300"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav> */}
                <div className="w-9/12 h-9/12 object-center object-cover mb-10 ml-14 mx-25">
                  <Image
                    src='https://upload.wikimedia.org/wikipedia/commons/5/59/Bundl_Books_Logo_%281%29.png'
                    alt={product.imageAlt}
                    //className=" object-center object-cover mb-10 ml-14 mx-25"
                    width='500'
                    height='500' />
                </div>

                <div className="mt-4">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                </div>

                <section aria-labelledby="information-heading" className="mt-4">
                  <h2 id="information-heading" className="sr-only">
                    TEST
                  </h2>

                  <div className="flex items-center">
                    <p className="text-lg text-gray-900 sm:text-xl">{product.price}</p>

                    <div className="ml-4 pl-4 border-l border-gray-300">
                      <h2 className="sr-only">Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                                'h-5 w-5 flex-shrink-0'
                              )}
                              aria-hidden="true" />
                          ))}
                        </div>
                        <p className="sr-only">{reviews.average} out of 5 stars</p>
                        <p className="ml-2 text-sm text-gray-500">{reviews.totalCount} review</p>
                      </div>
                    </div>
                  </div>


                  <div className="mt-4 space-y-6">
                    <p className="text-base text-gray-500">Bundl book: <em> noun; a thoughtful gift</em>; a physical book of heartfelt, prompt-driven letters and pictures from your recipient&apos;s friends and family meant to encourage, inspire, and remind the recipient of the love they have around them.  </p> 
                    {/* <b>Bundle book</b>,  <em>noun</em>: a physical book of written heartfelt messages of contragulations and support collected for an employee from <em>his or her</em> co-workers, given for a special occation */}
                  </div>
                  {/* <div className="mt-6 text-center">
                    <a href="#" className="group inline-flex text-base font-medium">
                      <ShieldCheckIcon
                        className="flex-shrink-0 mr-2 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true" />
                      <span className="text-gray-500 hover:text-gray-700">Tears of joy or your money back.</span>
                    </a>
                  </div> */}

                  {/* <div className="mt-6 flex items-center">
      <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
      <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
    </div> */}
                </section>
              </div>

              {/* Product image */}
{/* {uncomment this, and make stripe a non-test acconut to go live }  */}
              <div className="mt-10 pb-20 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-center">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">

         {/* Reviews section */}
         <Footer/>
               

                  {/* <HubspotContactForm/> */}

                </div>
              </div>

              {/* Product form */}
              <div className="mt-10 lg:max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
                <section aria-labelledby="options-heading">
                  <h2 id="options-heading" className="sr-only">
                    Product options
                  </h2>

                  <form>
                    <div className="sm:flex sm:justify-between">
                      {/* Size selector */}
                      {/* <RadioGroup value={selectedSize} onChange={setSelectedSize}>
      <RadioGroup.Label className="block text-sm font-medium text-gray-700">Book Size</RadioGroup.Label>
      <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {product.sizes.map((size) => (
          <RadioGroup.Option
            as="div"
            key={size.name}
            value={size}
            className={({ active }) =>
              classNames(
                active ? 'ring-2 ring-indigo-500' : '',
                'relative block border border-gray-300 rounded-lg p-4 cursor-pointer focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <RadioGroup.Label as="p" className="text-base font-medium text-gray-900">
                  {size.name}
                </RadioGroup.Label>
                <RadioGroup.Description as="p" className="mt-1 text-sm text-gray-500">
                  {size.description}
                </RadioGroup.Description>
                <div
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-indigo-500' : 'border-transparent',
                    'absolute -inset-px rounded-lg pointer-events-none'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup> */}
                    </div>
                    {/* <div className="mt-4">
      <a href="#" className="group inline-flex text-sm text-gray-500 hover:text-gray-700">
        <span>What size should I buy?</span>
        <QuestionMarkCircleIcon
          className="flex-shrink-0 ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      </a>
    </div> */}
                    {/* <div className="mt-10">
      <button
        type="submit"
        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
      >
        Add to bag
      </button>
    </div> */}

                  </form>
                </section>
              </div>
            </div>
          </div>

   

    <div className="max-w-2xl mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
            {/* Instructions section */}


            <Instructions/>
        

       {/* Picture section */}

        {/* add picture here that is large enough for it to be the only picture in this section and look good and have there be a h3 below it */}
      </div>

      <section aria-labelledby="reviews-heading" className="bg-white">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-12 flex flex-col items-center">
            {/* <h2 className="text-2xl font-bold text-center mt-4 mb-6">Gather love and support from family & friends ...</h2> */}
            <div className="flex justify-center">
              <div>
                <Image src="https://upload.wikimedia.org/wikipedia/commons/6/66/Bundlbook.jpg" className="" alt="Your image description" height="600" width="800" objectFit="cover" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mt-8">Create and gift a <em>lasting reminder</em> of the moments that matter <em>most</em> with ease.</h2>
          </div>
        </div>
      </section>
        </main>

        
        <div className="flex justify-center items-center h-screen"> {/* h-screen added to center vertically */}
        <div className="w-full sm:w-2/4 py-12 text-center"> {/* text-center added to center the button */}
          <a href="https://usebundl.com/signup">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 text-2xl rounded">
              Start Your Bundl (no credit card required)
            </button>
          </a>
        </div>
      </div>

   </div></>
  )
}