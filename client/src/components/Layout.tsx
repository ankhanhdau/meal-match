import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, Heart, LayoutGrid, LogOut, User } from 'lucide-react';
import {useStore} from '../hooks/useStore';

const Layout: React.FC = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Move navigation to useEffect to avoid setState during render
  useEffect(() => {
    if (!user && location.pathname !== '/auth') {
      navigate('/auth', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto bg-stone-50">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
          <ChefHat /> <span>MealMatch</span>
        </div>
        <div className="flex items-center gap-2">
            {user ? (
               <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-stone-800"><LogOut size={20}/></button>
            ) : (
                <button onClick={() => navigate('/auth')} className="text-sm font-semibold text-brand-600">Login</button>
            )}
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Bottom Nav */}
      {user && (
        <>
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-screen sticky top-0 p-6">
            <div className="flex items-center gap-3 text-brand-600 font-bold text-2xl mb-10 px-2">
              <ChefHat size={32} /> <span>MealMatch</span>
            </div>
            
            <nav className="flex-1 space-y-2">
              <NavItem to="/" icon={<LayoutGrid size={20} />} label="Discover" />
              <NavItem to="/pantry" icon={<User size={20} />} label="My Pantry" />
              <NavItem to="/favorites" icon={<Heart size={20} />} label="Favorites" />
            </nav>

            <div className="pt-6 border-t border-stone-100">
               <div className="flex items-center gap-3 px-3 py-2 text-stone-600 mb-4">
                 <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                    {user.name.charAt(0)}
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className="truncate text-sm font-medium text-stone-900">{user.name}</p>
                   <p className="truncate text-xs text-stone-500">{user.email}</p>
                 </div>
               </div>
               <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg w-full transition-colors"
               >
                 <LogOut size={20} />
                 <span>Sign Out</span>
               </button>
            </div>
          </aside>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-3 z-30 pb-safe">
            <MobileNavItem to="/" icon={<LayoutGrid size={24} />} label="Discover" />
            <MobileNavItem to="/pantry" icon={<User size={24} />} label="Pantry" />
            <MobileNavItem to="/favorites" icon={<Heart size={24} />} label="Saved" />
          </nav>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-80px)] md:min-h-screen pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-brand-50 text-brand-700 font-semibold' 
          : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${
        isActive ? 'text-brand-600' : 'text-stone-400'
      }`
    }
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);

export default Layout;