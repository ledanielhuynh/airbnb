import React from 'react';

const WhiteButton = ({ label, onClick }) => {
  return (
    <button
      className='rounded-md py-2 px-4 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300 font-bold text-sm'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default WhiteButton;
