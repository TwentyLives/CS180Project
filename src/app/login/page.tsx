import Login from '../../components/login';
import Header from '../../components/header';

const Create = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
            <Login />
        </div>
    </div>
  );
};

export default Create;