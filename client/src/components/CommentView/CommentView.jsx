import Comment from './Comment/Comment';

import './CommentView.scss';

const CommentView = () => {
  const comment = 5;
  return (
    <div className='CommentView'>
      {[...Array(comment)].map((value, index) => (
        <Comment key={index} />
      ))}
    </div>
  );
};

export default CommentView;
