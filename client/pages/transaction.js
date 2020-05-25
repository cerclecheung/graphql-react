import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const readTransactions = gql`
  query($limit: Int) {
    transactions(limit: $limit) {
      edges {
        id
        symbol
        quantity
        price
      }
      transactionPageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const Transaction = () => {
  const { loading, error, data } = useQuery(readTransactions, {
    variables: { limit: 10 },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.transactions.edges.length ? (
    <div>
      {data.transactions.edges.map((t) => (
        <div key={t.id}>
          <span>{`Buy (${t.symbol})`}</span>
          <span>{`  ${t.quantity} shares`}</span>
          <span>{`  @$${t.price}`}</span>
        </div>
      ))}
    </div>
  ) : (
    <div>No transaction record</div>
  );
};

export default Transaction;
