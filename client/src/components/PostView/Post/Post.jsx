import './Post.scss';

const Post = () => {
  const postTitle = 'Lorem ipsum dolor sit amet consectetur.';
  const postContent =
    'Lorem ipsum dolor sit amet consectetur. Erat elit urna viverra tincidunt consectetur volutpat nibh quis. Lectus quis commodo vulputate nulla est purus ac donec. Gravida cursus porttitor posuere sed. Phasellus erat tincidunt proin leo tellus nisi cum magnis ornare.';
  const postAuthor = 'John Doe';
  const postUni = 'Techno India University';
  const cost = 0.1;

  return (
    <div className='Post'>
      <div className='post-author'>{postAuthor}</div>
      <div className='post-uni'>{postUni}</div>
      <div className='post-title'>{postTitle}</div>
      <div className='post-content'>{postContent}</div>
      <div className='purchaseContent'>Purchase Content | {cost} ETH </div>
    </div>
  );
};

export default Post;
