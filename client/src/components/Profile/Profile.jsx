import React, { useEffect } from 'react';
import { useStore } from '../../dataStore.js';
import { getUserDetails } from '../../scripts/block.js';

import './Profile.scss';
import UserPosts from './UserPosts/UserPosts';

const Profile = () => {
  const { currentAccount } = useStore();
  const { userData, setUserData } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const userDetails = await getUserDetails(currentAccount);
      console.log('User details: ', userDetails);
      setUserData(userDetails);
    };
    fetchData();
  }, [currentAccount]);

  return (
    <div className='Profile'>
      <h1>My Profile</h1>
      <div className='profile-highlight'>
        <div className='profile-name'>
          <p id='userName'>{userData.userName}</p>
        </div>
        <div className='walletID'>
          <p>Wallet ID :&nbsp;</p>
          <p>{currentAccount}</p>
        </div>
      </div>
      <div className='profile-info'>
        {userData.isProfessor ? <UserPosts /> : <p>Student</p>}
        <UserPosts />
        <div className='profile-details'>
          <div className='profile-detail'>
            <p className='detail-label'>Name :</p>
            <p>{userData.userName}</p>
          </div>
          <div className='profile-detail'>
            <p className='detail-label'>Email :</p>
            <p>{userData.userEmail}</p>
          </div>
          <div className='profile-detail'>
            <p className='detail-label'>University Name:</p>
            <p>{userData.universityName}</p>
          </div>
          <div className='profile-detail'>
            <p className='detail-label'>Role :</p>
            <p>{userData.isProfessor ? 'Professor' : 'Student'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
