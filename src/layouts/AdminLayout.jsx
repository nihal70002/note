import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/add', icon: PlusSquare },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-paper border-r border-taupe/20 flex flex-col">
        <div className="p-6 border-b border-taupe/20">
          <Link to="/" className="font-serif font-semibold text-xl tracking-wider text-ink">
            AESTHETIC <span className="text-xs text-taupe block mt-1">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm tracking-wider uppercase transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'text-ink hover:bg-taupe/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-taupe/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm tracking-wider uppercase text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
