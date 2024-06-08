import { sendPostFee_block } from '../../../scripts/block.js';
import { useStore } from '../../../dataStore.js';
import './Post.scss';

const Post = (post) => {
  const { currentAccount } = useStore();
  const { selectedPost, setSelectedPost } = useStore();

  const handleDownload = async () => {
    console.log(post.post);
    const payment_flag = await sendPostFee_block(currentAccount, post.post);
    if (payment_flag) window.open(`http://localhost:8080/ipfs/${post.post.fileCid}`);
  };

  const handleSelect = () => {
    setSelectedPost(post.post);
    // console.log(selectedPost);
  };

  return (
    <div className='Post' onClick={handleSelect}>
      <div className='post-author'>{post.post.author}</div>
      <div className='post-uni'></div>
      <div className='post-title'>{post.post.title}</div>
      <div className='post-content'>{post.post.description}</div>
      <div className='purchaseContent' onClick={handleDownload}>
        Purchase Content | {post.post.viewCost / 10 ** 18} ETH{' '}
      </div>
    </div>
  );
};

export default Post;
