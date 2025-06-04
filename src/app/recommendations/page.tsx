import Header from '../../components/loggedHeader';
import Recommends from '../../components/recommends';
import Footer from '../../components/footer';


const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <Recommends />
      <Footer />
    </div>
  );
};

export default Dashboard;