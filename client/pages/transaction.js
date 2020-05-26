import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const readTransactions = gql`
  query {
    transactions {
      id
      symbol
      quantity
      price
    }
  }
`;

const Transaction = () => {
  const { loading, error, data, refetch } = useQuery(
    readTransactions,
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <div>TRANSACTION</div>
      {data.transactions.length ? (
        <div>
          {data.transactions.map((t) => (
            <div key={t.id}>
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
  );
};

export default Transaction;
