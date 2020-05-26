import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Purchase from './purchaseForm';
import history from '../history';
const LOAD_PORTFOLIO = gql`
  query($limit: Int) {
    portfolioPage(limit: $limit) {
      portfolio {
        symbol
        totalQuantity
        value
      }
      user {
        balance
      }
    }
  }
`;

const Portfolio = () => {
  const { loading, error, data, refetch } = useQuery(LOAD_PORTFOLIO, {
    variables: { limit: 2 },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`${error}`}</p>;

  const { portfolio, user } = data.portfolioPage;

  console.log('data,', data);
  return (
    <div>
      <div>PORTFOLIO</div>
      {portfolio.length ? (
        portfolio.map((stock) => {
          return (
            <div key={stock.symbol}>
              <span>{stock.symbol}</span>
              <span> - </span>
              <span>{`${stock.totalQuantity} shares `}</span>
              <span>{`$${stock.value}`}</span>
            </div>
          );
        })
      ) : (
        <div>You haven't bought any stock yet</div>
      )}
      <Purchase
        userBalance={user.balance}
        refresh={() => refetch()}
      ></Purchase>
    </div>
  );
};

export default Portfolio;
