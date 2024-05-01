import { useEffect, useState } from 'react';
import { useStore } from '../../dataStore';

import emailData from '../../emailData.json';

import './UserAuth.scss';

const UserAuth = () => {
  const [signupState, setSignupState] = useState(0);
  const currentAccount = useStore((state) => state.currentAccount);
  const setCurrentAccount = useStore((state) => state.setCurrentAccount);
  useEffect(() => {
    if (currentAccount) {
      window.location.href = '/home';
    }
  }, [currentAccount]);
  const metaMaskConnect = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected wallet address:', accounts);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const uni = document.getElementById('uni').value;

    if (emailData.some((data) => data.email.split('@')[1] === email.split('@')[1])) {
      console.log('Email is uni email');
    } else {
      console.log('Email is not uni email');
    }

    if (signupState == 2) {
      emailData.push({
        email: email,
        name: name,
        uni: uni,
        role: 'prof',
      });
    } else {
      emailData.push({
        email: email,
        name: name,
        role: 'stud',
      });
    }
    window.location.href = '/home';
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
              a Professor
            </div>
            <div
              className='signupButton'
              id='studSignup'
              onClick={() => {
                setSignupState(3);
              }}
            >
              a Student
            </div>

            <div
              className='back'
              style={{ cursor: 'pointer', color: 'blue', fontSize: '1.2em' }}
              onClick={() => {
                setSignupState(0);
              }}
            >
              go back
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
              style={{ cursor: 'pointer', color: 'blue', fontSize: '1.2em' }}
              onClick={() => {
                setSignupState(1);
              }}
            >
              go back
            </div>
          </div>
        ) : (
          <div className='signupForm'>
            <div className='inputs'>
              <input type='text' name='Email' id='email' className='signupInput' placeholder='Email' />
              <input type='text' name='Name' id='name' className='signupInput' placeholder='Name' />
            </div>
            <div className='loginButton' id='metamaskconn' onClick={handleSignup}>
              Signup with MetaMask Wallet
            </div>
            <div
              className='back'
              style={{ cursor: 'pointer', color: 'blue', fontSize: '1.2em' }}
              onClick={() => {
                setSignupState(1);
              }}
            >
              go back
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuth;
