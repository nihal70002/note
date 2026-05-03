import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, PlusSquare, LogOut, Menu, X, Users, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: Package },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Expenses", path: "/admin/expenses", icon: Wallet },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/products/add", icon: PlusSquare },
    { name: "Storefront", path: "/admin/storefront", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex">

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-paper p-2 shadow rounded"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-ink/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-paper border-r border-taupe/20 flex flex-col transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* CLOSE BUTTON MOBILE */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* BRAND */}
        <div className="p-6 border-b border-taupe/20">
          <Link
            to="/"
            className="font-serif font-semibold text-xl tracking-wider text-ink"
          >
            PAPERCUES
            <span className="text-xs text-taupe block mt-1">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm tracking-wider uppercase transition-colors
                ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink hover:bg-taupe/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-w-0 overflow-y-auto p-4 pt-20 sm:p-6 sm:pt-20 md:p-10">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
