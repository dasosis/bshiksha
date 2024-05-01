import './Comment.scss';

const Comment = () => {
  const author = 'John Doe';
  const comment =
    'lorem ipsum dolor sit amet consectetur. Erat elit urna viverra tincidunt consectetur volutpat nibh quis.  Lectus quis commodo vulputate nulla est purus ac donec. Gravida cursus porttitor posuere sed. Phasellus erat tincidunt proin leo tellus nisi cum magnis ornare.';
  const time = '2 hours ago';
  return (
    <div className='Comment'>
      <div className='comment-author'>{author}</div>
      <div className='comment-text'>{comment}</div>
      <div className='comment-time'>{time}</div>
    </div>
  );
};

export default Comment;
