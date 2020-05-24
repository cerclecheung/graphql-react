import React from 'react';

import { Navbar } from './components';
import Routes from './routes';
const isLoggedIn = localStorage.getItem('apollo-token');
const App = () => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes
        isLoggedIn={isLoggedIn}
        className="flex justify-center self-center"
      />
    </div>
  );
};

export default App;
