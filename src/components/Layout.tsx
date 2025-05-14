import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeSwitcher from './ThemeSwitcher';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container-custom py-6">
        <Outlet />
      </main>
      <ThemeSwitcher />
      <Footer />
    </div>
  );
};

export default Layout;