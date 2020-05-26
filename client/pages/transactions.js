import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context';

const Transactions = () => {
  const { loadTransactions } = useContext(UserContext);
  const { loading, error, data, refetch } = loadTransactions;
  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className="container mx-auto">
      <div className="text-green-600 text-center text-4xl">
        TRANSACTIONS
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

export default Transactions;
