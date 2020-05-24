import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './history';
import App from './app';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem('apollo-token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
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
