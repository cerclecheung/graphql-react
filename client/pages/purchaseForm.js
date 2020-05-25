import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import history from '../history';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    signIn(login: $email, password: $password) {
      token
    }
  }
`;

const Purchase = ({ balance }) => {
  const [userBalance, setUserBalance] = useState(balance);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [mutationError, setMutationError] = useState('');

  //   In the useMutation React hook defined below, the first argument of the result tuple is the mutate function;
  const [loginMutation] = useMutation(LOGIN, {
    //   onCompleted takes in the gql result
    onCompleted({ signIn }) {
      localStorage.setItem('apollo-token', signIn.token);
      setMutationError('');
      history.push('/portfolio');
    },
    onError(error) {
      setMutationError(error.graphQLErrors[0].message);
    },
  });

  const _confirm = () => {
    localStorage.removeItem('apollo-token');
    if (login) {
      loginMutation({ variables: { email, password } });
    }
    signUpMutation({ variables: { username, email, password } });
  };

  const _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  return (
    <div>
      <h4>{`Cash - $${userBalance}`}</h4>
      <div className="">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          type="text"
          placeholder="Ticker"
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          min="0"
          placeholder="Number of shares"
        />
      </div>
      <div className="">
        {/* rember to control the ticker and quantity input and disable button */}
        <div
          className="pointer mr2 button"
          onClick={() => _confirm()}
        >
          Buy
        </div>
      </div>
      {mutationError && <div>{mutationError}</div>}
    </div>
  );
};

export default withRouter(Purchase);
