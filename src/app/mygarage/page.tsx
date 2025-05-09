import Header from '../../components/loggedHeader';
import Garage from '../../components/garage/page';
import Footer from '../../components/footer';

const MyGarage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--background)]">
      <Header />
      <Garage />
      <Footer />
    </div>
  );
};

export default MyGarage;
