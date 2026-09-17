import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Coffee, Users, LogOut, Home } from 'lucide-react';
import { logout } from '../services/api';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cafe-base">
      <nav className="bg-white shadow-sm border-b border-opacity-10 border-cafe-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <Coffee className="h-8 w-8 text-cafe-caramel" />
                <span className="ml-2 text-xl font-bold font-serif text-cafe-ink">CafeRewards</span>
              </Link>
              <div className="ml-6 flex space-x-4">
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-cafe-caramel text-sm font-medium text-opacity-70 text-cafe-ink hover:text-cafe-ink">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/members" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-cafe-caramel text-sm font-medium text-opacity-70 text-cafe-ink hover:text-cafe-ink">
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-4">Staff: {user.name}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
