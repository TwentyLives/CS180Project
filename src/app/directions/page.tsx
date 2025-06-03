import Header from '../../components/loggedHeader';
import RedirectMap from '../../components/redirectmap';
import Footer from '../../components/footer';


const Directions = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <RedirectMap />
      <Footer />
    </div>
  );
};

export default Directions;