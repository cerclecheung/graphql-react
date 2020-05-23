import React from 'react';

import { Navbar } from './components';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes className="flex justify-center self-center" />
    </div>
  );
};

export default App;
