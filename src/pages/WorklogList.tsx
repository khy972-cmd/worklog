import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/store';
import { Worklog } from '../types';
import { 
  Search, Filter, Calendar, Users, HardHat, Camera, 
  MapPin, ChevronDown, Star, MoreVertical, AlertCircle,
  CheckCircle, Clock, XCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

type StatusFilter = 'all' | 'draft' | 'pending' | 'approved' | 'reject';
type SortFilter = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

export default function WorklogList() {
  const { sites, worklogs } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortFilter, setSortFilter] = useState<SortFilter>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedWorklogs = useMemo(() => {
    let filtered = worklogs.filter(log => {
      const site = sites.find(s => s.id === log.siteId);
      if (!site) return false;
      
      const matchesSearch = searchTerm === '' || 
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.dept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const siteA = sites.find(s => s.id === a.siteId);
      const siteB = sites.find(s => s.id === b.siteId);
      
      switch (sortFilter) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'name-asc':
          return (siteA?.name || '').localeCompare(siteB?.name || '');
        case 'name-desc':
          return (siteB?.name || '').localeCompare(siteA?.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [worklogs, sites, searchTerm, statusFilter, sortFilter]);

  const getStatusBadge = (status: Worklog['status']) => {
    const variants = {
      draft: { bg: 'bg-blue-100', text: 'text-blue-700', label: '작성중', icon: Clock },
      pending: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: '요청', icon: AlertCircle },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '승인', icon: CheckCircle },
      reject: { bg: 'bg-red-100', text: 'text-red-700', label: '반려', icon: XCircle }
    };
    
    const variant = variants[status];
    const Icon = variant.icon;
    
    return (
      <span className={clsx(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
        variant.bg, variant.text
      )}>
        <Icon size={12} />
        {variant.label}
      </span>
    );
  };

  const getWorklogSummary = (log: Worklog) => {
    const manpowerCount = log.manpower.length;
    const totalHours = log.manpower.reduce((sum, m) => sum + m.hours, 0);
    const workSetCount = log.workSets.length;
    const photoCount = log.photos.length;
    const drawingCount = log.drawings.length;
    
    return {
      manpower: `${manpowerCount}명 (${totalHours.toFixed(1)}공수)`,
      work: `${workSetCount}개 작업`,
      media: `사진 ${photoCount}장, 도면 ${drawingCount}장`
    };
  };

  const handleWorklogClick = (log: Worklog) => {
    navigate('/', { state: { logId: log.id } });
  };

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return worklogs.length;
    return worklogs.filter(log => log.status === status).length;
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-black text-[#1a254f] mb-3">작업일지 목록</h1>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="현장명 또는 소속 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[54px] pl-10 pr-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[17px] font-medium outline-none focus:border-[#31a3fa] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Filter size={16} />
              필터
              <ChevronDown size={14} className={clsx('transition-transform', showFilters && 'rotate-180')} />
            </button>
            
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value as SortFilter)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#31a3fa]"
            >
              <option value="date-desc">최신순</option>
              <option value="date-asc">오래된순</option>
              <option value="name-asc">현장명 A-Z</option>
              <option value="name-desc">현장명 Z-A</option>
            </select>
          </div>

          {/* Filter Chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="filter-section">
                  <div className="filter-row-scroll">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={clsx(
                        'filter-chip status-all',
                        statusFilter === 'all' && 'active'
                      )}
                    >
                      전체 ({getStatusCount('all')})
                    </button>
                    <button
                      onClick={() => setStatusFilter('draft')}
                      className={clsx(
                        'filter-chip status-draft',
                        statusFilter === 'draft' && 'active'
                      )}
                    >
                      작성중 ({getStatusCount('draft')})
                    </button>
                    <button
                      onClick={() => setStatusFilter('pending')}
                      className={clsx(
                        'filter-chip status-pending',
                        statusFilter === 'pending' && 'active'
                      )}
                    >
                      요청 ({getStatusCount('pending')})
                    </button>
                    <button
                      onClick={() => setStatusFilter('reject')}
                      className={clsx(
                        'filter-chip status-reject',
                        statusFilter === 'reject' && 'active'
                      )}
                    >
                      반려 ({getStatusCount('reject')})
                    </button>
                    <button
                      onClick={() => setStatusFilter('approved')}
                      className={clsx(
                        'filter-chip status-approved',
                        statusFilter === 'approved' && 'active'
                      )}
                    >
                      승인 ({getStatusCount('approved')})
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="sum-card" onClick={() => setStatusFilter('all')}>
          <div className="sum-val">{worklogs.length}</div>
          <div className="sum-label">전체</div>
        </div>
        <div className="sum-card" onClick={() => setStatusFilter('draft')}>
          <div className="sum-val">{getStatusCount('draft')}</div>
          <div className="sum-label">작성중</div>
        </div>
        <div className="sum-card" onClick={() => setStatusFilter('pending')}>
          <div className="sum-val">{getStatusCount('pending')}</div>
          <div className="sum-label">요청</div>
        </div>
        <div className="sum-card" onClick={() => setStatusFilter('approved')}>
          <div className="sum-val">{getStatusCount('approved')}</div>
          <div className="sum-label">승인</div>
        </div>
      </div>

      {/* Worklog List */}
      <div className="space-y-4 pb-8">
        <AnimatePresence>
          {filteredAndSortedWorklogs.map((log) => {
            const site = sites.find(s => s.id === log.siteId);
            if (!site) return null;
            
            const summary = getWorklogSummary(log);
            const isRejected = log.status === 'reject';
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => handleWorklogClick(log)}
                className={clsx(
                  'site-card cursor-pointer',
                  isRejected && 'reject-item',
                  site.pinned && 'pinned-item'
                )}
              >
                {/* Status Badge */}
                <div className="site-badge bdg-{log.status}">
                  {log.status === 'draft' && '작성중'}
                  {log.status === 'pending' && '요청'}
                  {log.status === 'approved' && '승인'}
                  {log.status === 'reject' && '반려'}
                </div>

                <div className="card-header-main">
                  {/* Date and Site Info */}
                  <div className="site-date">
                    <Calendar size={14} />
                    {new Date(log.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>

                  <div className="site-top-row">
                    <div>
                      <div className="site-name-text">{site.name}</div>
                      <div className="site-sub-info">
                        <div className="site-sub-left">
                          <span className="sub-badge dept">{site.dept}</span>
                          {site.pinned && (
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Summary */}
                  <div className="work-text-summary">
                    {log.workSets.length > 0 && (
                      <>
                        <span>{log.workSets[0].process}</span>
                        <span className="text-gray-400">
                          ({log.workSets[0].location.dong} {log.workSets[0].location.floor})
                        </span>
                        {log.workSets.length > 1 && (
                          <span className="text-gray-400 text-sm">
                            외 {log.workSets.length - 1}개
                          </span>
                        )}
                      </>
                    )}
                    {log.version > 1 && (
                      <span className="ver-badge-card">v{log.version}</span>
                    )}
                  </div>

                  {/* Indicators */}
                  <div className="indicator-group">
                    <div className={clsx('data-icon-wrap', log.manpower.length > 0 && 'active')}>
                      <Users className="icon-svg" size={14} />
                      <span>{summary.manpower}</span>
                    </div>
                    <div className={clsx('data-icon-wrap', log.workSets.length > 0 && 'active')}>
                      <HardHat className="icon-svg" size={14} />
                      <span>{summary.work}</span>
                    </div>
                    <div className={clsx('data-icon-wrap', (log.photos.length > 0 || log.drawings.length > 0) && 'active')}>
                      <Camera className="icon-svg" size={14} />
                      <span>{summary.media}</span>
                    </div>
                  </div>

                  {/* Reject Reason */}
                  {isRejected && log.rejectReason && (
                    <div className="reject-msg">
                      <AlertCircle size={14} />
                      {log.rejectReason}
                    </div>
                  )}

                  {/* Bottom Info */}
                  <div className="bottom-info-row">
                    <div className="manpower-info">
                      <MapPin size={14} />
                      {site.address?.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div className="history-info">
                      {new Date(log.updatedAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAndSortedWorklogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <div className="text-gray-500 font-medium">
              {searchTerm || statusFilter !== 'all' 
                ? '검색 결과가 없습니다.' 
                : '작업일지가 없습니다.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
