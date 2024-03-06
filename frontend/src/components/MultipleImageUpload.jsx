import React from 'react';
import x from '../assets/x.svg';

const MultipleImageUpload = ({ onImageUpload }) => {
  const [images, setImages] = React.useState([]);

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(newImages).then((base64Data) => {
      setImages((prevImages) => [...prevImages, ...base64Data]);

      // Set the base64 data for the first image
      if (base64Data.length > 0) {
        onImageUpload(base64Data[0]);
      }
    });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // Remove base64 data if the removed image is the first one
    if (index === 0 && updatedImages.length > 0) {
      onImageUpload(updatedImages[0]);
    } else if (index === 0 && updatedImages.length === 0) {
      onImageUpload('');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div>
        {images.map((image, index) => (
          <div key={index} className="relative inline-block mr-2">
            <img
              src={image}
              alt={`uploaded-${index}`}
              className="w-24 h-24 object-cover rounded-md"
            />
            <button
              className='absolute top-1 right-1 grid rounded-md w-6 h-6 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] place-items-center transition-all duration-300'
              onClick={() => handleImageRemove(index)}>
              <img className='w-4/5 h-4/5' src={x} alt='Close Button' />
            </button>
          </div>
        ))}
      </div>

      <div className='flex grow-0'>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="hidden"
          id="imageInput"
        />
        <label
          htmlFor="imageInput"
          className="cursor-pointer rounded-md py-2 px-4 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300 font-bold text-sm"
        >
          Choose Images
        </label>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
