import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';

import { getListing, putUpdateListing } from '../helpers/helpers';

const EditListing = () => {
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [beds, setBeds] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [amenities, setAmenities] = useState('');
  const [images, setImages] = useState([]);
  const [listingInfo, setListingInfo] = useState(null);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

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
        console.log(error);
      }
    };

    fetchListingInfo();
  }, [id]);

  useEffect(() => {
    if (listingInfo) {
      setTitle(listingInfo.title);
      setStreet(listingInfo.address.street);
      setCity(listingInfo.address.city);
      setState(listingInfo.address.state);
      setPostcode(listingInfo.address.postcode);
      setCountry(listingInfo.address.country);
      setPrice(listingInfo.price);
      setThumbnail(listingInfo.thumbnail);
      setPropertyType(listingInfo.metadata.propertyType);
      setBeds(listingInfo.metadata.beds);
      setBedrooms(listingInfo.metadata.bedrooms);
      setBathrooms(listingInfo.metadata.bathrooms);
      setAmenities(listingInfo.metadata.amenities);
      setImages(listingInfo.metadata.images || []);
    }
  }, [listingInfo]);

  const handleUpdateListing = async () => {
    const body = {
      title,
      address: {
        street,
        city,
        state,
        postcode,
        country,
      },
      thumbnail,
      price,
      metadata: {
        propertyType,
        bathrooms,
        beds,
        bedrooms,
        amenities,
        images,
      },
    };

    try {
      const data = await putUpdateListing(id, body);
      if (data.error) {
        setError(data.error);
      } else {
        navigate('/my-listings/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col mt-[88px] px-20 py-8 gap-2'>
      <b className='text-3xl pb-6'>Edit Listing</b>
      <div className='grid grid-cols-2 gap-4'>
        <Input id='Title' type='text' setId={setTitle} value={title}/>
        <Input id='Street' type='text' setId={setStreet} value={street}/>
        <Input id='Property Type' type='text' setId={setPropertyType} value={propertyType}/>
        <Input id='City' type='text' setId={setCity} value={city}/>
        <Input id='Price' type='text' setId={setPrice} value={price}/>
        <Input id='State' type='text' setId={setState} value={state}/>
        <Input id='Amenities' type='text' setId={setAmenities} value={amenities}/>
        <Input id='Postcode' type='text' setId={setPostcode} value={postcode}/>
        <Input id='Bathroom(s)' type='text' setId={setBathrooms} value={bathrooms}/>
        <Input id='Country' type='text' setId={setCountry} value={country}/>
        <Input id='Bed(s)' type='text' setId={setBeds} value={beds}/>
        <Input id='Bedroom(s)' type='text' setId={setBedrooms} value={bedrooms}/>
      </div>
      <div className='flex flex-col pt-1'>
        <p>
          Thumbnail <span className="text-red-500">*</span>
        </p>
        <ImageUpload onImageUpload={setThumbnail} />
      </div>
      <hr className='my-1' />
      {error && (
        <div className='bg-red-100 px-4 py-2 text-sm rounded-md'>
          <p className='text-red-500'>{error}</p>
        </div>
      )}
      <Button label='SAVE' onClick={handleUpdateListing} />
    </div>
  );
};

export default EditListing;
