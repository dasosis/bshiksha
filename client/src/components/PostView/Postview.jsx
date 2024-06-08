import { useEffect } from 'react';
import axios from 'axios';
import Post from './Post/Post';
import { getPostForFeed, getFeed } from '../../scripts/post';
import { useStore } from '../../dataStore.js';
import './Postview.scss';

const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
};

const Postview = () => {
  const { feedData, setFeedData } = useStore();
  // const { currentAccount } = useStore();

  const fetchFeed = async () => {
    const postCount = await getFeed();
    let responseData = [];
    for (let i = 1; i <= postCount; i++) {
      const post = await getPostForFeed(i);
      // console.log('Post:', post);
      const postJson = serializeBigInt(post);
      const response = await axios.post('http://localhost:3000/feed', postJson);
      const responseDataWithExtras = {
        ...response.data,
        id: serializeBigInt(post.id),
        viewCost: serializeBigInt(post.viewCost),
        hash: post.postCid,
        author: serializeBigInt(post.author),
      };
      responseData.push(responseDataWithExtras);
    }
    // console.log('ResponseData:', responseData);
    setFeedData(responseData);
    // console.log('FeedData:', feedData);
  };

  useEffect(() => {
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
