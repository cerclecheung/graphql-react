import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './history';
import App from './app';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

export const apolloToken = localStorage.getItem('apollo-token');

const client = new ApolloClient({
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: apolloToken ? `Bearer ${apolloToken}` : '',
      },
    });
  },
});
// establishes socket connection
// import './socket';
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={history}>
      <App className="bg-orange-100" />
    </Router>
  </ApolloProvider>,
  document.getElementById('app'),
);
