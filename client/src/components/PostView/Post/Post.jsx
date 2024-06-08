import { useEffect, useState } from 'react';
import { sendPostFee_block, getUserDetails } from '../../../scripts/block.js';
import { useStore } from '../../../dataStore.js';
import './Post.scss';

const Post = (post) => {
  const { currentAccount } = useStore();
  const { setSelectedPost } = useStore();
  const [author, setAuthor] = useState('');
  const [universityName, setUniversityName] = useState('');

  const handleDownload = async () => {
    console.log(post.post);
    const payment_flag = await sendPostFee_block(currentAccount, post.post);
    if (payment_flag) window.open(`http://localhost:8080/ipfs/${post.post.fileCid}`);
  };

  const handleSelect = () => {
    setSelectedPost(post.post);
    // console.log(selectedPost);
  };

  useEffect(() => {
    const fetchName = async () => {
      const userdetails = await getUserDetails(post.post.author);
      setAuthor(userdetails.userName.toString());
      setUniversityName(userdetails.universityName.toString());
    };

    fetchName();
  }, [author, universityName, post.post.author]);

  return (
    <div className='Post' onClick={handleSelect}>
      <div className='post-author'>{author}</div>
      <div className='post-uni'>{universityName}</div>
      <div className='post-title'>{post.post.title}</div>
      <div className='post-content'>{post.post.description}</div>
      <div className='purchaseContent' onClick={handleDownload}>
        Purchase Content | {post.post.viewCost / 10 ** 18} ETH{' '}
      </div>
    </div>
  );
};

export default Post;
