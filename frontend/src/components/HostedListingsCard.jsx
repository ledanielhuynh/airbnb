import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import beds from '../assets/beds.svg';
import bathroom from '../assets/bathroom.svg';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/trash.svg';
import x from '../assets/x.svg';

import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';

import { deleteDeleteListing, putUpdateListingAvails } from '../helpers/helpers';

const HostedListingsCard = ({ listing, refresh }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [availabilityDates, setAvailabilityDates] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);
  const [error, setError] = React.useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    refresh();
  };

  const addDateRange = async () => {
    if (!selectedStartDate) {
      setError('A valid start date is required in order to add availabilities to the listing');
      return
    }
    if (!selectedEndDate) {
      setError('A valid end date is required in order to add availabilities to the listing');
      return
    }
    if (selectedStartDate && selectedEndDate) {
      if (selectedStartDate < selectedEndDate) {
        let newDateRanges = dateRanges
        newDateRanges = [...newDateRanges, { start: selectedStartDate, end: selectedEndDate }];
        setDateRanges(newDateRanges);
        setSelectedStartDate('');
        setSelectedEndDate('');
        setError('');
        console.log(newDateRanges);
      } else {
        setError('Start date is after end date');
      }
    }
  };

  const removeDateRange = (indexToRemove) => {
    const updatedDateRanges = dateRanges.filter((_, index) => index !== indexToRemove);
    setDateRanges(updatedDateRanges);
    console.log(updatedDateRanges)
  };

  const deleteListing = async () => {
    const data = await deleteDeleteListing(listing.id);
    if (data.error) {
      console.log(data.error);
    } else {
      refresh();
    }
  };

  const addAvailability = () => {
    if (dateRanges.length === 0) {
      setError('No dates are currently added')
    } else {
      updateAvails();
      setError('');
    }
  };

  const isLive = () => {
    return (listing.availability.length > 0)
  }

  const updateAvails = async () => {
    const body = {
      availability: dateRanges,
    };
    console.log(body)
    try {
      const data = await putUpdateListingAvails(listing.id, body);
      if (data.error) {
        console.log(data.error);
      } else {
        closeModal();
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row border-2 border-black/10 p-4 gap-4 rounded-lg items-center'>
      <img
        src={listing.thumbnail}
        alt={`${listing.title} Thumbnail`}
        className='rounded-md object-cover w-full h-[18rem] mr-2'
      />
      <div className='flex flex-col w-full gap-4 grow justify-center'>
        <div className='flex flex-row justify-between gap-2'>
          <div className='flex flex-col'>
            <h2 className='text-xl font-bold'>{listing.title}</h2>
            <i>{listing.metadata.propertyType}</i>
          </div>
          <div className='flex flex-row gap-2'>
            <div className='flex flex-col w-[38px]'>
              <button
                className='rounded-md p-2 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300'
                onClick={() => deleteListing(listing.id)}>
                <img src={deleteIcon} alt='Delete Icon' />
              </button>
            </div>
            <div className='flex flex-col w-[38px]'>
                <button
                  className='rounded-md p-2 bg-[#FE375B] text-white border border-[#FE375B] hover:bg-[#D52E49] transition-all duration-300'
                  onClick={() => navigate(`/my-listings/${listing.id}`)}>
                  <img src={editIcon} alt='Edit Icon' />
                </button>
            </div>
          </div>
        </div>
        <p>Reviews: {listing.reviews.length}</p>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-row gap-2 border border-[#FE375B] text-[#FE375B] p-2 rounded-md whitespace-no-wrap'>
            <img src={beds} alt="Bed Logo" />
            <p>
              {listing.metadata.beds} {listing.metadata.beds === '1' ? 'Bed' : 'Beds'}
            </p>
          </div>
          <div className='flex flex-row gap-2 border border-[#FE375B] text-[#FE375B] p-2 rounded-md'>
            <img src={bathroom} alt="Bathroom Logo" />
            <p>
              {listing.metadata.bathrooms} {listing.metadata.bathrooms === '1' ? 'Bathroom' : 'Bathrooms'}
            </p>
          </div>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <b className='text-xl'>${listing.price}</b>
          <p className='text-black/75'> per night</p>
        </div>
        <button
          className={`rounded-md py-2 px-4 ${
            isLive() ? 'bg-white text-[#FE375B] border border-[#FE375B] pointer-events-none' : 'bg-[#FE375B] text-white border border-[#FE375B] hover:bg-[#D52E49]'
          } transition-all duration-300 font-bold text-sm md:text-base`}
          type='button'
          onClick={openModal}
        >
          {isLive() ? 'LIVE' : 'GO LIVE'}
        </button>
      </div>
      {isModalOpen && (
        <div className='fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm'>
          <div className='flex flex-col px-4 py-4 m-4 w-full max-w-[48rem] bg-white rounded-md gap-2 shadow-md animate-fade-in text-sm md:text-base'>
            <div className='flex flex-row'>
              <div className='flex flex-1'/>
              <div className='flex justify-items-center items-center'>
                <b className='text-center text-base md:text-lg'>Select Date(s)</b>
              </div>
              <div className='flex flex-1 justify-end'>
                <button
                  className='grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
                  onClick={closeModal}>
                  <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
                </button>
              </div>
            </div>
            <hr className="my-1" />
            <div className='grid grid-cols-2 gap-4'>
                <Input id='Start Date' type='date' setId={setSelectedStartDate} />
                <Input id='End Date' type='date' setId={setSelectedEndDate}/>
            </div>
            {error && <ErrorMessage message={error} />}
            <Button label="Add Date" onClick={addDateRange} />
            <hr className='my-1' />
            <div className='grid grid-cols-2 gap-4'>
              {dateRanges.map((dateRange, index) => (
                <div key={index} className='flex flex-row justify-between'>
                  <p className='flex flex-col'><b>Selected Date Range:</b> {dateRange.start} to {dateRange.end}</p>
                  <button
                  className='rounded-md p-2 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300'
                  onClick={() => removeDateRange(index)}>
                  <img src={deleteIcon} alt='Delete Icon' />
                </button>
                </div>
              ))}
            </div>
            <hr className='my-1' />
            <Button label="Confirm Dates" onClick={addAvailability} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HostedListingsCard;
