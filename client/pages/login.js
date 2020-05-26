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
      //   console.log('signIn:', signIn.token);
      setTokenInStorageAndState(signIn.token);
      history.push('/portfolio');
    },
    onError(error) {
      //   console.log('error: ', error);
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

  const _confirm = () => {
    localStorage.removeItem('apollo-token');
    if (login) {
      loginMutation({ variables: { email, password } });
    }
    signUpMutation({ variables: { username, email, password } });
  };

  const _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
  const inputStyle = 'm-2 p-2';

  return (
    <div className="container flex justify-center">
      <div className="bg-gray-100 w-1/2 p-10 m-10">
        <h4 className="text-green-600 text-center text-4xl">
          {login ? 'Sign In' : 'Sign Up'}
        </h4>
        <div className="flex flex-col text-lg">
          {!login && (
            <input
              className={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder={
              login ? 'Your username or email' : 'Your email address'
            }
          />
          <input
            className={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Choose a safe password"
          />
          <button
            className="pointer mr2 button"
            onClick={() => _confirm()}
          >
            {login ? 'login' : 'create account'}
          </button>
          <div
            className={inputStyle}
            onClick={() => setLogin(!login)}
          >
            {login
              ? 'need to create an account? Sign up here'
              : 'already have an account?'}
          </div>

          {mutationError && <div>{mutationError}</div>}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
