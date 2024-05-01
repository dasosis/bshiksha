// import React from 'react';
import Post from './Post/Post';

import './Postview.scss';

const Postview = () => {
  const posts = 6;

  return (
    <div className='Postview'>
      {[...Array(posts)].map((value, index) => (
        <Post key={index} />
      ))}
    </div>
  );
};

export default Postview;
