import Comment from './Comment/Comment';
import { fetchCommentEventsFromBlock, addCommentToBlock } from '../../scripts/block';
import { useEffect } from 'react';
import { useStore } from '../../dataStore';

import './CommentView.scss';

const CommentView = () => {
  const { selectedPost } = useStore();
  const { currentAccount } = useStore();
  const { userComments, setUserComments } = useStore();
  const fetchComments = async () => {
    let commentsArray = [];
    let commenterArray = [];
    const events = await fetchCommentEventsFromBlock(selectedPost.id);
    console.log('Logging Events from post.js', events, selectedPost.id);
    const commentCidArray = [];
    for (const event of events) {
      const { commentCid, commenter } = event.returnValues;
      console.log('post.js print comment before server', { commentCid, commenter });
      commentCidArray.push(commentCid);
      commenterArray.push(commenter);
    }
    const commentResponse = await fetch('http://localhost:3000/commentDecode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify({ commentCids: commentCidArray }),
    });
    const commentData = await commentResponse.json();
    const commentDataWithCommenter = commentData.map((comment, index) => ({
      ...comment,
      commenter: commenterArray[index],
    }));

    commentsArray = commentsArray.concat(commentDataWithCommenter);

    setUserComments(commentsArray);
  };

  useEffect(() => {
    fetchComments();
  }, [selectedPost]);

  const handleComment = async () => {
    const comment = document.querySelector('.commentInput textarea').value.trim();
    if (!comment) return;
    const response = await fetch('http://localhost:3000/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify({ comment }),
    });
    const commentCid = await response.json();
    // console.log(commentCid);
    await addCommentToBlock(selectedPost.id, commentCid, currentAccount);
    fetchComments();
    document.querySelector('.commentInput textarea').value = '';
    // setUserComments([...userComments, commentCid]);
  };

  return (
    <div className='CommentView'>
      {userComments.map((value) => (
        <Comment comment={value} />
      ))}
      <div className='commentInput'>
        <textarea type='text' placeholder='Add a comment...' />
        <button onClick={handleComment}>Submit</button>
      </div>
    </div>
  );
};

export default CommentView;
