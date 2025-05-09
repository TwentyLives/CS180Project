import Header from '../components/header';
import Landing from '../components/landing';
import Footer from '../components/footer';
import Mission from '../components/mission';
import Tools from '../components/tools';
import Stats from '../components/stats';


const Home = () => {
  return (
    <div className="w-full scroll-smooth">
      <Header />
      <div id="start">
        <Landing />
      </div>
      <div id="stats">
        <Stats />
      </div>
      <div id="tools">
        <Tools />
      </div>
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