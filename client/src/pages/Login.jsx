import UserAuth from '../components/UserAuth/UserAuth';

const Login = () => {
  return (
    <div
      className='Login'
      style={{
        backgroundColor: '#31857b',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div className='PageTitle'>BShiksha</div>
      <UserAuth />
    </div>
  );
};

export default Login;
