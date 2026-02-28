import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { MapPin, Search, ChevronDown, ChevronUp, Star, Calendar, FileText } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

import { useNavigate } from 'react-router-dom';

export default function SiteInfo() {
  const { sites, updateSite, getWorklogsBySite } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'ing' | 'wait' | 'done'>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === 'all' || site.status === filter;
    return matchesSearch && matchesStatus;
  });

  const togglePin = (e: React.MouseEvent, id: string, current: boolean) => {
    e.stopPropagation();
    updateSite(id, { pinned: !current });
  };

  return (
    <div className="p-4 max-w-[600px] mx-auto pt-6">
      {/* Search */}
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="현장명 검색" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-[54px] bg-white border border-slate-200 rounded-xl pl-12 pr-4 text-[17px] font-medium outline-none focus:border-[#31a3fa] shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: '전체' },
          { id: 'ing', label: '진행중' },
          { id: 'wait', label: '예정' },
          { id: 'done', label: '완료' }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id as any)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border",
              filter === chip.id 
                ? "bg-[#31a3fa] text-white border-[#31a3fa]" 
                : "bg-white text-slate-500 border-slate-200"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filteredSites.map(site => {
          const siteLogs = getWorklogsBySite(site.id);
          const totalDays = siteLogs.length;
          // Mock calculation for defects (e.g., logs with 'reject' status or specific field)
          const defects = siteLogs.filter(l => l.status === 'reject').length;

          return (
            <div 
              key={site.id} 
              className={clsx(
                "bg-white rounded-2xl shadow-sm overflow-hidden transition-all border",
                site.pinned ? "border-[#31a3fa] ring-1 ring-[#31a3fa]/20" : "border-slate-100"
              )}
            >
              <div 
                className="p-5 relative cursor-pointer"
                onClick={() => setExpandedId(expandedId === site.id ? null : site.id)}
              >
                {/* Status Badge */}
                <div className={clsx(
                  "absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-xs font-bold text-white",
                  site.status === 'ing' ? 'bg-blue-500' : 
                  site.status === 'wait' ? 'bg-indigo-500' : 'bg-slate-500'
                )}>
                  {site.status === 'ing' ? '진행중' : site.status === 'wait' ? '예정' : '완료'}
                </div>

                <div className="flex justify-between items-start mb-2 pr-12">
                  <div>
                    <h3 className="text-lg font-bold text-[#1a254f] leading-tight mb-1">{site.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{site.dept}</span>
                      <span>{site.contractor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mt-3 bg-slate-50 p-2 rounded-lg">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{site.address || '주소 없음'}</span>
                </div>

                <div className="absolute top-12 right-4">
                  <button onClick={(e) => togglePin(e, site.id, !!site.pinned)}>
                    <Star 
                      size={22} 
                      className={clsx(
                        "transition-colors",
                        site.pinned ? "fill-[#31a3fa] text-[#31a3fa]" : "text-slate-300"
                      )} 
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === site.id && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: 'auto' }} 
                    exit={{ height: 0 }} 
                    className="overflow-hidden bg-slate-50 border-t border-slate-100"
                  >
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-xs text-slate-400 font-bold mb-1">현장소장</div>
                          <div className="font-bold text-slate-700">김관리</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-xs text-slate-400 font-bold mb-1">안전담당</div>
                          <div className="font-bold text-slate-700">박안전</div>
                        </div>
                        <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                          <div>
                            <div className="text-xs text-slate-400 font-bold mb-1">작업일 누계</div>
                            <div className="font-bold text-[#1a254f] text-lg">{totalDays}일</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400 font-bold mb-1">반려/미조치</div>
                            <div className="font-bold text-red-500 text-lg">{defects}건</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Logs */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-1">
                          <FileText size={14} /> 최근 작업일지
                        </h4>
                        {siteLogs.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {siteLogs.slice(0, 3).map(log => (
                              <div 
                                key={log.id} 
                                onClick={() => navigate('/', { state: { logId: log.id } })}
                                className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-slate-400" />
                                  <span className="text-sm font-bold text-slate-700">{log.date}</span>
                                </div>
                                <span className={clsx(
                                  "text-xs font-bold px-2 py-0.5 rounded",
                                  log.status === 'approved' ? "bg-slate-100 text-slate-500" :
                                  log.status === 'reject' ? "bg-red-100 text-red-500" :
                                  log.status === 'pending' ? "bg-indigo-100 text-indigo-500" :
                                  "bg-blue-100 text-blue-500"
                                )}>
                                  {log.status === 'approved' ? '승인' :
                                   log.status === 'reject' ? '반려' :
                                   log.status === 'pending' ? '요청' : '작성'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-xs text-slate-400 py-4 bg-white rounded-xl border border-slate-100 border-dashed">
                            기록된 일지가 없습니다
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Button */}
              <button 
                onClick={() => setExpandedId(expandedId === site.id ? null : site.id)}
                className="w-full h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 border-t border-slate-100 transition-colors"
              >
                {expandedId === site.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
