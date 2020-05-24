import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const readMessages = gql`
  query($limit: Int) {
    portfolio(limit: $limit) {
      symbol
      totalQuantity
      value
    }
  }
`;

const Portfolio = () => {
  const { loading, error, data } = useQuery(readMessages, {
    variables: { limit: 2 },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.portfolio.map((stock) => {
    return (
      <div key={stock.symbol}>
        <span>{stock.symbol}</span>
        <span> - </span>
        <span>{`${stock.totalQuantity} shares `}</span>
        <span>{`$${stock.value}`}</span>
      </div>
    );
  });
};

// class Portfolio extends React.Component {
//   constructor() {
//     super();
//   }

//   componentDidMount() {
//     client
//       .query(readMessages)
//       .then((messages) => console.log(messages));
//   }
//   render() {
//     return <div>apollo</div>;
//   }
// }
export default Portfolio;
