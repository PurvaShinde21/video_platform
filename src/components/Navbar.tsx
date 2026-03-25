import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import UploadModal from './UploadModal.tsx';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16 z-50">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-[#FE2C55]' : 'text-white'}`}>
          <Home size={24} />
          <span className="text-[10px] mt-1">Home</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-[#FE2C55]' : 'text-white'}`}>
          <Compass size={24} />
          <span className="text-[10px] mt-1">Explore</span>
        </NavLink>
        <button onClick={() => setIsUploadOpen(true)} className="bg-white text-black p-1 rounded-md hover:bg-gray-200 transition-colors">
          <PlusSquare size={28} />
        </button>
        <NavLink to={user ? `/profile/${user.id}` : '/login'} className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-[#FE2C55]' : 'text-white'}`}>
          <User size={24} />
          <span className="text-[10px] mt-1">Profile</span>
        </NavLink>
        {user && (
          <button onClick={logout} className="flex flex-col items-center text-white">
            <LogOut size={24} />
            <span className="text-[10px] mt-1">Logout</span>
          </button>
        )}
      </nav>
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
    </>
  );
};

export default Navbar;
