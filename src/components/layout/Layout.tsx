import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Map, FileText, Menu, List } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#111111] font-sans pb-20">
      <div className="max-w-[600px] mx-auto min-h-screen bg-[#f2f4f6] relative shadow-xl">
        <Outlet />
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavItem to="/" icon={<Home size={24} />} label="홈" active={location.pathname === '/'} />
          <NavItem to="/worklogs" icon={<List size={24} />} label="작업일지" active={location.pathname.startsWith('/worklogs')} />
          <NavItem to="/sites" icon={<Map size={24} />} label="현장정보" active={location.pathname.startsWith('/sites')} />
          <NavItem to="/docs" icon={<FileText size={24} />} label="문서함" active={location.pathname.startsWith('/docs')} />
          <NavItem to="/menu" icon={<Menu size={24} />} label="전체" active={location.pathname === '/menu'} />
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <NavLink 
      to={to} 
      className={clsx(
        "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
        active ? "text-[#31a3fa]" : "text-[#94a3b8] hover:text-[#64748b]"
      )}
    >
      <div className={clsx("transition-transform duration-200", active && "scale-110")}>
        {icon}
      </div>
      <span className="text-[11px] font-bold">{label}</span>
    </NavLink>
  );
}
