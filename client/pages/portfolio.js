import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const readMessages = gql`
  query {
    messages {
      edges {
        user {
          username
        }
      }
    }
  }
`;

const Portfolio = () => {
  const { loading, error, data } = useQuery(readMessages);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.messages.edges.map((msg) => {
    return <div>{msg.user.username}</div>;
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
