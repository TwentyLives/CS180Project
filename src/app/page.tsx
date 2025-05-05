import Header from '../components/header';
import Landing from '../components/landing';
import Footer from '../components/footer';
import Mission from '../components/mission';


const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <Landing />
      <Mission />
      <Footer />
    </div>
  );
};

export default Home;