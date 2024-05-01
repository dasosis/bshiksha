import { useRender } from '../../renderDataStore';

import './Navbar.scss';

const Navbar = () => {
  const activeTab = useRender((state) => state.profilePageRender);
  const setActiveTab = useRender((state) => state.setProfilePageRender);
  return (
    <div className='Navbar'>
      <div className='navbar-brand'>BShiksha</div>
      <div className='navbar-nav'>
        <div className={'nav-link' + (activeTab == false ? ' selected' : '')} onClick={() => setActiveTab(0)}>
          Home
        </div>
        <div className={'nav-link' + (activeTab == true ? ' selected' : '')} onClick={() => setActiveTab(1)}>
          Profile
        </div>
      </div>
    </div>
  );
};

export default Navbar;
