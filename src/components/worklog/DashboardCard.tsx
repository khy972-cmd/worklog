import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface DashboardCardProps {
  title: string;
  summary: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isMissing?: boolean;
  onClick: () => void;
}

export default function DashboardCard({ 
  title, summary, icon: Icon, iconColor, iconBg, isMissing, onClick 
}: DashboardCardProps) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "w-full bg-white rounded-2xl p-5 mb-4 shadow-sm border-2 transition-all flex items-center justify-between text-left active:scale-[0.98]",
        isMissing ? "border-red-100 bg-red-50/30" : "border-transparent"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center", iconBg, iconColor)}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1">
            {title}
            {isMissing && <span className="text-red-500 text-xs">*</span>}
          </h3>
          <p className={clsx("text-sm font-medium", isMissing ? "text-red-400" : "text-slate-500")}>
            {summary}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isMissing && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
            입력필요
          </span>
        )}
        <ChevronRight className="text-slate-300" size={20} />
      </div>
    </button>
  );
}
