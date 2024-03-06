import React from 'react';

const Button = ({ label, onClick }) => {
  const buttonStyle = {
    whiteSpace: 'nowrap',
  };

  return (
    <button
      style={buttonStyle}
      className='rounded-md py-2 px-4 bg-[#FE375B] text-white border border-[#FE375B] hover:bg-[#D52E49] transition-all duration-300 font-bold text-sm md:text-base'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
