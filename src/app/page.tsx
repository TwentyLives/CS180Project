import Header from '../components/header';
import Landing from '../components/landing';
import Footer from '../components/footer';
import Mission from '../components/mission';


const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0 scroll-smooth">
      <Header />
      <Landing />
      <div id="mission">
        <Mission />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;