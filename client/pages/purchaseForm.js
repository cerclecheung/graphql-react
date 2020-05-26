import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import history from '../history';

const CREATE_TRANSACTION = gql`
  mutation Purchase($symbol: String!, $quantity: Int!) {
    createTransaction(symbol: $symbol, quantity: $quantity) {
      symbol
      user {
        balance
      }
    }
  }
`;

const Purchase = ({ userBalance, refresh }) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [mutationError, setMutationError] = useState('');

  //   In the useMutation React hook defined below, the first argument of the result tuple is the mutate function;
  const [createMutation] = useMutation(CREATE_TRANSACTION, {
    //   onCompleted takes in the gql result
    onCompleted({ createTransaction }) {
      setMutationError('');
      refresh();
    },
    onError(error) {
      console.error();
      setMutationError(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation({ variables: { symbol, quantity } });
  };

  return (
    <div>
      <h4>{`Cash - $${userBalance}`}</h4>
      <form name="purchase">
        <div className="">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            type="text"
            placeholder="Ticker"
          />
          <input
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              return val
                ? setQuantity(parseInt(val))
                : setQuantity(val);
            }}
            type="number"
            min="0"
            placeholder="Number of shares"
          />
        </div>
        {/* rember to control the ticker and quantity input and disable button */}
        <button
          disabled={!quantity || symbol === ''}
          className="pointer mr2 button"
          onClick={handleSubmit}
        >
          Buy
        </button>
      </form>
      {mutationError && <div>{mutationError}</div>}
    </div>
  );
};

export default withRouter(Purchase);
