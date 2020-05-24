import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const readMessages = gql`
  query($limit: Int) {
    messages(limit: $limit) {
      edges {
        user {
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const Portfolio = () => {
  const { loading, error, data } = useQuery(readMessages, {
    variables: { limit: 2 },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.messages.edges.map((msg) => {
    console.log(msg);
    return <div key={msg.id}>{msg.user.username}</div>;
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
