import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 px-4 py-2 text-sm md:text-base rounded-md">
      <p className="text-red-500">{message}</p>
    </div>
  );
};

export default ErrorMessage;
