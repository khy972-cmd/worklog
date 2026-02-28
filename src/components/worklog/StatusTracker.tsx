import React from 'react';
import clsx from 'clsx';

interface StatusTrackerProps {
  status: 'draft' | 'pending' | 'approved' | 'reject';
}

export default function StatusTracker({ status }: StatusTrackerProps) {
  const steps = [
    { id: 'draft', label: '일지작성', step: 1 },
    { id: 'pending', label: '승인요청', step: 2 },
    { id: 'approved', label: '최종승인', step: 3 },
  ];

  // Map 'reject' to step 2 (pending) visually but red, or keep it as step 1?
  // Usually reject goes back to draft or stays at pending with error.
  // For this visualizer, let's treat 'reject' as a special state or just map it to 1.
  
  let currentStep = 1;
  if (status === 'pending') currentStep = 2;
  if (status === 'approved') currentStep = 3;
  
  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between relative">
        {/* Lines Layer */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0">
          <div 
            className={clsx("h-full transition-all duration-500", status === 'reject' ? "bg-red-400" : "bg-[#31a3fa]")}
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>

        {/* Steps Layer */}
        {steps.map((s, idx) => {
          const isActive = idx + 1 <= currentStep;
          const isCurrent = idx + 1 === currentStep;
          
          return (
            <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={clsx(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4",
                isActive 
                  ? (status === 'reject' && isCurrent ? "bg-red-500 border-red-100 text-white" : "bg-[#31a3fa] border-[#eaf6ff] text-white")
                  : "bg-slate-200 border-white text-slate-400"
              )}>
                {s.step}
              </div>
              <span className={clsx(
                "text-[11px] font-bold mt-2 transition-colors",
                isActive 
                  ? (status === 'reject' && isCurrent ? "text-red-500" : "text-[#31a3fa]")
                  : "text-slate-300"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
