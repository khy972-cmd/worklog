import React from 'react';
import { User, Settings, LogOut, Bell } from 'lucide-react';

export default function Menu() {
  return (
    <div className="p-4 max-w-[600px] mx-auto pt-6">
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1a254f]">이현수</h2>
          <p className="text-sm text-slate-500">현장소장 / 대구지사</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {[
          { icon: Bell, label: '알림 설정' },
          { icon: Settings, label: '계정 설정' },
          { icon: LogOut, label: '로그아웃', color: 'text-red-500' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 flex items-center gap-4 border-b border-slate-50 last:border-none hover:bg-slate-50 cursor-pointer transition-colors">
            <item.icon className={item.color || "text-slate-400"} size={20} />
            <span className={item.color || "text-slate-700 font-medium"}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
