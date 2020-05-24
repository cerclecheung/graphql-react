import React from 'react';

import { Navbar } from './components';
import Routes from './routes';
import { apolloToken } from './index';
const App = () => {
  return (
    <div>
      <Navbar isLoggedIn={!!apolloToken} />
      <Routes
        isLoggedIn={!!apolloToken}
        className="flex justify-center self-center"
      />
    </div>
  );
};

export default App;
