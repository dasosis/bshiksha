import { useEffect } from 'react';
import { useStore } from '../../../dataStore.js';

import { fetchPostIdsMadeByUser } from '../../../scripts/block.js';

const UserPost = (post) => {
  const { currentAccount } = useStore();

  return (
    <div className='Post'>
      <div className='post-title'>{post.post.title}</div>
      <div className='post-content'>{post.post.description}</div>
    </div>
  );
};

const UserPosts = () => {
  const { feedData, setFeedData } = useStore();
  const { currentAccount } = useStore();
  let userPosts = [];

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        userPosts = await fetchPostIdsMadeByUser(currentAccount);
        console.log('User posts:', userPosts);
      } catch (error) {
        console.error('Error fetching feed:', error);
        userPosts = [];
      }
    };

    fetchFeed();
  }, [setFeedData]);

  return (
    <div className='postview'>
      {/* {userPosts.map((post) => (
        <UserPost key={post.id} post={post} />
      ))} */}
    </div>
  );
};

export default UserPosts;
