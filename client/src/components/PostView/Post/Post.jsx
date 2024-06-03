import { sendPostFee_block } from '../../../scripts/block.js';
import { useStore } from '../../../dataStore.js';
import './Post.scss';

const Post = (post) => {
  const { currentAccount } = useStore();

  const handleDownload = async () => {
    const payment_flag = await sendPostFee_block(currentAccount, post.post);
    if (payment_flag) window.open(`http://localhost:8080/ipfs/${post.post.hash}`);
  };

  return (
    <div className='Post'>
      <div className='post-author'>{post.post.author}</div>
      <div className='post-uni'></div>
      <div className='post-title'>{post.post.title}</div>
      <div className='post-content'>{post.post.description}</div>
      <div className='purchaseContent' onClick={handleDownload}>
        Purchase Content | {post.post.viewCost} ETH{' '}
      </div>
    </div>
  );
};

export default Post;
