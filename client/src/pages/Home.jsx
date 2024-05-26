import Navbar from '../components/Navbar/Navbar';
import Postview from '../components/PostView/Postview';
import CommentView from '../components/CommentView/CommentView';
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
          <div className='basicProfile'></div>
          <div className='advProfile'>
            <div className='profilePostsContainer'></div>
            <div className='detailProfile'></div>
          </div>
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
