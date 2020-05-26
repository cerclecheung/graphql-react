import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { UserContext } from '../context';

// const readTransactions = gql`
//   query {
//     transactions {
//       id
//       symbol
//       quantity
//       price
//     }
//   }
// `;

const Transaction = () => {
  const { loadTransactions, setTransactions } = useContext(
    UserContext,
  );
  const { loading, error, data, refetch } = loadTransactions;
  // const { loading, error, data, refetch } = useQuery(
  // readTransactions,
  // );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  setTransactions(data.transactions);
  return (
    <div className="container mx-auto">
      <div className="text-green-600 text-center text-4xl">
        TRANSACTION
      </div>
      <div className="flex flex-row justify-around m-4 text-lg">
        {data.transactions.length ? (
          <div>
            {data.transactions.map((t) => (
              <div
                key={t.id}
                className={`bg-${
                  t.id % 2 ? 'green-100' : 'white'
                } px-20 py-2 flex justify-between`}
              >
                <span>{`Buy (${t.symbol})`}</span>
                <span>{`  ${t.quantity} shares`}</span>
                <span>{`  @$${t.price}`}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>No transaction record</div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
