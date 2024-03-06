import React from 'react';
import x from '../assets/x.svg';

const ImageUpload = ({ onImageUpload }) => {
  const [image, setImage] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64Data = reader.result;
        setImage(base64Data);

        // Call the onImageUpload with the base64 data
        onImageUpload(base64Data);
      };
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    // Call the onImageUpload with an empty string to indicate no image
    onImageUpload('');
  };

  return (
    <div className='flex flex-col gap-2'>
      <div>
        {image && (
          <div className="relative inline-block mr-2">
            <img
              src={image}
              alt={'uploaded-image'}
              className="w-24 h-24 object-cover rounded-md"
            />
            <button
              className='absolute top-1 right-1 grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
              onClick={handleImageRemove}
            >
              <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
            </button>
          </div>
        )}
      </div>

      <div className='flex grow-0'>
        <input
          type="file"
          onChange={handleImageChange}
          className="hidden"
          id="imageInput"
        />
        <label
          htmlFor="imageInput"
          className="cursor-pointer rounded-md py-2 px-4 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300 font-bold text-sm"
        >
          Choose Image
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
