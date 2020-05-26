import React, { useState, useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import history from '../history';
import { UserContext } from '../context';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    signIn(login: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP = gql`
  mutation SignUp(
    $username: String!
    $email: String!
    $password: String!
  ) {
    signUp(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [login, setLogin] = useState('true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mutationError, setMutationError] = useState('');

  const { setTokenInStorageAndState } = useContext(UserContext);

  //   In the useMutation React hook defined below, the first argument of the result tuple is the mutate function;
  const [loginMutation] = useMutation(LOGIN, {
    //   onCompleted takes in the gql result
    onCompleted({ signIn }) {
      setTokenInStorageAndState(signIn.token);
      history.push('/portfolio');
    },
    onError(error) {
      setMutationError(error.graphQLErrors[0].message);
    },
  });

  const [signUpMutation] = useMutation(SIGNUP, {
    //   onCompleted takes in the gql result
    onCompleted({ signUp }) {
      setTokenInStorageAndState(signUp.token);
      history.push('/portfolio');
    },
    onError(error) {
      setMutationError(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('apollo-token');
    if (login) {
      loginMutation({ variables: { email, password } });
    } else {
      signUpMutation({ variables: { username, email, password } });
    }
  };

  return (
    <div className="container flex justify-center">
      <div className="bg-gray-100 w-1/2 p-10 m-10">
        <h4 className="text-green-600 text-center text-4xl">
          {login ? 'Sign In' : 'Sign Up'}
        </h4>
        <form
          className="flex flex-col text-lg"
          onSubmit={handleSubmit}
          name={login ? 'SignIn' : 'SignUp'}
        >
          {!login && (
            <input
              className="m-2 p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            className="m-2 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder={
              login ? 'Your username or email' : 'Your email address'
            }
          />
          <input
            className="m-2 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Choose a safe password"
          />
          <button
            disabled={
              login
                ? !email || !password
                : !email || !password || !username
            }
            className="bg-green-600 rounded-lg p-2 text-gray-100 self-center m-2
            disabled:bg-gray-400"
          >
            {login ? 'login' : 'create account'}
          </button>
          <div
            type="submit"
            onClick={() => setLogin(!login)}
            className="text-gray-400"
          >
            {login
              ? 'Need to create an account? Sign up here'
              : 'Already have an account? Sign in here'}
          </div>

          {mutationError && <div>{mutationError}</div>}
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
