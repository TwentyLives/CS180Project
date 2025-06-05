import AddVehiclePage from '../AddVehiclePage';
import Header from '@/components/loggedHeader';
import Footer from '@/components/footer';

export default function AddVehicleWrapper() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] px-4 py-10">
        <AddVehiclePage />
      </main>
      <Footer />
    </>
  );
}
