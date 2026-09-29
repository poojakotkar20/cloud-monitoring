import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  FileText, 
  Network, 
  Bell, 
  Bot, 
  Settings,
  Search,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../utils';

const navItems = [
  { name: 'Overview', to: '/', icon: LayoutDashboard },
  { name: 'Services', to: '/services', icon: Server },
  { name: 'Metrics', to: '/metrics', icon: Activity },
  { name: 'Logs', to: '/logs', icon: FileText },
  { name: 'Traces', to: '/traces', icon: Network },
  { name: 'Alerts', to: '/alerts', icon: Bell },
  { name: 'AI Assistant', to: '/ai', icon: Bot },
];

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Activity className="w-6 h-6 text-indigo-500 mr-2" />
          <span className="font-bold text-lg tracking-tight">ObsPlatform</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-50"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0")} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800/50 hover:text-slate-50 transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources, logs, or traces..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
              <option>Production</option>
              <option>Staging</option>
              <option>Development</option>
            </select>
            
            <button className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-700 mx-2"></div>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-500/50 transition-colors">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-slate-100 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-900 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
