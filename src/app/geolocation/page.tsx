import LocationComponent from "./LocationComponent";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* <h1 className="text-2xl mb-4">Geolocation Example</h1> */}
      <LocationComponent />
    </div>
  );
};

export default Home;

