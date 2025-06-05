import Header from '../../components/loggedHeader';
import Getter from '../../components/getter';
import Footer from '../../components/footer';


const SubmitPrices = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <Getter />
      <Footer />
    </div>
  );
};

export default SubmitPrices;