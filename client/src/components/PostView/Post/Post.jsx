// import { useStore } from '../../../dataStore';
// import { useEffect } from 'react';
import './Post.scss';

const Post = (post) => {
  // console.log(post.post.author);
  console.log(post.post.title);
  console.log(post);

  return (
    <div className='Post'>
      <div className='post-author'>{post.post.author}</div>
      <div className='post-uni'></div>
      <div className='post-title'>{post.post.title}</div>
      <div className='post-content'>{post.post.description}</div>
      <div className='purchaseContent'>Purchase Content | {post.post.viewCost} ETH </div>
    </div>
  );
};

export default Post;
