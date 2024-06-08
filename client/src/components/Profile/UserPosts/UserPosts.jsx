import { useEffect, useCallback } from 'react';
import { useStore } from '../../../dataStore.js';
import { fetchPostIdsMadeByUser } from '../../../scripts/block.js';
import { getPostForFeed } from '../../../scripts/post.js';

const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
};

const UserPosts = () => {
  const { currentAccount } = useStore();
  const { userPosts, setUserPosts } = useStore();

  const fetchData = useCallback(async () => {
    try {
      const postIds = await fetchPostIdsMadeByUser(currentAccount);
      console.log('Post Ids: ', postIds);

      // Serialize BigInt values in postIds
      const serializedPostIds = postIds.map((id) => (typeof id === 'bigint' ? id.toString() : id));

      // Fetch details for each post ID
      const postDetailsPromises = serializedPostIds.map(async (postId) => {
        const post = await getPostForFeed(postId);
        return serializeBigInt(post); // Serialize BigInt values in post details
      });
      const postDetails = await Promise.all(postDetailsPromises);

      setUserPosts(postDetails);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  }, [currentAccount, setUserPosts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='UserPosts'>
      <h1>My Posts</h1>
      <div className='user-posts'>
        {userPosts.map((post) => (
          <div key={post.id} className='user-post'>
            <h2 className='userPost-title'>{post.title}</h2>
            <p className='userPost-description'>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
