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
    console.log(graphQLErrors, networkError);
    // if (graphQLErrors) {
    //   for (let err of graphQLErrors) {
    //     // handle errors differently based on its error code
    //     switch (err.extensions.code) {
    //       case 'UNAUTHENTICATED':
    //         // old token has expired throwing AuthenticationError,
    //         // one way to handle is to obtain a new token and
    //         // add it to the operation context
    //         const headers = operation.getContext().headers;
    //         operation.setContext({
    //           headers: {
    //             ...headers,
    //             authorization: getNewToken(),
    //           },
    //         });
    //         // Now, pass the modified operation to the next link
    //         // in the chain. This effectively intercepts the old
    //         // failed request, and retries it with a new token
    //         return forward(operation);
    //     }
    //   }
    // }
    if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
      localStorage.removeItem('apollo-token');
      history.push('/login');
    }
  },
});
ReactDOM.render(
  <UserProvider>
    <ApolloProvider client={client}>
      <Router history={history}>
        <App className="bg-orange-100" />
      </Router>
    </ApolloProvider>
  </UserProvider>,

  document.getElementById('app'),
);
