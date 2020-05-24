import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    signIn(login: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [login, setLogin] = useState('true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  //   In the useMutation React hook defined below, the first argument of the result tuple is the mutate function;
  const [loginMutation, { error, data }] = useMutation(LOGIN);
  console.log('error', error);

  const _confirm = () => {
    if (login) {
      loginMutation({ variables: { email, password } });
      console;
    }
  };

  const _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  console.log(email);
  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder={
            login ? 'Your username or email' : 'Your email address'
          }
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div
          className="pointer mr2 button"
          onClick={() => _confirm()}
        >
          {login ? 'login' : 'create account'}
        </div>
        <div
          className="pointer button"
          onClick={() => setLogin(!login)}
        >
          {login
            ? 'need to create an account?'
            : 'already have an account?'}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
