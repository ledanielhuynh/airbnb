import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';

import house from '../assets/house.svg';
import x from '../assets/x.svg';

import { getListing, postNewBooking, getAllBookings, putNewListingReview } from '../helpers/helpers';
import { useContext, Context } from '../helpers/context';

const ListingPage = () => {
  const [listingInfo, setListingInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIfLoggedOpen, setIsIfLoggedOpen] = useState(false);
  const [reservedStartDate, setReservedStartDate] = useState(null);
  const [reservedEndDate, setReservedEndDate] = useState(null);
  const [isConfirmationScreenOpen, setIsConfirmationScreenOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [reviewComment, setReviewComment] = useState('');
  const [ifBookingAccepted, setIfBookingAccepted] = useState(false);
  const [acceptedBookingId, setAcceptedBookingId] = useState(null);
  const { getters } = useContext(Context);
  // console.log(listingInfo);
  const { id } = useParams();
  // const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const token = localStorage.getItem('token');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openConfirmationScreen = () => {
    setIsConfirmationScreenOpen(true);
  };

  const closeConfirmationScreen = () => {
    setIsConfirmationScreenOpen(false);
  };

  const openCreateReview = () => {
    setRating(1);
    setIsCreateReviewOpen(true);
  };

  const closeCreateReview = () => {
    setError('')
    setIsCreateReviewOpen(false);
  };

  const openIfLogged = () => {
    setIsIfLoggedOpen(true);
  };

  const closeIfLogged = () => {
    setIsIfLoggedOpen(false);
  };

  useEffect(() => {
    const fetchListingInfo = async () => {
      try {
        const data = await getListing(id);
        if (data.error) {
          console.log(data.error);
        } else {
          setListingInfo(data.listing);
        }
      } catch (error) {
        console.error('Error fetching listing information:', error);
      }
    };

    fetchListingInfo();

    const allBookings = async () => {
      try {
        const data = await getAllBookings();
        if (data.error) {
          console.error(data.error);
        } else {
          const userOwnedBookings = data.bookings.filter(booking => booking.owner === getters.userEmail);
          setBookings(userOwnedBookings);
        }
      } catch (error) {
        console.log(error);
      }
    };

    allBookings();
  }, [id]);

  if (!listingInfo) {
    return <div>Error: Couldnt Find the page you were looking for</div>
  }

  const reserveDate = async () => {
    console.log('going through');
    if (token === null) {
      openIfLogged();
    } else {
      openModal();
    }
  };

  const addReview = async () => {
    if (reviewComment === '') {
      setError('A comment is required in order to make a review to the listing')
      return
    }
    if (reviewComment === null) {
      setError('A comment is required in order to make a review to the listing')
      return
    }
    if (token === null) {
      setError('Please log in before adding a review to this listing')
    } else {
      const newReview = { comment: reviewComment, rating };
      const body = {
        review: newReview,
      };
      console.log(body)
      checkIfBookingAccepted();
      if (ifBookingAccepted) {
        putNewListingReview(id, acceptedBookingId, body)
        setError('')
        setReviewComment('');
        setRating(1)
        closeCreateReview();
      } else {
        setError('No reservations have been accepted yet')
      }
    }
  }

  const checkIfBookingAccepted = () => {
    bookings.forEach((booking) => {
      if (booking.listingId === id && booking.status === 'accepted') {
        setIfBookingAccepted(true)
        setAcceptedBookingId(booking.id)
      }
    })
  }

  const addReservation = () => {
    if (!reservedStartDate) {
      setError('A valid start date is required in order to make a booking');
      return
    }
    if (!reservedEndDate) {
      setError('A valid end date is required in order to make a booking');
      return
    }
    if (reservedStartDate && reservedEndDate) {
      if (reservedStartDate < reservedEndDate) {
        const range = { start: reservedStartDate, end: reservedEndDate }
        const start = new Date(reservedStartDate)
        const end = new Date(reservedEndDate)
        const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        const price = nights * listingInfo.price;
        console.log(price)

        postBooking(range, price);
      } else {
        setError('Start date is after end date');
      }
    }
  };

  const postBooking = async (range, price) => {
    const body = {
      dateRange: range,
      totalPrice: price,
    };
    console.log(body)
    try {
      const data = await postNewBooking(id, body);
      if (data.error) {
        setError(data.error)
        console.log(data.error);
      } else {
        setError('');
        closeModal();
        openConfirmationScreen();
      }
    } catch (error) {
      console.error('Error Booking:', error);
    }
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className='flex flex-col items-center text-sm md:text-base'>
      <div className='flex flex-col mt-[64px] md:mt-[92px] w-4/5 lg:w-1/2 py-8 gap-4 md:gap-8'>
        <p className='text-lg md:text-xl font-bold'>{listingInfo.title}</p>
        <div className="w-full rounded-md overflow-hidden">
          <img
            src={listingInfo.thumbnail}
            alt={`Listing ${id} Thumbnail`}
            className='object-cover w-full h-[20rem]'
          />
        </div>
        <div className='flex flex-row gap-4 md:gap-8'>
          <div className='flex flex-col w-3/5 gap-4 md:gap-8'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row gap-2 items-center'>
                <img src={house} alt="House Logo" />
                <p className='text-lg md:text-xl font-bold'>{listingInfo.metadata.propertyType} in {listingInfo.address.city}, {listingInfo.address.country}</p>
              </div>
              <p>{ listingInfo.metadata.bedrooms } bedrooms · { listingInfo.metadata.beds } beds · { listingInfo.metadata.bathrooms } Bathrooms</p>
              <p>Owned by { listingInfo.owner }</p>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='grid grid-cols-2 justify-items-center w-full gap-4 p-4 border rounded-md border-[#FE375B]/50'>
                <p><b className='text-lg md:text-xl'>5</b> ({ listingInfo.reviews.length })</p>
                <p><b className='text-lg md:text-xl'>{ listingInfo.reviews.length }</b> reviews</p>
              </div>
              <Button label="Write a Review" onClick={openCreateReview} />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-lg md:text-xl font-bold'>Amenities</p>
              <p>{ listingInfo.metadata.amenities }</p>
            </div>
          </div>
          <div className='flex flex-col grow gap-4'>
            <div className='flex flex-col w-full gap-4 p-4 border rounded-md shadow-md '>
              <div className='flex flex-row flex-wrap items-center'>
                <b className='text-lg md:text-xl pr-2'>${listingInfo.price}</b>
                <p className='text-black/75'>per night</p>
              </div>
              <Button label='Reserve' onClick={reserveDate} />
            </div>
            <div className='flex flex-col gap-2'>
              {bookings.map((booking, index) => (
                <div key={index} className='flex flex-row justify-between'>
                  { booking.listingId === id
                    ? (<><p className='flex flex-col'><b>Booking:</b> {booking.dateRange.start} to {booking.dateRange.end}</p><p className='flex flex-col'><b>Status:</b> {booking.status}</p></>)
                    : ('') }
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <p>Availability: { listingInfo.availability[0].start }</p>
        <p>Availability: { listingInfo.availability[0].end }</p> */}
        {isModalOpen && (
          <div className='fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm'>
            <div className='flex flex-col px-6 py-4 w-[56rem] bg-white rounded-md gap-2 shadow-md animate-fade-in text-sm'>
              <div className='flex flex-row'>
                <div className='flex flex-1'/>
                <div className='flex justify-items-center items-center'>
                  <b className='text-center text-base'>Select Reservation Dates</b>
                </div>
                <div className='flex flex-1 justify-end'>
                  <button
                    className='grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
                    onClick={closeModal}>
                    <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
                  </button>
                </div>
              </div>
              <hr/>
              <div className='grid grid-cols-2 gap-4'>
                  <Input id='Start Date' type='date' setId={setReservedStartDate} />
                  <Input id='End Date' type='date' setId={setReservedEndDate}/>
              </div>
              {error && <ErrorMessage message={error} />}
              <hr className='my-1' />
              <Button label="Add Reservation" onClick={addReservation} />
            </div>
          </div>
        )}
        {isIfLoggedOpen && (
          <div className='fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm'>
            <div className='flex flex-col px-6 py-4 w-[56rem] bg-white rounded-md gap-2 shadow-md animate-fade-in text-sm'>
              <div className='flex flex-row'>
                <div className='flex flex-1'/>
                <div className='flex justify-items-center items-center'>
                  <b className='text-center text-base'>Please Log-in before reserving</b>
                </div>
                <div className='flex flex-1 justify-end'>
                </div>
              </div>
              <Button label="Close" onClick={closeIfLogged} />
            </div>
          </div>
        )}
        {isConfirmationScreenOpen && (
          <div className='fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm'>
            <div className='flex flex-col px-6 py-4 w-[56rem] bg-white rounded-md gap-2 shadow-md animate-fade-in text-sm'>
              <div className='flex flex-row'>
                <div className='flex flex-1'/>
                <div className='flex justify-items-center items-center'>
                  <b className='text-center text-base'>Booking Complete</b>
                </div>
                <div className='flex flex-1 justify-end'>
                  <button
                    className='grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
                    onClick={closeConfirmationScreen}>
                    <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
                  </button>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <p>Booking is now accepted, and is currently under review</p>
              </div>
              <Button label="Close" onClick={closeConfirmationScreen} />
            </div>
          </div>
        )}
        {isCreateReviewOpen && (
          <div className='fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm'>
            <div className='flex flex-col px-6 py-4 w-[56rem] bg-white rounded-md gap-2 shadow-md animate-fade-in text-sm'>
              <div className='flex flex-row'>
                <div className='flex flex-1'/>
                <div className='flex justify-items-center items-center'>
                  <b className='text-center text-base'>Write a Review</b>
                </div>
                <div className='flex flex-1 justify-end'>
                  <button
                    className='grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
                    onClick={closeCreateReview}>
                    <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
                  </button>
                </div>
              </div>
              <hr/>
              <div className='grid grid-cols-1 gap-4'>
                  <Input id='Comment' type='text' setId={setReviewComment} />
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <span
                        key={index}
                        className={`text-3xl cursor-pointer ${
                          index <= rating ? 'text-[#FE375B]' : 'text-gray-300'
                        }`}
                        onClick={() => handleStarClick(index)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
              </div>
              {error && <ErrorMessage message={error} />}
              <hr className='my-1' />
              <Button label="Publish Review" onClick={addReview} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPage;
