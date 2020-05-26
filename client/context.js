import React, { useState, useEffect, createContext } from 'react';
import history from './history';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export const UserContext = createContext();

const LOAD_TRANSACTIONS = gql`
  query {
    transactions {
      id
      symbol
      quantity
      price
    }
  }
`;

const LOAD_PORTFOLIO = gql`
  query($limit: Int) {
    portfolioPage(limit: $limit) {
      portfolio {
        symbol
        totalQuantity
        value
        color
      }
      user {
        balance
      }
      currentValue
    }
  }
`;

export const UserProvider = (props) => {
  const [apolloToken, setToken] = useState(
    localStorage.getItem('apollo-token'),
  );
  const loadTransactions = useQuery(LOAD_TRANSACTIONS, {
    fetchPolicy: 'network-only',
  });
  const loadPortfolio = useQuery(LOAD_PORTFOLIO, {
    fetchPolicy: 'network-only',
  });

  const setTokenInStorageAndState = (token) => {
    localStorage.setItem('apollo-token', token);
    setToken(token);
  };

  const handleLogOut = (e) => {
    setToken('');
    localStorage.removeItem('apollo-token');
    history.push('/login');
  };

  return (
    <UserContext.Provider
      value={{
        apolloToken,
        setTokenInStorageAndState,
        handleLogOut,
        loadTransactions,
        loadPortfolio,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
