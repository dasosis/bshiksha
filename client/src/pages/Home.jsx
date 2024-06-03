import Navbar from '../components/Navbar/Navbar';
import Postview from '../components/PostView/Postview';
import CommentView from '../components/CommentView/CommentView';
import Profile from '../components/Profile/Profile';
import Upload from '../components/Upload/Upload';

import { useRender } from '../renderDataStore';

const Home = () => {
  const pageRender = useRender((state) => state.pageRender);
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
      {pageRender == 1 ? (
        <div className='profileWrapper'>
          <Profile />
        </div>
      ) : pageRender == 2 ? (
        <div className='uploadWrapper'>
          <Upload />
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
