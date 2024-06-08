import { useState, useEffect } from 'react';
import Post from './Post/Post';
import { getPostForFeed, getFeed } from '../../scripts/post';
import { useStore } from '../../dataStore.js';
import './Postview.scss';

const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
};

const Postview = () => {
  const { feedData, setFeedData } = useStore();
  const { currentAccount } = useStore();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const postCount = await getFeed();
        const posts = [];
        for (let i = 0; i < postCount; i++) {
          const post = await getPostForFeed(i);
          posts.push(serializeBigInt(post));
        }
        // some serious issues led me to do this
        // posts.pop();
        setFeedData(posts);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchFeed();
  }, [setFeedData]);

  return (
    <div className='postview'>
      {feedData.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Postview;