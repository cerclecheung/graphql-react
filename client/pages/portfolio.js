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
        color
      }
      user {
        balance
      }
      currentValue
    }
  }
`;

const Portfolio = () => {
  const { loading, error, data, refetch } = useQuery(LOAD_PORTFOLIO, {
    variables: { limit: 2 },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`${error}`}</p>;

  const { portfolio, user, currentValue } = data.portfolioPage;

  console.log('data,', data);
  return (
    <div className="container mx-auto">
      <div className="text-green-600 text-center text-4xl">{`PORTFOLIO ($${currentValue})`}</div>
      <div className="flex flex-row justify-around m-4 text-lg">
        <div className="bg-gray-200 p-10">
          {portfolio.length ? (
            portfolio.map((stock) => {
              return (
                <div
                  key={stock.symbol}
                  className="flex justify-between"
                >
                  <div className={`m-2 text-${stock.color}-500`}>
                    <span>{stock.symbol}</span>
                    <span> - </span>
                    <span>{`${stock.totalQuantity} shares `}</span>
                  </div>
                  <span className="m-2">{`$${stock.value}`}</span>
                </div>
              );
            })
          ) : (
            <div>You haven't bought any stock yet</div>
          )}
        </div>
        <Purchase
          userBalance={user.balance}
          refresh={() => refetch()}
        ></Purchase>
      </div>
    </div>
  );
};

export default Portfolio;
