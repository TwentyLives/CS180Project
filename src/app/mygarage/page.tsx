import Header from '../../components/loggedHeader';
import Garage from './garage';
import Footer from '../../components/footer';

const MyGarage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[var(--background)]">
      <Header />
      <main className="flex-grow">
        <Garage />
      </main>
      <Footer />
    </div>
  );
};


export default MyGarage;