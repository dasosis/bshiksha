import Navbar from '../components/Navbar/Navbar';
import Postview from '../components/PostView/Postview';
import CommentView from '../components/CommentView/CommentView';

import { useRender } from '../renderDataStore';

const Home = () => {
  const profileRender = useRender((state) => state.profilePageRender);
  return (
    <div
      className='Home'
      style={{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      {profileRender ? (
        <div className='profileWrapper'>
          <div className='basicProfile'></div>
          <div className='advProfile'>
            <div className='profilePostsContainer'></div>
            <div className="detailProfile"></div>
          </div>
        </div>
      ) : (
        <div className='feedWrapper'>
          <Postview />
          <CommentView />
        </div>
      )}
    </div>
  );
};

export default Home;
