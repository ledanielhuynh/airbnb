import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import WhiteButton from '../components/WhiteButton';
import airbnbLogo from '../assets/airbnb-logo.jpg';
import houseLogo from '../assets/house.svg';

import { postLogoutUser } from '../helpers/helpers';
import { useContext, Context } from '../helpers/context';

const Navbar = () => {
  function isLoggedIn () {
    return localStorage.getItem('token') !== null;
  }
  const { setters } = useContext(Context);
  const navigate = useNavigate();

  const logout = async () => {
    const response = await postLogoutUser();
    if (response.status === 200) {
      localStorage.removeItem('token');
      setters.setUserEmail(null);
      navigate('/');
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 border-2 border-b-black/10 bg-white z-40 grid place-items-center'>
      <div className="flex flex-row justify-between items-center text-sm md:py-6 w-[95%] py-3">
        <Link to="/">
          <img className="w-24" src={airbnbLogo} alt="Airbnb Logo" />
        </Link>
        <div className="flex flex-row gap-4 items-center">
          {isLoggedIn()
            ? (
            <>
              <div className='flex flex-col w-[38px]'>
                <button
                  className='rounded-md p-2 bg-white text-[#FE375B] border border-[#FE375B] hover:bg-[#ffe1e6] transition-all duration-300'
                  onClick={() => navigate('/my-listings')}>
                  <img src={houseLogo} alt='Hosted Bookings Logo' />
                </button>
              </div>
              <div className='flex flex-col w-24'>
                <Button label="Logout" onClick={logout} />
              </div>
            </>
              )
            : (
            <>
              <div className='flex flex-col w-24'>
                <WhiteButton label="Register" onClick={() => navigate('/register')} />
              </div>
              <div className='flex flex-col w-24'>
                <Button label="Login" onClick={() => navigate('/login')} />
              </div>
            </>
              )}
        </div>
    </div>
    </div>
  );
}

export default Navbar;
