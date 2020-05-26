This project is built on React, ApolloClient, ApolloServer and Express, PostgresQL, SequelizeORM and deployed on Heroku.

I chose GraphQL over REST to take advantage of this opportunity to learn GraphQL. 

Some implementation design choices:

1. There are two models: user and transaction. 

2. User authentication (sign up, sign in) is implemented using a GraphQL mutation with a JSON web token. When auth is successful, the server sends a token which is used in the header in subsequent client requests. When the token expires, the client will be logged out and need to reauthenticate.

3. Both the transactions and portfolio view use GraphQL query to fetch data. For the sake of efficiency, the loadPortfolio query runs an aggregation function on the transaction model to get the summary of each ticker. Then I convert the ticker names to a string to send only one request to IEX to fetch all the quote information and calculate the lastest values and corresponding color. 

4. For the purchase function, I validate input on both the frontend and backend. In the front end, I convert the ticker to upper case and disable submission when either the ticker field or the quantity field is empty. In the backend, the resolver for the GraphQl mutation createTransaction first validates the ticker symbol by sending the ticker to IEX, if it succeeds, it will check the user balance sufficiency before it finalized the transaction.

5. One design choice I made was to consolidate the frontend state in a top-level React context. This allows the purchase form to have access to a refetch function which can update state across both the portfolio and transaction components. This means that when a new transaction is made, the portfolio and transaction pages are updated without the user having to refresh the browser.


