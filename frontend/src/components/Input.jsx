import React from 'react';

const Input = ({ id, type, setId, value }) => {
  return (
    <div className='flex flex-col gap-2'>
      <p>
        {id} <span className="text-red-500">*</span>
      </p>
      <div className='flex flex-col'>
        <input
          className='rounded-sm border border-black/25 px-2 py-1 text-base md:text-lg'
          id={id}
          type={type}
          onChange={e => setId(e.target.value)}
          value={value}
          maxLength='35'
        />
      </div>
    </div>
  );
};

export default Input;
