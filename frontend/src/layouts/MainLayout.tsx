import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fa]">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 md:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
