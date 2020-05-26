import React, { useContext } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Portfolio, Login, Transactions, NotFound } from './pages';
import { UserContext } from './context';

const Routes = () => {
  const { apolloToken } = useContext(UserContext);
  return (
    <Switch>
      {apolloToken ? (
        <Switch>
          {/* Routes placed here are only available after logging in */}
          <Route exact path="/portfolio" component={Portfolio} />
          <Route
            exact
            path="/transactions"
            component={Transactions}
          />
          <Route component={NotFound} />
        </Switch>
      ) : (
        <Switch>
          <Route component={Login} />
        </Switch>
      )}
    </Switch>
  );
};
export default withRouter(Routes);
