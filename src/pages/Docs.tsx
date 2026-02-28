import React, { useState } from 'react';
import { FileText, Search, Folder, MoreVertical, Eye, Download } from 'lucide-react';
import clsx from 'clsx';

export default function Docs() {
  const [activeTab, setActiveTab] = useState<'my' | 'company'>('my');

  const docs = [
    { id: 1, title: '기초안전보건교육이수증', date: '2025-12-28', type: 'img', status: 'registered' },
    { id: 2, title: '통장사본', date: '2025-12-28', type: 'img', status: 'registered' },
    { id: 3, title: '신분증', date: '2025-12-28', type: 'img', status: 'registered' },
    { id: 4, title: '근로계약서', date: '-', type: 'doc', status: 'missing' },
  ];

  return (
    <div className="p-4 max-w-[600px] mx-auto pt-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('my')}
          className={clsx(
            "flex-1 pb-3 text-center font-bold text-lg transition-colors relative",
            activeTab === 'my' ? "text-[#31a3fa]" : "text-slate-400"
          )}
        >
          내문서함
          {activeTab === 'my' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#31a3fa]" />}
        </button>
        <button 
          onClick={() => setActiveTab('company')}
          className={clsx(
            "flex-1 pb-3 text-center font-bold text-lg transition-colors relative",
            activeTab === 'company' ? "text-[#31a3fa]" : "text-slate-400"
          )}
        >
          회사서류
          {activeTab === 'company' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#31a3fa]" />}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="문서명 검색" 
          className="w-full h-[50px] bg-white border border-slate-200 rounded-xl pl-12 pr-4 text-[16px] font-medium outline-none focus:border-[#31a3fa]"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {docs.map(doc => (
          <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={clsx(
              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
              doc.status === 'registered' ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-300"
            )}>
              <FileText size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{doc.title}</h3>
              <div className="text-xs text-slate-500 mt-1">
                {doc.status === 'registered' ? `등록일: ${doc.date}` : '미등록'}
              </div>
            </div>
            <div className="flex gap-2">
              {doc.status === 'registered' ? (
                <button className="p-2 text-slate-400 hover:text-[#31a3fa] hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye size={20} />
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-[#31a3fa] text-white text-xs font-bold rounded-lg">
                  등록
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
