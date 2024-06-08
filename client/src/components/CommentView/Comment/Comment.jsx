import { getUserName } from '../../../scripts/block';
import { useStore } from '../../../dataStore';
import './Comment.scss';
import { useEffect } from 'react';

const Comment = (comment) => {
  const { selectedPost } = useStore();
  // const author = 'John Doe';
  // const comment =
  //   'lorem ipsum dolor sit amet consectetur. Erat elit urna viverra tincidunt consectetur volutpat nibh quis.  Lectus quis commodo vulputate nulla est purus ac donec. Gravida cursus porttitor posuere sed. Phasellus erat tincidunt proin leo tellus nisi cum magnis ornare.';
  // const time = '2 hours ago';
  const commenter = comment.comment.commenter;
  const decodedComment = comment.comment.decodedComment;
  // console.log('Comment:', comment);
  return (
    <div className='Comment'>
      <div className='comment-author'>{commenter}</div>
      <div className='comment-text'>{decodedComment}</div>
      {/* <div className='comment-time'>{time}</div> */}
    </div>
  );
};

export default Comment;
