import { getUserName } from '../../../scripts/block';
import { useStore } from '../../../dataStore';
import './Comment.scss';
import { useEffect, useState } from 'react';

const Comment = (comment) => {
  const { selectedPost } = useStore();
  const [commenterName, setCommenterName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      const name = await getUserName(comment.comment.commenter);
      setCommenterName(name.toString());
    };

    fetchName();
  }, [comment]);

  const decodedComment = comment.comment.decodedComment;
  return (
    <div className='Comment'>
      <div className='comment-author'>{commenterName}</div>
      <div className='comment-text'>{decodedComment}</div>
      {/* <div className='comment-time'>{time}</div> */}
    </div>
  );
};

export default Comment;
