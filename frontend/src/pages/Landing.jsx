import React, { useState, useEffect, useRef } from 'react';
import LandingCard from '../components/LandingCard';
import search from '../assets/search.svg';
import { getAllListings, getListing } from '../helpers/helpers';

import '../helpers/responsive.css';

const Landing = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [locationInputValue, setLocationInputValue] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hiToLowReview, setHiToLowReview] = useState(false);
  const [lowToHiReview, setLowToHiReview] = useState(false);
  const [searchResults, setSearchResults] = useState('');
  const [dateInputType, setDateInputType] = useState('date');
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);
  const [isSearchBarFocused, setISearchBarFocused] = useState(false);
  const searchBarRef = useRef(null);

  const resetInputs = () => {
    setLocationInputValue('');
    setCheckInDate('');
    setCheckOutDate('');
    setDateInputType('text');
    setMinPrice('');
    setMaxPrice('');
    setHiToLowReview(false);
    setLowToHiReview(false);
  }

  const handleLocationOnFocus = () => {
    setCheckInDate('');
    setCheckOutDate('');
    setDateInputType('text');
    setMinPrice('');
    setMaxPrice('');
    setHiToLowReview(false);
    setLowToHiReview(false);
  }

  const handleAvailabilityOnFocus = () => {
    setLocationInputValue('');
    setDateInputType('date');
    setMinPrice('');
    setMaxPrice('');
    setHiToLowReview(false);
    setLowToHiReview(false);
  }

  const handlePriceOnFocus = () => {
    setLocationInputValue('');
    setCheckInDate('');
    setCheckOutDate('');
    setDateInputType('text');
    setHiToLowReview(false);
    setLowToHiReview(false);
  }

  const handleHiToLowReviewChange = () => {
    setLocationInputValue('');
    setCheckInDate('');
    setCheckOutDate('');
    setDateInputType('text');
    setMinPrice('');
    setMaxPrice('');
    if (!hiToLowReview) {
      setHiToLowReview(true);
      setLowToHiReview(false);
    } else {
      setHiToLowReview(false);
    }
  };

  const handleLowToHiReviewChange = () => {
    setLocationInputValue('');
    setCheckInDate('');
    setCheckOutDate('');
    setDateInputType('text');
    setMinPrice('');
    setMaxPrice('');
    if (!lowToHiReview) {
      setLowToHiReview(true);
      setHiToLowReview(false);
    } else {
      setLowToHiReview(false);
    }
  };

  useEffect(() => {
    const allListings = async () => {
      try {
        const data = await getAllListings();
        if (data.error) {
          console.error(data.error);
        } else {
          const allListingsWithData = await Promise.all(
            data.listings.map(async (listing) => {
              const listingData = await getListing(listing.id);
              const listingWithId = { ...listingData.listing, id: listing.id };
              return listingWithId;
            })
          );

          const sortedListings = allListingsWithData.sort((a, b) =>
            a.title.localeCompare(b.title)
          );

          setListings(sortedListings);
          setFilteredListings(sortedListings);
        }
      } catch (error) {
        console.log(error);
      }
    };

    allListings();
  }, []);

  const handleSearch = async () => {
    const filteredListings = listings.filter((listing) => {
      if (locationInputValue) {
        return (
          listing.title.toLowerCase().includes(locationInputValue.toLowerCase()) ||
          listing.address.city.toLowerCase().includes(locationInputValue.toLowerCase())
        )
      } else if (minPrice && maxPrice) {
        return listing.price >= minPrice && listing.price <= maxPrice;
      } else if (hiToLowReview) {
        return listing.reviews.slice().sort((a, b) => b.rating - a.rating);
      } else if (lowToHiReview) {
        return listing.reviews.slice().sort((a, b) => a.rating - b.rating);
      } else return listings;
    });
    setSearchResults(filteredListings.length)
    setFilteredListings(filteredListings);
    setSearchButtonPressed(true);
  };

  const handleSearchBarFocus = () => {
    setISearchBarFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setISearchBarFocused(false);
        setFilteredListings(listings);
        resetInputs();
        setSearchButtonPressed(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [listings]);

  return (
    <>
      <div className='flex flex-col items-center h-screen'>
        <div className='flex flex-col mt-[64px] md:mt-[92px] w-4/5 py-8 gap-2'>
          <div
            ref={searchBarRef}
            className={`flex flex-row w-full align-items-center justify-between self-center p-3 rounded-[2rem] 2xl:rounded-full border-2 border-black/10 bg-white ${isSearchBarFocused ? 'max-w-full hover:cursor-default' : 'max-w-xs hover:cursor-pointer'}`}
            onClick={handleSearchBarFocus}
          >
            <div className={`flex flex-col grow justify-center px-4 ${isSearchBarFocused ? 'hidden' : 'flex'}`}>
              <p className='text-black/50'>Search for your dream listing</p>
            </div>
            <div className={`flex-col 2xl:flex-row grow ${isSearchBarFocused ? 'flex' : 'hidden'}`}>
              <div className='flex flex-col grow justify-center px-4 2xl:border-r-2 w-full 2xl:w-2/5'>
                <p className='font-bold'>Place/Location</p>
                <input
                  type="text"
                  value={locationInputValue}
                  onChange={(e) => setLocationInputValue(e.target.value)}
                  onFocus={handleLocationOnFocus}
                  className='outline-none transition-all duration-500'
                  placeholder="Search for places/locations"
                />
              </div>
              <div className='flex flex-col grow justify-center px-4 2xl:border-r-2 w-full 2xl:w-1/5'>
                <p className='font-bold'>Availability</p>
                <div className='flex flex-col sm:flex-row sm:gap-2'>
                  <input
                    type={dateInputType}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    onFocus={handleAvailabilityOnFocus}
                    className='flex grow outline-none transition-all duration-500'
                    placeholder="Check-in date"
                  />
                  <input
                    type={dateInputType}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    onFocus={handleAvailabilityOnFocus}
                    className='flex grow outline-none transition-all duration-500'
                    placeholder="Check-out date"
                  />
                </div>
              </div>
              <div className='flex flex-col grow justify-center px-4 2xl:border-r-2 w-full 2xl:w-1/5'>
                <p className='font-bold'>Price Per Night ($)</p>
                <div className='flex flex-col sm:flex-row sm:gap-2'>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onFocus={handlePriceOnFocus}
                    className='w-1/2 outline-none transition-all duration-500'
                    placeholder="Min price"
                    pattern="[0-9]*"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onFocus={handlePriceOnFocus}
                    className='w-1/2 outline-none transition-all duration-500'
                    placeholder="Max price"
                  />
                </div>
              </div>
              <div className='flex flex-col justify-center px-4 w-full 2xl:w-1/5'>
                <p className='font-bold'>Review</p>
                <div className='flex flex-row gap-4'>
                  <div className='flex flex-row gap-2'>
                    <input
                      type="checkbox"
                      checked={hiToLowReview}
                      onChange={handleHiToLowReviewChange}
                      className='transition-all duration-500'
                    />
                    <p>Descending</p>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <input
                      type="checkbox"
                      checked={lowToHiReview}
                      onChange={handleLowToHiReviewChange}
                      className='transition-all duration-500'
                    />
                    <p>Ascending</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`flex rounded-full w-[50px] h-[50px] p-3 bg-[#FE375B] text-white border border-[#FE375B] transition-all duration-500 ${isSearchBarFocused ? 'hover:bg-[#D52E49]' : 'hover:none'}`}
              onClick={handleSearch}
            >
              <img src={search} alt="Search Icon" />
            </button>
          </div>
          </div>
        <div className={`w-4/5 pb-8 ${searchButtonPressed ? 'flex' : 'hidden'}`}>
          <p className='text-2xl font-bold'>Found {searchResults} {searchResults === 1 ? 'result' : 'results'}</p>
        </div>
        <div className="w-4/5 grid gap-6 landing-responsive">
          {filteredListings.map((listing) => (
            <LandingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Landing;
