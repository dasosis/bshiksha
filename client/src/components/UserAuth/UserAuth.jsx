import { useEffect, useState } from 'react';
import { useStore } from '../../dataStore';

import { signUpUser_block, isEmailAlreadyInUse } from '../../scripts/block';

import './UserAuth.scss';

const UserAuth = () => {
  const [signupState, setSignupState] = useState(0);
  const [loginInitiated, setLoginInitiated] = useState(false);
  const currentAccount = useStore((state) => state.currentAccount);
  const setCurrentAccount = useStore((state) => state.setCurrentAccount);
  const setUserData = useStore((state) => state.setUserData);

  useEffect(() => {
    if (loginInitiated && currentAccount) {
      window.location.href = '/home';
    }
  }, [currentAccount, loginInitiated]);

  const metaMaskConnect = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected wallet address:', accounts);
      setCurrentAccount(accounts[0]);
      setLoginInitiated(true);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const uni = document.getElementById('uni').value;

    var tempData;

    if (signupState == 2) {
      tempData = {
        userName: name,
        userEmail: email,
        universityName: uni,
        isProfessor: true,
      };
    } else {
      tempData = {
        userName: name,
        userEmail: email,
        universityName: uni,
        isProfessor: false,
      };
    }
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const used = await isEmailAlreadyInUse(email);
    if (used) {
      alert('Email already in use');
      return;
    }
    const flag = await signUpUser_block(accounts[0], tempData);
    if (flag) {
      setUserData(tempData);
      setCurrentAccount(accounts[0]);
      window.location.href = '/home';
    }
  };
  return (
    <div className='UserAuth'>
      <div className='authWrapper'>
        <div className='title'>{signupState == 0 ? 'Login' : 'Signup'}</div>
        {signupState == 0 ? (
          <div className='loginButtons'>
            <div className='loginButton' id='metamaskconn' onClick={metaMaskConnect}>
              Login with MetaMask Wallet
            </div>
            or
            <div
              className='loginButton'
              id='signup'
              onClick={() => {
                setSignupState(1);
              }}
            >
              Signup
            </div>
          </div>
        ) : signupState == 1 ? (
          <div className='signupButtons'>
            <div
              className='signupButton'
              id='profSignup'
              onClick={() => {
                setSignupState(2);
              }}
            >
              Professor
            </div>
            <div
              className='signupButton'
              id='studSignup'
              onClick={() => {
                setSignupState(3);
              }}
            >
              Student
            </div>

            <div
              className='back'
              onClick={() => {
                setSignupState(0);
              }}
            >
              &#x2190;
            </div>
          </div>
        ) : signupState == 2 ? (
          <div className='signupForm'>
            <div className='inputs'>
              <input type='text' name='Uni Email' id='email' className='signupInput' placeholder='University Email' />
              <input type='text' name='Name' id='name' className='signupInput' placeholder='Name' />
              <input type='text' name='Uni Name' id='uni' className='signupInput' placeholder='University Name' />
            </div>
            <div className='loginButton' id='metamaskconn' onClick={handleSignup}>
              Signup with MetaMask Wallet
            </div>
            <div
              className='back'
              onClick={() => {
                setSignupState(1);
              }}
            >
              &#x2190;
            </div>
          </div>
        ) : (
          <div className='signupForm'>
            <div className='inputs'>
              <input type='text' name='Email' id='email' className='signupInput' placeholder='Email' />
              <input type='text' name='Name' id='name' className='signupInput' placeholder='Name' />
              <input type='text' name='Uni Name' id='uni' className='signupInput' placeholder='University Name' />
            </div>
            <div className='loginButton' id='metamaskconn' onClick={handleSignup}>
              Signup with MetaMask Wallet
            </div>
            <div
              className='back'
              onClick={() => {
                setSignupState(1);
              }}
            >
              &#x2190;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuth;
