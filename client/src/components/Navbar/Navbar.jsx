import { useRender } from '../../renderDataStore';

import './Navbar.scss';

const Navbar = () => {
  const activeTab = useRender((state) => state.pageRender);
  const setActiveTab = useRender((state) => state.setPageRender);
  return (
    <div className='Navbar'>
      <div className='navbar-brand'>BShiksha</div>
      <div className='navbar-nav'>
        <div className={'nav-link' + (activeTab == 0 ? ' selected' : '')} onClick={() => setActiveTab(0)}>
          Home
        </div>
        <div className={'nav-link' + (activeTab == 1 ? ' selected' : '')} onClick={() => setActiveTab(1)}>
          Profile
        </div>
        <div className={'nav-link' + (activeTab == 2 ? ' selected' : '')} onClick={() => setActiveTab(2)}>
          Upload
        </div>
      </div>
    </div>
  );
};

export default Navbar;
