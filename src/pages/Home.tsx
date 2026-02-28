import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { Manpower, WorkSet, Material, Photo, Drawing } from '../types';
import { 
  MapPin, Users, HardHat, Package, Image as ImageIcon, 
  Camera, ScanLine, ChevronDown, ChevronUp, Plus, X, 
  FileText, Zap, Receipt, AlertCircle, Send, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import Toast from '../components/ui/Toast';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusTracker from '../components/worklog/StatusTracker';
import DashboardCard from '../components/worklog/DashboardCard';
import BottomSheet from '../components/ui/BottomSheet';

const PREDEFINED_WORKERS = ['이현수', '김철수', '박영희', '정민수', '최지영'];
const MEMBER_CHIPS = ['슬라브', '거더', '기둥', '기타'];
const PROCESS_CHIPS = ['균열', '면', '마감', '기타'];
const TYPE_CHIPS = ['지하', '지상', '지붕', '기타'];

export default function Home() {
  const { sites, saveWorklog, getWorklogById } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [siteSearch, setSiteSearch] = useState('');
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [workDate, setWorkDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<'draft' | 'pending' | 'approved' | 'reject'>('draft');
  
  const [manpowerList, setManpowerList] = useState<Manpower[]>([
    { id: '1', name: '이현수', hours: 1.0, isCustom: false }
  ]);
  
  const [workSets, setWorkSets] = useState<WorkSet[]>([]);
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialQty, setMaterialQty] = useState('');
  const [selectedMaterialName, setSelectedMaterialName] = useState('NPC-1000');
  const [customMaterialName, setCustomMaterialName] = useState('');
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState<'manpower' | 'work' | 'material' | 'photo' | null>(null);

  // Load data if editing
  useEffect(() => {
    if (location.state?.logId) {
      const log = getWorklogById(location.state.logId);
      if (log) {
        setSelectedSiteId(log.siteId);
        const site = sites.find(s => s.id === log.siteId);
        if (site) setSiteSearch(site.name);
        setWorkDate(log.date);
        setManpowerList(log.manpower);
        setWorkSets(log.workSets);
        setMaterials(log.materials);
        setPhotos(log.photos);
        setDrawings(log.drawings);
        setStatus(log.status);
      }
    }
  }, [location.state, getWorklogById, sites]);

  // Derived
  const selectedSite = sites.find(s => s.id === selectedSiteId);
  const filteredSites = sites.filter(s => s.name.toLowerCase().includes(siteSearch.toLowerCase()));

  // Validation
  const isManpowerFilled = manpowerList.length > 0;
  const isWorkFilled = workSets.length > 0;
  const isPhotoFilled = photos.length > 0 || drawings.length > 0;
  const isReadyToSubmit = selectedSiteId && workDate && isManpowerFilled && isWorkFilled && isPhotoFilled;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Handlers
  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId);
    const site = sites.find(s => s.id === siteId);
    if (site) setSiteSearch(site.name);
    setShowSiteDropdown(false);
  };

  const addManpower = () => {
    setManpowerList(prev => [...prev, { id: String(Date.now()), name: '', hours: 1.0, isCustom: false }]);
  };

  const updateManpower = (id: string, field: keyof Manpower, value: any) => {
    setManpowerList(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeManpower = (id: string) => {
    setManpowerList(prev => prev.filter(m => m.id !== id));
  };

  const addWorkSet = () => {
    setWorkSets(prev => [...prev, { 
      id: String(Date.now()), 
      member: '', process: '', type: '', 
      location: { block: '', dong: '', floor: '' } 
    }]);
  };

  const updateWorkSet = (id: string, updates: Partial<WorkSet>) => {
    setWorkSets(prev => prev.map(ws => ws.id === id ? { ...ws, ...updates } : ws));
  };

  const updateWorkSetLocation = (id: string, field: keyof WorkSet['location'], value: string) => {
    setWorkSets(prev => prev.map(ws => ws.id === id ? { 
      ...ws, 
      location: { ...ws.location, [field]: value } 
    } : ws));
  };

  const removeWorkSet = (id: string) => {
    setWorkSets(prev => prev.filter(ws => ws.id !== id));
  };

  const addMaterial = () => {
    const name = selectedMaterialName === 'custom' ? customMaterialName : selectedMaterialName;
    const qty = parseFloat(materialQty);
    
    if (!name || !qty || qty <= 0) {
      triggerToast('자재명과 수량을 확인해주세요');
      return;
    }

    setMaterials(prev => [...prev, { id: String(Date.now()), name, quantity: qty, unit: '말' }]);
    setMaterialQty('');
    if (selectedMaterialName === 'custom') setCustomMaterialName('');
  };

  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos: Photo[] = Array.from(e.target.files).map((file: File) => ({
        id: String(Date.now()) + Math.random(),
        url: URL.createObjectURL(file),
        status: 'after',
        timestamp: new Date().toISOString()
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
      triggerToast(`${newPhotos.length}장의 사진이 등록되었습니다`);
    }
  };

  const handleDrawingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDrawings: Drawing[] = Array.from(e.target.files).map((file: File) => ({
        id: String(Date.now()) + Math.random(),
        url: URL.createObjectURL(file),
        status: 'progress',
        timestamp: new Date().toISOString()
      }));
      setDrawings(prev => [...prev, ...newDrawings]);
      triggerToast(`${newDrawings.length}건의 도면이 등록되었습니다`);
    }
  };

  const handleSave = (newStatus: 'draft' | 'pending' = 'draft') => {
    if (!selectedSiteId) { triggerToast('현장을 선택해주세요'); return; }
    if (!workDate) { triggerToast('작업일자를 선택해주세요'); return; }
    
    if (newStatus === 'pending') {
      if (!isManpowerFilled) { triggerToast('투입인원을 입력해주세요'); return; }
      if (!isWorkFilled) { triggerToast('작업내용을 입력해주세요'); return; }
      if (!isPhotoFilled) { triggerToast('사진 또는 도면을 등록해주세요'); return; }
    }

    saveWorklog({
      siteId: selectedSiteId,
      date: workDate,
      manpower: manpowerList,
      workSets,
      materials,
      photos,
      drawings,
      status: newStatus
    });

    setStatus(newStatus);
    triggerToast(newStatus === 'pending' ? '승인 요청되었습니다' : '임시저장되었습니다');
  };

  const handleReset = () => {
    if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) {
      setManpowerList([{ id: '1', name: '이현수', hours: 1.0, isCustom: false }]);
      setWorkSets([]);
      setMaterials([]);
      setPhotos([]);
      setDrawings([]);
      setStatus('draft');
      triggerToast('초기화되었습니다');
    }
  };

  // Summaries for cards
  const manpowerSummary = manpowerList.length > 0 
    ? `${manpowerList[0].name} 외 ${manpowerList.length - 1}명 (총 ${manpowerList.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)}공수)`
    : '입력된 인원이 없습니다.';

  const workSummary = workSets.length > 0
    ? `${workSets[0].process} (${workSets[0].location.dong} ${workSets[0].location.floor})`
    : '입력된 작업내용이 없습니다.';

  const materialSummary = materials.length > 0
    ? `${materials[0].name} (${materials[0].quantity}${materials[0].unit}) 외 ${materials.length - 1}건`
    : '입력된 자재가 없습니다.';

  const photoSummary = (photos.length > 0 || drawings.length > 0)
    ? `사진 ${photos.length}장, 도면 ${drawings.length}장`
    : '보수 전/후 사진이 필요합니다.';

  return (
    <div className="pb-24">
      {/* Header & Site Selector */}
      <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40">
        <div className="relative mb-2">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowSiteDropdown(!showSiteDropdown)}
          >
            <h1 className="text-2xl font-black text-[#1a254f] truncate pr-2">
              {selectedSite ? selectedSite.name : '현장 선택'}
            </h1>
            <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
              {selectedSite ? selectedSite.dept : '소속'}
            </span>
          </div>
          
          {showSiteDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-auto">
              <input 
                autoFocus
                placeholder="현장 검색..."
                className="w-full p-3 border-b border-slate-100 outline-none"
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
              />
              {filteredSites.map(site => (
                <div 
                  key={site.id}
                  onClick={() => handleSiteSelect(site.id)}
                  className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                >
                  <div className="font-bold text-slate-800">{site.name}</div>
                  <div className="text-xs text-slate-500">{site.dept}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <input 
          type="date" 
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          className="w-full h-[50px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-lg font-bold text-slate-700 outline-none focus:border-sky-500" 
        />
      </div>

      <div className="max-w-[600px] mx-auto p-4">
        {/* Tracker */}
        <StatusTracker status={status} />

        {/* Status Alert */}
        <div className={clsx(
          "mt-4 border rounded-xl p-4 flex items-start gap-3 mb-6",
          isReadyToSubmit ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
        )}>
          {isReadyToSubmit ? (
            <CheckCircle className="text-emerald-500 w-6 h-6 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="text-red-500 w-6 h-6 shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className={clsx("font-bold text-[15px] mb-1", isReadyToSubmit ? "text-emerald-600" : "text-red-600")}>
              {isReadyToSubmit ? "모든 작성이 완료되었습니다!" : "아직 제출할 수 없습니다!"}
            </h3>
            <p className={clsx("text-sm font-medium", isReadyToSubmit ? "text-emerald-500" : "text-red-500")}>
              {isReadyToSubmit 
                ? "하단의 버튼을 눌러 관리자에게 승인을 요청하세요." 
                : `${!isWorkFilled ? '작업내용' : ''} ${!isWorkFilled && !isPhotoFilled ? '과 ' : ''} ${!isPhotoFilled ? '사진 자료' : ''}가 누락되었습니다.`}
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <DashboardCard 
          title="투입 인원" 
          summary={manpowerSummary}
          icon={Users}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50"
          onClick={() => setActiveModal('manpower')}
        />

        <DashboardCard 
          title="작업 내용" 
          summary={workSummary}
          icon={HardHat}
          iconColor={isWorkFilled ? "text-amber-500" : "text-red-500"}
          iconBg={isWorkFilled ? "bg-amber-50" : "bg-red-100"}
          isMissing={!isWorkFilled}
          onClick={() => setActiveModal('work')}
        />

        <DashboardCard 
          title="자재 사용" 
          summary={materialSummary}
          icon={Package}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50"
          onClick={() => setActiveModal('material')}
        />

        <DashboardCard 
          title="사진 및 도면" 
          summary={photoSummary}
          icon={Camera}
          iconColor={isPhotoFilled ? "text-sky-500" : "text-red-500"}
          iconBg={isPhotoFilled ? "bg-sky-50" : "bg-red-100"}
          isMissing={!isPhotoFilled}
          onClick={() => setActiveModal('photo')}
        />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe flex gap-3 z-30 max-w-[600px] mx-auto">
        <button 
          onClick={() => handleSave('draft')}
          className="flex-1 h-[56px] rounded-xl font-bold text-lg bg-slate-100 text-slate-600 active:scale-95 transition-transform"
        >
          임시저장
        </button>
        <button 
          onClick={() => handleSave('pending')}
          disabled={!isReadyToSubmit}
          className={clsx(
            "flex-[2] h-[56px] rounded-xl font-bold text-lg text-white transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2",
            isReadyToSubmit ? "bg-[#1a254f]" : "bg-slate-300 cursor-not-allowed"
          )}
        >
          {status === 'pending' ? '요청 완료됨' : '승인 요청하기'}
          {status === 'pending' && <Send size={20} />}
        </button>
      </div>

      {/* Modals */}
      
      {/* Manpower Modal */}
      <BottomSheet 
        isOpen={activeModal === 'manpower'} 
        onClose={() => setActiveModal(null)}
        title="투입 인원 관리"
      >
        <div className="flex flex-col gap-3">
          {manpowerList.map((item) => (
            <div key={item.id} className="grid grid-cols-[1.2fr_1fr_auto] gap-2.5 items-center bg-[#f8fafc] p-3.5 rounded-2xl">
              <div className="relative">
                {item.isCustom ? (
                  <input 
                    autoFocus
                    value={item.name}
                    onChange={(e) => updateManpower(item.id, 'name', e.target.value)}
                    onBlur={() => !item.name && updateManpower(item.id, 'isCustom', false)}
                    placeholder="이름 입력"
                    className="w-full h-[50px] bg-white border border-slate-200 rounded-xl px-4 outline-none focus:border-[#31a3fa] text-[15px] font-medium"
                  />
                ) : (
                  <select 
                    value={item.name}
                    onChange={(e) => {
                      if (e.target.value === 'custom') updateManpower(item.id, 'isCustom', true);
                      else updateManpower(item.id, 'name', e.target.value);
                    }}
                    className="w-full h-[50px] bg-white border border-slate-200 rounded-xl px-4 outline-none focus:border-[#31a3fa] text-[15px] font-medium appearance-none"
                  >
                    <option value="">작업자 선택</option>
                    {PREDEFINED_WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                    <option value="custom">직접입력</option>
                  </select>
                )}
              </div>
              
              <div className="flex h-[48px] border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button onClick={() => updateManpower(item.id, 'hours', Math.max(0, item.hours - 0.5))} className="flex-1 flex items-center justify-center text-slate-400 hover:bg-slate-50">-</button>
                <span className="flex-1 flex items-center justify-center text-base font-bold border-x border-slate-100">{item.hours.toFixed(1)}</span>
                <button onClick={() => updateManpower(item.id, 'hours', Math.min(3.5, item.hours + 0.5))} className="flex-1 flex items-center justify-center text-slate-400 hover:bg-slate-50">+</button>
              </div>

              <button onClick={() => removeManpower(item.id)} className="bg-red-50 text-red-500 p-2 rounded-xl">
                <X size={18} />
              </button>
            </div>
          ))}
          <button onClick={addManpower} className="w-full h-[56px] bg-[#eaf6ff] text-[#31a3fa] rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors mt-2">
            <Plus size={20} strokeWidth={3} /> 인원 추가
          </button>
        </div>
      </BottomSheet>

      {/* Work Modal */}
      <BottomSheet 
        isOpen={activeModal === 'work'} 
        onClose={() => setActiveModal(null)}
        title="작업 내용 관리"
      >
        <div className="flex flex-col gap-6">
          {workSets.map((ws, idx) => (
            <div key={ws.id} className="bg-white border-2 border-[#31a3fa] rounded-2xl p-5 relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-[#31a3fa] bg-[#eaf6ff] px-3 py-1.5 rounded-lg">작업 세트 {idx + 1}</span>
                <button onClick={() => removeWorkSet(ws.id)} className="text-red-500 text-sm font-bold px-2">삭제</button>
              </div>

              <div className="mb-4">
                <label className="block text-[15px] font-bold text-slate-500 mb-2">부재명</label>
                <div className="grid grid-cols-4 gap-2">
                  {MEMBER_CHIPS.map(chip => (
                    <button 
                      key={chip}
                      onClick={() => updateWorkSet(ws.id, { member: chip })}
                      className={clsx(
                        "h-[48px] rounded-xl border text-[15px] font-medium transition-all",
                        ws.member === chip ? "bg-white border-[#31a3fa] text-[#31a3fa] font-bold shadow-sm" : "bg-[#f8fafc] border-slate-200 text-slate-500"
                      )}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                {ws.member === '기타' && (
                  <input 
                    placeholder="직접 입력"
                    value={ws.customMember || ''}
                    onChange={(e) => updateWorkSet(ws.id, { customMember: e.target.value })}
                    className="w-full h-[48px] border border-slate-200 rounded-xl px-4 mt-2 outline-none focus:border-[#31a3fa]"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[15px] font-bold text-slate-500 mb-2">작업공정</label>
                <div className="grid grid-cols-4 gap-2">
                  {PROCESS_CHIPS.map(chip => (
                    <button 
                      key={chip}
                      onClick={() => updateWorkSet(ws.id, { process: chip })}
                      className={clsx(
                        "h-[48px] rounded-xl border text-[15px] font-medium transition-all",
                        ws.process === chip ? "bg-white border-[#31a3fa] text-[#31a3fa] font-bold shadow-sm" : "bg-[#f8fafc] border-slate-200 text-slate-500"
                      )}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                {ws.process === '기타' && (
                  <input 
                    placeholder="직접 입력"
                    value={ws.customProcess || ''}
                    onChange={(e) => updateWorkSet(ws.id, { customProcess: e.target.value })}
                    className="w-full h-[48px] border border-slate-200 rounded-xl px-4 mt-2 outline-none focus:border-[#31a3fa]"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[15px] font-bold text-slate-500 mb-2">작업유형</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPE_CHIPS.map(chip => (
                    <button 
                      key={chip}
                      onClick={() => updateWorkSet(ws.id, { type: chip })}
                      className={clsx(
                        "h-[48px] rounded-xl border text-[15px] font-medium transition-all",
                        ws.type === chip ? "bg-white border-[#31a3fa] text-[#31a3fa] font-bold shadow-sm" : "bg-[#f8fafc] border-slate-200 text-slate-500"
                      )}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[15px] font-bold text-slate-500 mb-2">위치 (블럭/동/층)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="블럭" value={ws.location.block} onChange={(e) => updateWorkSetLocation(ws.id, 'block', e.target.value)} className="h-[48px] border border-slate-200 rounded-xl px-3 text-center outline-none focus:border-[#31a3fa] bg-[#f8fafc]" />
                  <input placeholder="동" value={ws.location.dong} onChange={(e) => updateWorkSetLocation(ws.id, 'dong', e.target.value)} className="h-[48px] border border-slate-200 rounded-xl px-3 text-center outline-none focus:border-[#31a3fa] bg-[#f8fafc]" />
                  <input placeholder="층" value={ws.location.floor} onChange={(e) => updateWorkSetLocation(ws.id, 'floor', e.target.value)} className="h-[48px] border border-slate-200 rounded-xl px-3 text-center outline-none focus:border-[#31a3fa] bg-[#f8fafc]" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addWorkSet} className="w-full h-[56px] bg-[#eaf6ff] text-[#31a3fa] rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors">
            <Plus size={20} strokeWidth={3} /> 작업 추가
          </button>
        </div>
      </BottomSheet>

      {/* Material Modal */}
      <BottomSheet 
        isOpen={activeModal === 'material'} 
        onClose={() => setActiveModal(null)}
        title="자재 사용 내역"
      >
        <div className="grid grid-cols-[1.8fr_1fr_auto] gap-2.5 mb-3 items-center">
          <select 
            value={selectedMaterialName}
            onChange={(e) => setSelectedMaterialName(e.target.value)}
            className="w-full h-[48px] bg-[#f8fafc] border border-slate-200 rounded-xl px-4 text-[15px] font-medium outline-none appearance-none"
          >
            <option value="NPC-1000">NPC-1000</option>
            <option value="NPC-3000Q">NPC-3000Q</option>
            <option value="custom">직접입력</option>
          </select>
          <div className="flex items-center bg-[#f8fafc] border border-slate-200 rounded-xl h-[48px] px-3">
            <input 
              type="number" 
              value={materialQty}
              onChange={(e) => setMaterialQty(e.target.value)}
              placeholder="0" 
              className="flex-1 bg-transparent text-right font-medium outline-none w-full" 
            />
            <span className="text-slate-500 text-[15px] font-medium ml-1">말</span>
          </div>
          <button onClick={addMaterial} className="w-12 h-[48px] bg-[#eaf6ff] text-[#31a3fa] rounded-xl font-black text-lg flex items-center justify-center hover:bg-sky-100">
            <Plus size={20} />
          </button>
        </div>

        {selectedMaterialName === 'custom' && (
          <div className="flex gap-2 items-center mb-3">
            <input 
              value={customMaterialName}
              onChange={(e) => setCustomMaterialName(e.target.value)}
              className="flex-1 h-[48px] bg-[#f8fafc] border border-slate-200 rounded-xl px-4 outline-none focus:border-[#31a3fa]"
              placeholder="자재명 직접 입력"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {materials.map(mat => (
            <div key={mat.id} className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center text-[15px]">
              <div>
                <span className="font-semibold">{mat.name}</span>
                <span className="text-[#31a3fa] ml-2 font-bold">{mat.quantity}말</span>
              </div>
              <button onClick={() => removeMaterial(mat.id)} className="text-red-500 p-1">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Photo Modal */}
      <BottomSheet 
        isOpen={activeModal === 'photo'} 
        onClose={() => setActiveModal(null)}
        title="사진 및 도면"
      >
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <div className="text-[15px] font-bold text-slate-500 mb-2">사진등록</div>
            <label className="w-full h-[50px] border border-dashed border-sky-400 bg-sky-50 text-sky-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors cursor-pointer">
              <Camera size={20} /> 사진 등록
              <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div>
            <div className="text-[15px] font-bold text-slate-500 mb-2">도면마킹</div>
            <label className="w-full h-[50px] border border-dashed border-teal-400 bg-teal-50 text-teal-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-100 transition-colors cursor-pointer">
              <ScanLine size={20} /> 도면 등록
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleDrawingUpload} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {photos.map(p => (
            <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
              <img src={p.url} className="w-full h-full object-cover" alt="work" />
              <span className={clsx("absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold text-white rounded", p.status === 'before' ? 'bg-slate-700' : 'bg-blue-500')}>
                {p.status === 'before' ? '보수전' : '보수후'}
              </span>
            </div>
          ))}
          {drawings.map(d => (
            <div key={d.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              <img src={d.url} className="w-full h-full object-contain" alt="drawing" />
              <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold text-white rounded bg-teal-500">
                도면
              </span>
            </div>
          ))}
        </div>
      </BottomSheet>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
