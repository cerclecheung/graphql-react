import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './history';
import App from './app';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { UserProvider } from './context';

const apolloToken = () => localStorage.getItem('apollo-token');

const client = new ApolloClient({
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: apolloToken() ? `Bearer ${apolloToken()}` : '',
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    console.log('grah', graphQLErrors);
    console.log('network', networkError);
    if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
      localStorage.removeItem('apollo-token');
      history.push('/login');
    }
  },
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <UserProvider>
      <Router history={history}>
        <App className="bg-orange-100" />
      </Router>
    </UserProvider>
  </ApolloProvider>,

  document.getElementById('app'),
);
