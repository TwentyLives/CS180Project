import Header from '../../components/header';
import Dash from '../../components/dash';
import Footer from '../../components/footer';


const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <Dash />
      <Footer />
    </div>
  );
};

export default Dashboard;