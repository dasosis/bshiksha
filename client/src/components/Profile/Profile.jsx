import React from 'react';
import { useStore } from '../../dataStore.js';

import './Profile.scss';

const Profile = () => {
  const { currentAccount } = useStore();
  const { userData } = useStore();
  return <div>Profile</div>;
};

export default Profile;
