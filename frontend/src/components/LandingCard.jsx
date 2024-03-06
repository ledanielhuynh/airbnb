import React from 'react';
import { useNavigate } from 'react-router-dom';

import map from '../assets/map-pin.svg';

const LandingCard = ({ listing }) => {
  const navigate = useNavigate();
  return (
    <div className='cursor-pointer min-w-[15rem] flex flex-col grow border-2 border-black/10 bg-white p-4 gap-4 rounded-lg hover:scale-105 hover:border-[#FE375B]/50 transition-all duration-300 text-sm md:text-base' onClick={() => navigate(`/${listing.id}`)}>
      <img
        src={listing.thumbnail}
        alt={`${listing.title} Thumbnail`}
        className='rounded-md object-cover w-full h-[14rem]'
      />
      <div className='flex flex-col grow justify-center gap-2'>
        <h2 className='text-xl md:text-lg font-bold'>{listing.title}</h2>
        <div className='flex flex-row gap-1 items-center'>
          <img src={map} alt="Map Pin Logo" className='h-[1rem]'/>
          <p>{listing.address.city}, {listing.address.country}</p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <p>${listing.price} per night</p>
          <p>${listing.price} per night</p>
        </div>
      </div>
    </div>
  );
};

export default LandingCard;
