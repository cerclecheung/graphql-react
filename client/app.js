import React, { useContext } from 'react';
import { UserContext } from './context';
import { Navbar } from './components';
import Routes from './routes';
const App = () => {
  const { apolloToken } = useContext(UserContext);
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
