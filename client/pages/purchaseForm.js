import React, { useState, useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import history from '../history';
import { UserContext } from '../context';

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

const Purchase = ({ userBalance }) => {
  const { loadTransactions, loadPortfolio } = useContext(UserContext);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [mutationError, setMutationError] = useState('');

  //   In the useMutation React hook defined below, the first argument of the result tuple is the mutate function;
  const [createMutation] = useMutation(CREATE_TRANSACTION, {
    //   onCompleted takes in the gql result
    onCompleted({ createTransaction }) {
      setMutationError('');
      loadPortfolio.refetch();
      loadTransactions.refetch();
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

  const inputStyle = 'border-solid border-4 border-gray-600 my-3 p-1';

  return (
    <div className="bg-gray-200 p-10">
      <form name="purchase" className="flex flex-col">
        <h4 className="text-xl">{`Cash - $${userBalance}`}</h4>
        <input
          className={inputStyle}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          type="text"
          placeholder="Ticker"
        />
        <input
          className={inputStyle}
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
        <button
          className="my-3"
          disabled={!quantity || symbol === ''}
          className="pointer mr2 button"
          onClick={handleSubmit}
        >
          Buy
        </button>
        {/* rember to control the ticker and quantity input and disable button */}
      </form>
      {mutationError && <div className="my-3">{mutationError}</div>}
    </div>
  );
};

export default withRouter(Purchase);
