import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import HostedListings from './pages/HostedListings';
import EditListing from './pages/EditListing';
import ListingPage from './pages/ListingPage';

import { Context, initialValue } from './helpers/context';

function App () {
  const [userEmail, setUserEmail] = React.useState(initialValue.userEmail);
  const getters = {
    userEmail,
  };
  const setters = {
    setUserEmail,
  };

  if (localStorage.getItem('dark-mode') === 'true' || (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.querySelector('html').classList.add('dark');
  } else {
    document.querySelector('html').classList.remove('dark');
  }

  return (
    <div className="font-nunito">
      <BrowserRouter>
        <Context.Provider value={{ getters, setters }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-listings" element={<HostedListings />} />
            <Route path="/my-listings/:id" element={<EditListing />} />
            <Route path="/:id" element={<ListingPage />} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
